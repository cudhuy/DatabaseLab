const httpStatus = require("http-status");
const { Pool } = require("pg");
const pool = new Pool();
const cloudinary = require("../utils/cloudinary");

const getAllGame = async (req, res, next) => {
  try {
    const gameQuery = await pool.query("SELECT * From Game LEFT JOIN Images on Game.imageId=Images.cloudinaryId");
    const output = [];
    gameQuery.rows.map(el =>
      output.push({
        _id: el.id,
        type: el.kind,
        name: el.name,
        price: el.price,
        description: el.descript,
        image: {
          url: el.url,
          cloudinary_id: el.cloudinaryid || el.cloudinaryId,
        },
      })
    );
    res.json({ games: output });
  } catch (e) {
    next(e);
  }
};
const createGame = async (req, res, next) => {
  try {
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
      await pool.query("INSERT INTO Images(url,cloudinaryId) VALUES($1,$2)", [result.secure_url, result.public_id]);
      createBody = { ...req.body, imageId: result.public_id };
    }
    await pool.query("INSERT INTO Game(kind,descript,name,price,imageId) VALUES($1,$2,$3,$4,$5)", [
      createBody.type,
      createBody.description,
      createBody.name,
      createBody.price,
      createBody.imageId,
    ]);
    const idQuery = await pool.query("SELECT id FROM Game ORDER BY id DESC LIMIT 1");
    const gameQuery = await pool.query(
      "SELECT * from Game LEFT JOIN Images on Game.imageId=Images.cloudinaryId WHERE Game.id=$1",
      [idQuery.rows[0].id]
    );
    const game = gameQuery.rows[0];
    res.status(httpStatus.CREATED).send({
      _id: game.id,
      type: game.kind,
      name: game.name,
      price: game.price,
      description: game.descript,
      image: {
        url: game.url,
        cloudinary_id: game.cloudinaryid || game.cloudinaryId,
      },
    });
  } catch (e) {
    next(e);
  }
};
const updateGame = async (req, res, next) => {
  try {
    let updateBody = { ...req.body };
    const gameQuery = await pool.query(
      "SELECT * From Game LEFT JOIN Images on Game.imageId=Images.cloudinaryId where Game.id=$1",
      [req.params.id]
    );
    if (gameQuery.rows.length <= 0) {
      const err = new Error("Can find Game");
      err.statusCode = 404;
      return next(err);
    }
    const game = gameQuery.rows[0];
    let result = {};
    if (req.file) {
      if (game.imageid || game.imageId) {
        try {
          await cloudinary.uploader.destroy(game.imageid || game.imageId);
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
      name: req.body.name ? req.body.name : game.name,
      type: req.body.type ? req.body.type : game.kind,
      description: req.body.description ? req.body.description : game.descript,
      price: req.body.price ? req.body.price : game.price,
      image: {
        cloudinary_id: result.public_id ? result.public_id : game.imageid || game.imageId,
        url: result.secure_url ? result.secure_url : game.url,
      },
    };
    await pool.query("UPDATE Game SET kind=$1, descript=$2, price=$3, name=$4, imageId=$5 WHERE id=$6", [
      updateBody.type,
      updateBody.description,
      updateBody.price,
      updateBody.name,
      updateBody.image.cloudinary_id,
      req.params.id,
    ]);
    res.status(200).json({
      game: { ...updateBody },
    });
  } catch (e) {
    next(e);
  }
};
const deleteGame = async (req, res, next) => {
  try {
    const gameQuery = await pool.query("SELECT * from Game where id=$1", [req.params.id]);
    if (gameQuery.rows.length <= 0) {
      const err = new Error("Can not find the game");
      err.statusCode = 404;
      return next(err);
    }
    await pool.query("DELETE from Game where id=$1", [req.params.id]);
    res.status(200).send("Delete successfully");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getAllGame,
  createGame,
  updateGame,
  deleteGame,
};
