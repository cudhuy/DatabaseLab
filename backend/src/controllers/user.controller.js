const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const mssql = require("mssql");
const ApiError = require("../utils/ApiError");

const createUser = async (req, res, next) => {
  try {
    if (req.body.password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    } else if (req.body.loginName.length < 6) {
      throw new ApiError(400, "Login name must be at least 6 characters");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    const request = new mssql.Request();
    await request.query(`INSERT INTO Users(loginName,password,role) VALUES ('${req.body.loginName}','${hash}','staff')`);
    const idQuery = await request.query("SELECT TOP(1) id FROM Users ORDER BY id DESC");
    res.status(200).json({
      status: "success",
      data: {
        loginName: req.body.loginName,
        id: idQuery.recordset[0].id,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res) => {
  const request = new mssql.Request();
  const user = (await request.query(`SELECT * FROM Users where id='${req.params.userId}'`)).recordset[0];
  if (!user) {
    throw new Error(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
};
const getUsers = async (req, res) => {
  const request = new mssql.Request();
  const users = (await request.query(`SELECT * FROM Users `)).recordset;

  res.status(200).send(users);
};
const updateUser = async (req, res) => {
  const { password } = req.body;
  let hash;
  const request = new mssql.Request();
  const user = (await request.query(`SELECT * FROM Users where id='${req.params.userId}'`)).recordset[0];
  const loginName = user.loginName;
  if (!password) hash = user.password;
  else {
    const salt = await bcrypt.genSalt(10);
    hash = await bcrypt.hash(password, salt);
  }
  await request.query(`UPDATE Users SET loginName='${loginName}' , password='${hash}' WHERE id='${user.id}'`);
  res.send({
    _id: user.id,
    loginName,
    password: hash,
    role: user.role,
  });
};
const deleteUser = async (req, res) => {
  const request = new mssql.Request();
  await request.query(`DELETE FROM Users where id='${req.params.userId}'`);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
