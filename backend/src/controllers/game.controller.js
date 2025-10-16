const httpStatus = require("http-status");
const mssql = require("mssql");
const cloudinary = require("../utils/cloudinary");

const getAllGame = async (req, res, next) => {
  const request = new mssql.Request();
  const gameQuery = await request.query("SELECT * From Game,Images where Game.imageId=Images.cloudinaryId");
  // format output
  const output = [];
  gameQuery.recordset.map(el =>
    output.push({
      _id: el.id,
      type: el.kind,
      name: el.name,
      price: el.price,
      description: el.descript,
      image: {
        url: el.url,
        cloudinary_id: el.cloudinaryId,
      },
    })
  );
  res.json({ games: output });
};
const createGame = async (req, res, next) => {
  let createBody;
  if (!req.file) {
    createBody = { ...req.body, imageId: "" };
  } else {
    const result = await cloudinary.uploader.upload(req.file.path);
    if (!result) {
      const err = new Error("Can not upload image");
      err.statusCode = 400;
      return next(err);
    }
    const request = new mssql.Request();
    await request.query(`INSERT INTO Images VALUES('${result.secure_url}','${result.public_id}')`);
    createBody = { ...req.body, imageId: result.public_id };
  }
  const request = new mssql.Request();
  await request.query(
    `INSERT INTO Game(kind,descript,name,price,imageId) VALUES('${createBody.type}',N'${createBody.description}',N'${createBody.name}','${createBody.price}','${createBody.imageId}')`
  );
  const idQuery = await request.query("SELECT TOP(1) id FROM Game ORDER BY id DESC");
  const gameQuery = await request.query(
    `SELECT * from Game,Images where id='${idQuery.recordset[0].id}' AND Game.imageId=Images.cloudinaryId`
  );
  const game = gameQuery.recordset[0];
  res.status(httpStatus.CREATED).send({
    _id: game.id,
    type: game.kind,
    name: game.name,
    price: game.price,
    description: game.descript,
    image: {
      url: game.url,
      cloudinary_id: game.cloudinaryId,
    },
  });
};
const updateGame = async (req, res, next) => {
  let updateBody = { ...req.body };
  const request = new mssql.Request();
  const gameQuery = await request.query(
    `SELECT * From Game,Images where id='${req.params.id}' AND Game.imageId=Images.cloudinaryId`
  );
  if (gameQuery.recordset.length <= 0) {
    const err = new Error("Can find Game");
    err.statusCode = 404;
    return next(err);
  }
  const game = gameQuery.recordset[0];
  let result = {};
  if (req.file) {
    if (game.imageId) await Promise.all([cloudinary.uploader.destroy(game.imageId)]);
    result = await cloudinary.uploader.upload(req.file.path);
    await request.query(`INSERT INTO Images(url,cloudinaryId) VALUES('${result.secure_url}','${result.public_id}')`);
    if (!result) {
      const err = new Error("Can not upload avatar");
      err.statusCode = 400;
      return next(err);
    }
  }
  updateBody = {
    name: req.body.name ? req.body.name : game.name,
    type: req.body.type ? req.body.type : game.kind,
    description: req.body.description ? req.body.description : game.descript,
    price: req.body.price ? req.body.price : game.price,
    image: {
      cloudinary_id: result.public_id ? result.public_id : game.imageId,
      url: result.secure_url ? result.secure_url : game.url,
    },
  };
  await request.query(
    `UPDATE Game SET  kind='${updateBody.type}' ,descript='${updateBody.description}',price='${updateBody.price}',name='${updateBody.name}',imageId='${updateBody.image.cloudinary_id}'
    where id='${req.params.id}'`
  );
  res.status(200).json({
    game: { ...updateBody },
  });
};
const deleteGame = async (req, res, next) => {
  const request = new mssql.Request();
  const gameQuery = await request.query(`SELECT * from Game where id='${req.params.id}'`);
  if (gameQuery.recordset.length <= 0) {
    const err = new Error("Can not find the game");
    err.statusCode = 404;
    return next(err);
  }
  const game = gameQuery.recordset[0];
  await request.query(`Delete from Game where id='${req.params.id}'`);
  res.status(200).send("Delete successfully");
};
module.exports = {
  getAllGame,
  createGame,
  updateGame,
  deleteGame,
};
