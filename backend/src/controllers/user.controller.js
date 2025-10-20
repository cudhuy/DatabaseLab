const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const ApiError = require("../utils/ApiError");

const pool = new Pool();

const createUser = async (req, res, next) => {
  try {
    if (!req.body.password || req.body.password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    } else if (!req.body.loginName || req.body.loginName.length < 6) {
      throw new ApiError(400, "Login name must be at least 6 characters");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    await pool.query("INSERT INTO Users(loginName,password,role) VALUES($1,$2,$3)", [req.body.loginName, hash, "staff"]);
    const idQuery = await pool.query("SELECT id FROM Users ORDER BY id DESC LIMIT 1");
    res.status(200).json({
      status: "success",
      data: {
        loginName: req.body.loginName,
        id: idQuery.rows[0].id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userRes = await pool.query("SELECT * FROM Users where id=$1", [req.params.userId]);
    const user = userRes.rows[0];
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = httpStatus.NOT_FOUND;
      return next(err);
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};
const getUsers = async (req, res, next) => {
  try {
    const users = await pool.query("SELECT * FROM Users");
    res.status(200).send(users.rows);
  } catch (error) {
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userRes = await pool.query("SELECT * FROM Users where id=$1", [req.params.userId]);
    const user = userRes.rows[0];
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = httpStatus.NOT_FOUND;
      return next(err);
    }
    const loginName = user.loginname || user.loginName;
    let hash = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(password, salt);
    }
    await pool.query("UPDATE Users SET loginName=$1, password=$2 WHERE id=$3", [loginName, hash, user.id]);
    res.send({
      _id: user.id,
      loginName,
      password: hash,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM Users where id=$1", [req.params.userId]);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
