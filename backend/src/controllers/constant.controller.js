const mssql = require("mssql");

const getAllConstant = async (req, res, next) => {
  const request = new mssql.Request();
  const type = (await request.query(`Select * from TicketType`)).recordset;
  console.log(type);
  res.json({
    ticketPrice: {
      day: type[0].cost,
      turn: type[1].cost,
    },
  });
};
const updateConstant = async (req, res, next) => {
  const request = new mssql.Request();
  const type = (await request.query(`Select * from TicketType`)).recordset;
  if (!req.body.ticketPrice) {
    const err = new Error("Lack of field");
    err.statusCode = 400;
    return next(err);
  }
  const type1 = req.body.ticketPrice.day || type[0].cost;
  const type2 = req.body.ticketPrice.turn || type[1].cost;
  await Promise.all([
    request.query(`UPDATE TicketType SET cost='${type1}' where id=1`),
    request.query(`UPDATE TicketType SET cost='${type2}' where id=2`),
  ]);
  res.send("Successfully");
};
module.exports = {
  getAllConstant,
  updateConstant,
};
