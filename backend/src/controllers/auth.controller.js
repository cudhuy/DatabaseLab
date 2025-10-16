const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mssql = require("mssql");
const config = require("../config/config");

const login = async (req, res, next) => {
  const request = new mssql.Request();
  const userQuery = await request.query(`Select * from Users where loginName='${req.body.loginName}'`);
  if (userQuery.recordset.length <= 0) {
    const err = new Error("Login name is not correct");
    err.statusCode = 400;
    return next(err);
  }
  const user = userQuery.recordset[0];
  if (bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user.id, role: user.role }, config.jwt.secret);
    res.status(200).json({
      status: "success",
      data: {
        token,
        loginName: user.loginName,
        role: user.role,
      },
    });
  } else {
    const err = new Error("Password is not correct");
    err.statusCode = 400;
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  const request = new mssql.Request();
  try {
    if (req.user) {
      const userQuery = await request.query(`Select * from Users where id='${req.user.userId}'`);
      if (userQuery.recordset.length <= 0) {
        const err = new Error("Cannot find user!");
        err.statusCode = 404;
        return next(err);
      }
      const user = userQuery.recordset[0];
      res.status(200).json({
        status: "success",
        data: {
          loginName: user.loginName,
          role: user.role,
        },
      });
    } else {
      const err = new Error("Can not found user");
      err.statusCode = 404;
      return next(err);
    }
  } catch (e) {
    e.statusCode = 400;
    return next(e);
  }
};

module.exports = {
  login,
  getCurrentUser,
};
