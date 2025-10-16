const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mssql = require("mssql");
const config = require("../config/config");

const auth = {
  verifyToken: (req, res, next) => {
    const Authorization = req.header("authorization");
    if (!Authorization) {
      const err = new Error("Unauthorized");
      err.statusCode = 400;
      return next(err);
    }
    const token = Authorization.replace("Bearer ", "");
    const user = jwt.verify(token, config.jwt.secret);
    if (!user) {
      const err = new Error("Token is not valid");
      err.statusCode = 403;
      return next(err);
    }
    if (!user.role) {
      const err = new Error("Token is not valid");
      err.statusCode = 403;
      return next(err);
    }
    console.log(user);
    req.user = user;
  },
  verifyStaff: (req, res, next) => {
    auth.verifyToken(req, res, next);

    if (req.user.role === "staff") return next();

    const err = new Error("Forbidden");
    err.statusCode = 404;
    return next(err);
  },

  verifyAdmin: (req, res, next) => {
    auth.verifyToken(req, res, next);
    if (req.user.role === "admin") return next();

    const err = new Error("Forbidden");
    err.statusCode = 404;
    return next(err);
  },
  verifyCustomer: (req, res, next) => {
    auth.verifyToken(req, res, next);
    if (req.user.role === "customer") return next();

    const err = new Error("Forbidden");
    err.statusCode = 404;
    return next(err);
  },

  verifyUser: (req, res, next) => {
    auth.verifyToken(req, res, next);
    if (req.user.role === "admin" || req.user.role === "staff" || req.user.role === "customer") return next();
  },
  verifyPassword: async (req, res, next) => {
    if (!req.body.adminName || !req.body.adminPassword) {
      const err = new Error("No req body");
      err.statusCode = 403;
      return next(err);
    }
    const request = new mssql.Request();
    const userQuery = await request.query(`Select * from Users where loginName='${req.body.adminName}'`);
    if (userQuery.recordset.length <= 0) {
      const err = new Error("Login name not found");
      err.statusCode = 403;
      return next(err);
    }
    const user = userQuery.recordset[0];
    if (bcrypt.compareSync(req.body.adminPassword, user.password)) {
      return next();
    }
    const err = new Error("Password not correct");
    err.statusCode = 403;
    return next(err);
  },
};
module.exports = auth;
