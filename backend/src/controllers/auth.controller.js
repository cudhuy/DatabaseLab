const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const config = require("../config/config");

const pool = new Pool();

const login = async (req, res, next) => {
  try {
    const { loginName, password } = req.body;
    const result = await pool.query(`SELECT * FROM Users WHERE loginName=$1`, [loginName]);
    if (result.rows.length === 0) {
      const err = new Error("Login name is not correct");
      err.statusCode = 400;
      return next(err);
    }
    const user = result.rows[0];
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret);
      res.status(200).json({
        status: "success",
        data: {
          token,
          loginName: user.loginname || user.loginName,
          role: user.role,
        },
      });
    } else {
      const err = new Error("Password is not correct");
      err.statusCode = 400;
      return next(err);
    }
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      const err = new Error("Can not found user");
      err.statusCode = 404;
      return next(err);
    }
    const result = await pool.query(`SELECT * FROM Users WHERE id=$1`, [req.user.userId]);
    if (result.rows.length <= 0) {
      const err = new Error("Cannot find user!");
      err.statusCode = 404;
      return next(err);
    }
    const user = result.rows[0];
    res.status(200).json({
      status: "success",
      data: {
        loginName: user.loginname || user.loginName,
        role: user.role,
      },
    });
  } catch (e) {
    e.statusCode = 400;
    next(e);
  }
};

module.exports = {
  login,
  getCurrentUser,
};
