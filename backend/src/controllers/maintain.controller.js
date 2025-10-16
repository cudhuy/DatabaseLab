const mssql = require("mssql");
const cloudinary = require("../utils/cloudinary");

const getMaintainance = async (req, res, next) => {
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

  console.log(`SELECT * FROM Maintainance
  Left join Game on Maintainance.gameId=Game.id
  Left join Images on Images.cloudinaryId=Maintainance.imageId  where 
  ${listId ? `gameId in (${listId.map(el => `'${el}'`).join(",")})` : `1=1`} AND
  ${listStatus ? `status in (${listStatus.map(el => `'${el}'`).join(",")})` : `1=1`} AND
  ${start ? `date > CAST ('${start}' as Datetime)` : `1=1`} AND
  ${end ? `date < CAST ('${end}' as Datetime)` : `1=1`} AND
  ${search ? `title LIKE '%${search}%'` : `1=1`}
  
 

 `);
  const request = new mssql.Request();
  const maintain = await request.query(`SELECT * FROM Maintainance
  Left join Game on Maintainance.gameId=Game.id
  Left join Images on Images.cloudinaryId=Maintainance.imageId  where 
  ${listId ? `gameId in (${listId.map(el => `'${el}'`).join(",")})` : `1=1`} AND
  ${listStatus ? `status in (${listStatus.map(el => `'${el}'`).join(",")})` : `1=1`} AND
  ${start ? `date > CAST ('${start}' as Datetime)` : `1=1`} AND
  ${end ? `date < CAST ('${end}' as Datetime)` : `1=1`} AND
  ${search ? `title LIKE '%${search}%'` : `1=1`}
  
 

 `);

  res.json({ docs: maintain.recordset });
};
const createMaintainace = async (req, res, next) => {
  const date = new Date().toJSON();
  const request = new mssql.Request();
  if (!req.file) {
    await request.query(`INSERT INTO Maintainance(gameId,description,status,date,title) VALUES 
                            ('${req.body.gameId}','${req.body.description || "no description"}',
                             '${req.body.status || 0}','${date}','${req.body.title}')`);
    const lastMaintain = await request.query(`SELECT TOP 1 _id from Maintainance Order by _id DESC`);
    res.status(200).json({ ...lastMaintain.recordset[0] });
  } else {
    const result = await cloudinary.uploader.upload(req.file.path);
    if (!result) {
      const err = new Error("Can not upload image");
      err.statusCode = 400;
      return next(err);
    }
    await request.query(`INSERT INTO Images(url,cloudinaryId) VALUES ('${result.secure_url}','${result.public_id}')`);
    await request.query(`INSERT INTO Maintainance(gameId,description,status,date,title,imageId) VALUES 
  ('${req.body.gameId}','${req.body.description || "no description"}',
   '${req.body.status || 0}','${date}','${req.body.title}','${result.public_id}')`);
    const lastMaintain = await request.query(`SELECT TOP 1 * from Maintainance Order by _id DESC`);
    res.status(200).json({ ...lastMaintain.recordset[0], image: { url: result.secure_url } });
  }
};
const updateMaintainance = async (req, res, next) => {
  let updateBody = { ...req.body };
  const request = new mssql.Request();
  const date = new Date().toJSON();
  const maintainQuery = await request.query(
    `SELECT * From Maintainance,Images where _id='${req.params.id}' AND Maintainance.imageId=Images.cloudinaryId`
  );
  if (maintainQuery.recordset.length <= 0) {
    const err = new Error("Can find Maintainance");
    err.statusCode = 404;
    return next(err);
  }
  const maintain = maintainQuery.recordset[0];
  let result = {};
  if (req.file) {
    await Promise.all([cloudinary.uploader.destroy(maintain.imageId)]);
    result = await cloudinary.uploader.upload(req.file.path);
    await request.query(`INSERT INTO Images(url,cloudinaryId) VALUES('${result.secure_url}','${result.public_id}')`);
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
      cloudinary_id: result.public_id ? result.public_id : maintain.imageId,
      url: result.secure_url ? result.secure_url : maintain.url,
    },
  };
  await request.query(
    `UPDATE Maintainance SET  
    status='${updateBody.status}'
    ,description='${updateBody.description}'
    ,title='${updateBody.title}'
    ,imageId='${updateBody.image.cloudinary_id}'
    ,date='${date}'
    where _id='${maintain._id}'
    `
  );
  if (req.file) request.query(`DELETE FROM Images where cloudinaryId='${maintain.imageId}'`);
  res.status(200).json(updateBody);
};
const deleteMaintainace = async (req, res, next) => {
  const { listId } = req.body;
  if (!listId) {
    const err = Error("Lack of listId");
    err.statusCode = 400;
    return next(err);
  }
  const request = new mssql.Request();

  const inList = listId.map(el => `'${el}'`).join(",");
  console.log(inList);
  const maintains = (await request.query(`SELECT * FROM Maintainance where _id in (${inList})`)).recordset;
  await request.query(`DELETE FROM Maintainance where _id in (${inList})`);
  for (const maintain of maintains) {
    if (maintain.imageId) cloudinary.uploader.destroy(maintain.imageId);
    request.query(`DELETE FROM Images where cloudinaryId='${maintain.imageId}'`);
  }
  res.send("Delete Successfully");
};
module.exports = {
  getMaintainance,
  createMaintainace,
  updateMaintainance,
  deleteMaintainace,
};
