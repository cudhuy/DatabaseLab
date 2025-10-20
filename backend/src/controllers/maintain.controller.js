const { Pool } = require("pg");
const pool = new Pool();
const cloudinary = require("../utils/cloudinary");

const getMaintainance = async (req, res, next) => {
  try {
    let { listId, listStatus, sort } = req.query;
    const { start, end, search } = req.query;
    if (listId) {
      listId = JSON.parse(listId);
      if (listId.length === 0) listId = undefined;
    }
    if (listStatus) {
      listStatus = JSON.parse(listStatus);
      if (listStatus.length === 0) listStatus = undefined;
    }
    if (!sort || sort === 1) sort = 1;
    else sort = -1;

    const baseQuery = `SELECT * FROM Maintainance
  Left join Game on Maintainance.gameId=Game.id
  Left join Images on Images.cloudinaryId=Maintainance.imageId  where 
  ${listId ? `gameId in (${listId.map(el => `'${el}'`).join(",")})` : `1=1`} AND
  ${listStatus ? `status in (${listStatus.map(el => `'${el}'`).join(",")})` : `1=1`} AND
  ${start ? `date > CAST ('${start}' as timestamp)` : `1=1`} AND
  ${end ? `date < CAST ('${end}' as timestamp)` : `1=1`} AND
  ${search ? `title LIKE '%${search}%'` : `1=1`}
  ORDER BY date ${sort === 1 ? "ASC" : "DESC"}`;

    const maintain = await pool.query(baseQuery);
    res.json({ docs: maintain.rows });
  } catch (e) {
    next(e);
  }
};
const createMaintainace = async (req, res, next) => {
  try {
    const date = new Date().toJSON();
    if (!req.file) {
      await pool.query("INSERT INTO Maintainance(gameId,description,status,date,title) VALUES($1,$2,$3,$4)", [
        req.body.gameId,
        req.body.description || "no description",
        req.body.status || 0,
        date,
      ]);
      const lastMaintain = await pool.query("SELECT _id from Maintainance Order by _id DESC LIMIT 1");
      res.status(200).json({ ...lastMaintain.rows[0] });
    } else {
      const result = await cloudinary.uploader.upload(req.file.path);
      if (!result) {
        const err = new Error("Can not upload image");
        err.statusCode = 400;
        return next(err);
      }
      await pool.query("INSERT INTO Images(url,cloudinaryId) VALUES ($1,$2)", [result.secure_url, result.public_id]);
      await pool.query("INSERT INTO Maintainance(gameId,description,status,date,title,imageId) VALUES($1,$2,$3,$4,$5)", [
        req.body.gameId,
        req.body.description || "no description",
        req.body.status || 0,
        date,
        req.body.title,
        result.public_id,
      ]);
      const lastMaintain = await pool.query("SELECT * from Maintainance Order by _id DESC LIMIT 1");
      res.status(200).json({ ...lastMaintain.rows[0], image: { url: result.secure_url } });
    }
  } catch (e) {
    next(e);
  }
};
const updateMaintainance = async (req, res, next) => {
  try {
    let updateBody = { ...req.body };
    const date = new Date().toJSON();
    const maintainQuery = await pool.query(
      "SELECT * From Maintainance LEFT JOIN Images on Maintainance.imageId=Images.cloudinaryId where _id=$1",
      [req.params.id]
    );
    if (maintainQuery.rows.length <= 0) {
      const err = new Error("Can find Maintainance");
      err.statusCode = 404;
      return next(err);
    }
    const maintain = maintainQuery.rows[0];
    let result = {};
    if (req.file) {
      if (maintain.imageid || maintain.imageId) {
        try {
          await cloudinary.uploader.destroy(maintain.imageid || maintain.imageId);
        } catch (e) {}
      }
      result = await cloudinary.uploader.upload(req.file.path);
      await pool.query("INSERT INTO Images(url,cloudinaryId) VALUES($1,$2)", [result.secure_url, result.public_id]);
      if (!result) {
        const err = new Error("Can not upload avatar");
        err.statusCode = 400;
        return next(err);
      }
    }
    updateBody = {
      title: req.body.title ? req.body.title : maintain.title,
      status: req.body.status ? req.body.status : maintain.status,
      description: req.body.description ? req.body.description : maintain.description,
      date,
      image: {
        cloudinary_id: result.public_id ? result.public_id : maintain.imageid || maintain.imageId,
        url: result.secure_url ? result.secure_url : maintain.url,
      },
    };
    await pool.query("UPDATE Maintainance SET status=$1, description=$2, title=$3, imageId=$4, date=$5 where _id=$6", [
      updateBody.status,
      updateBody.description,
      updateBody.title,
      updateBody.image.cloudinary_id,
      date,
      maintain._id,
    ]);
    if (req.file) pool.query("DELETE FROM Images where cloudinaryId=$1", [maintain.imageid || maintain.imageId]);
    res.status(200).json(updateBody);
  } catch (e) {
    next(e);
  }
};
const deleteMaintainace = async (req, res, next) => {
  try {
    const { listId } = req.body;
    if (!listId) {
      const err = Error("Lack of listId");
      err.statusCode = 400;
      return next(err);
    }
    const inList = listId.map(el => `'${el}'`).join(",");
    const maintains = (await pool.query(`SELECT * FROM Maintainance where _id in (${inList})`)).rows;
    await pool.query(`DELETE FROM Maintainance where _id in (${inList})`);
    for (const maintain of maintains) {
      if (maintain.imageid || maintain.imageId) {
        try {
          await cloudinary.uploader.destroy(maintain.imageid || maintain.imageId);
        } catch (e) {}
        pool.query("DELETE FROM Images where cloudinaryId=$1", [maintain.imageid || maintain.imageId]);
      }
    }
    res.send("Delete Successfully");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getMaintainance,
  createMaintainace,
  updateMaintainance,
  deleteMaintainace,
};
