const validator = require("validator");
const mssql = require("mssql");

const getCustomer = async (req, res, next) => {
  const request = new mssql.Request();
  const customerQuery = await request.query("SELECT * FROM Customer");
  res.json(customerQuery.recordset[0]);
};
const createCustomer = async (req, res, next) => {
  if (!req.body.email || !req.body.name) {
    const err = new Error("Lack of field");
    err.statusCode = 400;
    return next(err);
  }
  if (!validator.default.isEmail(req.body.email)) {
    const err = new Error("Invalid Email");
    err.statusCode = 400;
    return next(err);
  }
  const request = new mssql.Request();
  await request.query(`INSERT INTO Customer(email,name) VALUES('${req.body.email}','${req.body.name}') `);
  res.send("Create successfully");
};
module.exports = {
  getCustomer,
  createCustomer,
};
