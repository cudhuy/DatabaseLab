const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const config = require("../config/config");

const pool = new Pool();

const auth = {
  verifyToken: (req, res, next) => {
    try {
      const Authorization = req.header("authorization") || req.header("Authorization");
      if (!Authorization) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        return next(err);
      }
      const token = Authorization.replace("Bearer ", "");
      let user;
      try {
        user = jwt.verify(token, config.jwt.secret);
      } catch (e) {
        const err = new Error("Token is not valid");
        err.statusCode = 403;
        return next(err);
      }
      if (!user || !user.role) {
        const err = new Error("Token is not valid");
        err.statusCode = 403;
        return next(err);
      }
      req.user = user;
      return next();
    } catch (e) {
      e.statusCode = 400;
      return next(e);
    }
  },
  verifyStaff: (req, res, next) => {
    auth.verifyToken(req, res, err => {
      if (err) return next(err);
      if (req.user.role === "staff") return next();
      const err2 = new Error("Forbidden");
      err2.statusCode = 403;
      return next(err2);
    });
  },

  verifyAdmin: (req, res, next) => {
    auth.verifyToken(req, res, err => {
      if (err) return next(err);
      if (req.user.role === "admin") return next();
      const err2 = new Error("Forbidden");
      err2.statusCode = 403;
      return next(err2);
    });
  },
  verifyCustomer: (req, res, next) => {
    auth.verifyToken(req, res, err => {
      if (err) return next(err);
      if (req.user.role === "customer") return next();
      const err2 = new Error("Forbidden");
      err2.statusCode = 403;
      return next(err2);
    });
  },

  verifyUser: (req, res, next) => {
    auth.verifyToken(req, res, err => {
      if (err) return next(err);
      if (["admin", "staff", "customer"].includes(req.user.role)) return next();
      const err2 = new Error("Forbidden");
      err2.statusCode = 403;
      return next(err2);
    });
  },
  verifyPassword: async (req, res, next) => {
    try {
      if (!req.body.adminName || !req.body.adminPassword) {
        const err = new Error("No req body");
        err.statusCode = 403;
        return next(err);
      }
      const userQuery = await pool.query("Select * from Users where loginName=$1", [req.body.adminName]);
      if (userQuery.rows.length <= 0) {
        const err = new Error("Login name not found");
        err.statusCode = 403;
        return next(err);
      }
      const user = userQuery.rows[0];
      if (bcrypt.compareSync(req.body.adminPassword, user.password)) {
        return next();
      }
      const err = new Error("Password not correct");
      err.statusCode = 403;
      return next(err);
    } catch (e) {
      e.statusCode = 400;
      return next(e);
    }
  },
};
module.exports = auth;
