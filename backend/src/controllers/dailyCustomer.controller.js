const validator = require("validator");
const { Pool } = require("pg");
const pool = new Pool();

const getCustomer = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM Customer");
    res.json(result.rows[0]);
  } catch (e) {
    next(e);
  }
};
const createCustomer = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.name) {
      const err = new Error("Lack of field");
      err.statusCode = 400;
      return next(err);
    }
    if (!validator.isEmail(req.body.email)) {
      const err = new Error("Invalid Email");
      err.statusCode = 400;
      return next(err);
    }
    await pool.query("INSERT INTO Customer(email,name) VALUES($1,$2)", [req.body.email, req.body.name]);
    res.send("Create successfully");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getCustomer,
  createCustomer,
};
