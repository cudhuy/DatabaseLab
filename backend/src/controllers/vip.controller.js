const { v4: uuidv4 } = require("uuid");
const voucherCodes = require("voucher-code-generator");
const mssql = require("mssql");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");
const { emailService } = require("../services");
const cloudinary = require("../utils/cloudinary");

const getAllVip = async (req, res, next) => {
  const request = new mssql.Request();
  const vips = (
    await request.query(`SELECT * , 
  CASE WHEN dateEnd>CAST(CURRENT_TIMESTAMP AS DATE) THEN 1
  ELSE 0 END AS status 
  FROM  Vip  `)
  ).recordset;
  res.json(vips);
};
const getVipById = async (req, res, next) => {
  if (!req.params.uuid) {
    const err = new Error("No uuid is provide!");
    err.statusCode = 400;
    return next(err);
  }
  const request = new mssql.Request();
  const vipQuery = await request.query(`SELECT * FROM Vip where _id='${req.params.uuid}'`);
  if (vipQuery.recordset.length <= 0) {
    const err = new Error("Vip Not found!");
    err.statusCode = 404;
    return next(err);
  }
  res.json(vipQuery.recordset[0]);
};
const getVipByCode = async (req, res, next) => {
  if (!req.params.code) {
    const err = new Error("No code is provide!");
    err.statusCode = 400;
    return next(err);
  }
  const request = new mssql.Request();
  const vipQuery = await request.query(`SELECT * FROM Vip where vipCode='${req.params.code}'`);
  if (vipQuery.recordset.length <= 0) {
    const err = new Error("Vip Not found!");
    err.statusCode = 404;
    return next(err);
  }
  res.json(vipQuery.recordset[0]);
};
const getVipbyPhone = async (req, res, next) => {
  if (!req.body.phone) {
    const err = new Error("Lacks of field");
    err.statusCode = 404;
    return next(err);
  }
  const request = new mssql.Request();
  const vipQuery = await request.query(`SELECT * FROM Vip where phone='${req.body.phone}'`);
  if (vipQuery.recordset.length <= 0) {
    const err = new Error("Vip Not found!");
    err.statusCode = 404;
    return next(err);
  }
  res.json(vipQuery.recordset[0]);
};
const createVip = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.phone || !req.body.name) {
      const err = new Error("Lack of field");
      err.statusCode = 404;
      return next(err);
    }
    const request = new mssql.Request();
    const _id = uuidv4();
    const qrCode = await QRCode.toDataURL(_id);
    const qr_result = await cloudinary.uploader.upload(qrCode);
    if (!qr_result) {
      const err = new Error("Can not upload image");
      err.statusCode = 400;
      return next(err);
    }
    await request.query(`INSERT INTO Images(url,cloudinaryId) VALUES('${qr_result.secure_url}','${qr_result.public_id}')`);
    const vipCode = await voucherCodes.generate({
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
    await request.query(`INSERT INTO Users(loginName,password,role) VALUES ('${req.body.phone}','${hash}','customer')`);
    const userId = (await request.query("SELECT TOP 1 * FROM Users where role='customer' Order By id DESC")).recordset[0].id;
    // const user = await User.create({ loginName: req.body.phone, password: hash, role: "customer" });
    await request.query(`INSERT INTO Vip(email,name,vipCode,phone,point,dateEnd,_id,userId,qrImage)
     VALUES('${req.body.email}',N'${req.body.name}','${vipCode}','${req.body.phone}',
              '1000','${dateEnd}','${_id}','${userId}','${qr_result.public_id}')`);
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
    return next(err);
  }
};
const updateVip = async (req, res, next) => {
  if (req.body.name && req.body.email && req.body.phone && !req.body.code && !req.body.uuid) {
    const { name, email, phone } = req.body;
    const request = new mssql.Request();
    const vip = (
      await request.query(`SELECT * FROM Vip,Images where name='${name}' AND email='${email}' AND phone='${phone}'
                  AND Vip.qrImage=Images.cloudinaryId `)
    ).recordset[0];
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
      await request.query(`UPDATE Users SET password='${hash}' where id='${vip.userId}'`);
      const data = { to: vip.email, subject: "Here is your VIP information" };
      await emailService.sendEjsMail({
        template: "mailinfovip",
        templateVars: { code: vip.vipCode, qr: vip.url, name: req.body.name, password: randomPassWord },
        ...data,
      });
      return res.json(vip);
    }
    const data = { to: vip.email, subject: "Here is your VIP information" };
    await emailService.sendEjsMail({
      template: "mailinfovip",
      templateVars: { code: vip.vipCode, qr: vip.url, name: req.body.name, password: "..." },
      ...data,
    });
    res.json(vip);
  } else if (req.body.code || req.body.uuid) {
    let vip;
    const request = new mssql.Request();
    await request.query(`SELECT * FROM Vip where vipCode='${req.params.code}'`);

    if (req.body.code) {
      vip = (await request.query(`SELECT * FROM Vip where vipCode='${req.body.code}'`)).recordset[0];
    } else vip = (await request.query(`SELECT * FROM Vip where _id='${req.body.uuid}'`)).recordset[0];
    if (!vip) {
      const err = new Error("Cannot found!");
      err.statusCode = 404;
      return next(err);
    }
    if (req.body.extend) {
      const dateEnd = new Date(new Date(vip.dateEnd).getTime() + 365 * 24 * 60 * 60 * 1000).toJSON();
      await request.query(`UPDATE Vip SET dateEnd='${dateEnd}' where _id='${vip._id}'`);
    } else {
      await Promise.all([
        request.query(
          `UPDATE Vip SET name='${req.body.name}',phone='${req.body.phone}',email='${req.body.email}' where _id='${vip._id}'`
        ),
        request.query(`UPDATE Users SET loginName='${req.body.phone}' where id='${vip.userId}'`),
      ]);
    }
    res.status(200).json(vip);
  }
};
const deleteVip = async (req, res, next) => {
  if (!req.body.listUuid) {
    const err = new Error("Lack of field");
    err.statusCode = 404;
    return next(err);
  }
  const request = new mssql.Request();
  const inList = req.body.listUuid.map(el => `'${el}'`).join(",");
  const vips = (await request.query(`SELECT * From Vip,Users where Vip._id in(${inList})`)).recordset[0];
  console.log(vips);
  await request.query(`DELETE FROM Vip where _id='${vips._id}'`);
  await request.query(`DELETE FROM Users where loginName='${vips.phone}'`);

  res.send("Delete successfully");
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
