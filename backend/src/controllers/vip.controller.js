const { v4: uuidv4 } = require("uuid");
const voucherCodes = require("voucher-code-generator");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const { emailService } = require("../services");
const cloudinary = require("../utils/cloudinary");

const pool = new Pool();

const getAllVip = async (req, res, next) => {
  try {
    const vipsRes = await pool.query(`
      SELECT *, CASE WHEN dateEnd>CURRENT_DATE THEN 1 ELSE 0 END AS status FROM Vip ORDER BY _id
    `);
    res.json(vipsRes.rows);
  } catch (e) {
    next(e);
  }
};
const getVipById = async (req, res, next) => {
  try {
    if (!req.params.uuid) {
      const err = new Error("No uuid is provide!");
      err.statusCode = 400;
      return next(err);
    }
    const vipRes = await pool.query("SELECT * FROM Vip where _id=$1", [req.params.uuid]);
    if (vipRes.rows.length <= 0) {
      const err = new Error("Vip Not found!");
      err.statusCode = 404;
      return next(err);
    }
    res.json(vipRes.rows[0]);
  } catch (e) {
    next(e);
  }
};
const getVipByCode = async (req, res, next) => {
  try {
    if (!req.params.code) {
      const err = new Error("No code is provide!");
      err.statusCode = 400;
      return next(err);
    }
    const vipRes = await pool.query("SELECT * FROM Vip where vipCode=$1", [req.params.code]);
    if (vipRes.rows.length <= 0) {
      const err = new Error("Vip Not found!");
      err.statusCode = 404;
      return next(err);
    }
    res.json(vipRes.rows[0]);
  } catch (e) {
    next(e);
  }
};
const getVipbyPhone = async (req, res, next) => {
  try {
    if (!req.body.phone) {
      const err = new Error("Lacks of field");
      err.statusCode = 404;
      return next(err);
    }
    const vipRes = await pool.query("SELECT * FROM Vip where phone=$1", [req.body.phone]);
    if (vipRes.rows.length <= 0) {
      const err = new Error("Vip Not found!");
      err.statusCode = 404;
      return next(err);
    }
    res.json(vipRes.rows[0]);
  } catch (e) {
    next(e);
  }
};
const createVip = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.phone || !req.body.name) {
      const err = new Error("Lack of field");
      err.statusCode = 404;
      return next(err);
    }
    const _id = uuidv4();
    const qrCode = await QRCode.toDataURL(_id);
    const qr_result = await cloudinary.uploader.upload(qrCode);
    if (!qr_result) {
      const err = new Error("Can not upload image");
      err.statusCode = 400;
      return next(err);
    }
    await pool.query("INSERT INTO Images(url,cloudinaryId) VALUES($1,$2)", [qr_result.secure_url, qr_result.public_id]);
    const vipCode = voucherCodes.generate({
      length: 5,
      charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    })[0];
    const dateEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toJSON();
    const randomPassWord = voucherCodes.generate({
      length: 8,
      charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    })[0];
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(randomPassWord, salt);
    await pool.query("INSERT INTO Users(loginName,password,role) VALUES($1,$2,$3)", [req.body.phone, hash, "customer"]);
    const userIdRes = await pool.query("SELECT id FROM Users WHERE role=$1 ORDER BY id DESC LIMIT 1", ["customer"]);
    const userId = userIdRes.rows[0].id;
    await pool.query(
      "INSERT INTO Vip(email,name,vipCode,phone,point,dateEnd,_id,userId,qrImage) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [req.body.email, req.body.name, vipCode, req.body.phone, 1000, dateEnd, _id, userId, qr_result.public_id]
    );
    const data = { to: req.body.email, subject: "Here is your VIP information" };
    await emailService.sendEjsMail({
      template: "mailinfovip",
      templateVars: { code: vipCode, qr: qr_result.secure_url, name: req.body.name, password: randomPassWord },
      ...data,
    });
    res.status(200).json({ vipCode });
  } catch (err) {
    const e = new Error("Cannot create");
    e.statusCode = 400;
    return next(e);
  }
};
const updateVip = async (req, res, next) => {
  try {
    if (req.body.name && req.body.email && req.body.phone && !req.body.code && !req.body.uuid) {
      const { name, email, phone } = req.body;
      const vipRes = await pool.query(
        "SELECT * FROM Vip LEFT JOIN Images on Vip.qrImage=Images.cloudinaryId WHERE name=$1 AND email=$2 AND phone=$3",
        [name, email, phone]
      );
      const vip = vipRes.rows[0];
      if (!vip) {
        const err = new Error("Cannot found!");
        err.statusCode = 404;
        return next(err);
      }
      if (req.body.password) {
        const randomPassWord = voucherCodes.generate({
          length: 8,
          charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        })[0];
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(randomPassWord, salt);
        await pool.query("UPDATE Users SET password=$1 where id=$2", [hash, vip.userid || vip.userId]);
        const data = { to: vip.email, subject: "Here is your VIP information" };
        await emailService.sendEjsMail({
          template: "mailinfovip",
          templateVars: { code: vip.vipcode || vip.vipCode, qr: vip.url, name: req.body.name, password: randomPassWord },
          ...data,
        });
        return res.json(vip);
      }
      const data = { to: vip.email, subject: "Here is your VIP information" };
      await emailService.sendEjsMail({
        template: "mailinfovip",
        templateVars: { code: vip.vipcode || vip.vipCode, qr: vip.url, name: req.body.name, password: "..." },
        ...data,
      });
      res.json(vip);
    } else if (req.body.code || req.body.uuid) {
      let vip;
      if (req.body.code) {
        const vipRes = await pool.query("SELECT * FROM Vip where vipCode=$1", [req.body.code]);
        vip = vipRes.rows[0];
      } else {
        const vipRes = await pool.query("SELECT * FROM Vip where _id=$1", [req.body.uuid]);
        vip = vipRes.rows[0];
      }
      if (!vip) {
        const err = new Error("Cannot found!");
        err.statusCode = 404;
        return next(err);
      }
      if (req.body.extend) {
        const dateEnd = new Date(new Date(vip.dateend || vip.dateEnd).getTime() + 365 * 24 * 60 * 60 * 1000).toJSON();
        await pool.query("UPDATE Vip SET dateEnd=$1 where _id=$2", [dateEnd, vip._id]);
      } else {
        await Promise.all([
          pool.query("UPDATE Vip SET name=$1, phone=$2, email=$3 where _id=$4", [
            req.body.name,
            req.body.phone,
            req.body.email,
            vip._id,
          ]),
          pool.query("UPDATE Users SET loginName=$1 where id=$2", [req.body.phone, vip.userid || vip.userId]),
        ]);
      }
      res.status(200).json(vip);
    } else {
      res.status(400).send("Bad request");
    }
  } catch (e) {
    next(e);
  }
};
const deleteVip = async (req, res, next) => {
  try {
    if (!req.body.listUuid) {
      const err = new Error("Lack of field");
      err.statusCode = 404;
      return next(err);
    }
    const inList = req.body.listUuid.map(el => el).join("','");
    const vipsRes = await pool.query("SELECT * From Vip WHERE _id = ANY($1::text[])", [req.body.listUuid]);
    const vips = vipsRes.rows;
    for (const v of vips) {
      await pool.query("DELETE FROM Vip where _id=$1", [v._id]);
      await pool.query("DELETE FROM Users where loginName=$1", [v.phone]);
    }
    res.send("Delete successfully");
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllVip,
  createVip,
  updateVip,
  deleteVip,
  getVipbyPhone,
  getVipById,
  getVipByCode,
};
