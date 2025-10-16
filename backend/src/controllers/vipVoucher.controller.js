const voucherCodes = require("voucher-code-generator");
const mssql = require("mssql");

const getVipVoucher = async (req, res, next) => {
  let vipVoucher;
  const request = new mssql.Request();
  if (req.body.vipId) {
    vipVoucher = (await request.query(`SELECT * FROM VipVoucher where vipId='${req.body.vipId}'`)).recordset;
  } else vipVoucher = [];
  res.json(vipVoucher);
};
const createVipVoucher = async (req, res, next) => {
  if (!req.body.discount || !req.body.vipId) {
    const err = new Error("Lack of field");
    err.statusCode = 400;
    return next(err);
  }
  const request = new mssql.Request();
  const { discount, vipId } = req.body;
  const vip = await request.query(` SELECT * FROM Vip where _id='${vipId}'`);
  const dateEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toJSON();

  if (discount > 10 || discount < 0) {
    const err = new Error("Not valid discount");
    err.statusCode = 400;
    return next(err);
  }
  if (vip.point < discount * 10000) {
    const err = new Error("Not have enough point");
    err.statusCode = 400;
    return next(err);
  }
  const code = voucherCodes.generate({
    length: 5,
    charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  })[0];
  console.log(`INSERT INTO VipVoucher(vipId,voucherCode,discount,dateEnd) VALUES 
  ('${req.body.vipId}','${code}','${discount}','${dateEnd}')`);
  await Promise.all([
    request.query(`INSERT INTO VipVoucher(vipId,voucherCode,discount,dateEnd) VALUES 
   ('${req.body.vipId}','${code}','${discount}','${dateEnd}')`),
    request.query(`UPDATE Vip set point=(point-10000*${discount}) WHERE _id='${req.body.vipId}'`),
  ]);
  res.json({
    vipId: req.body.vipId,
    voucherCode: code,
    discount,
    dateEnd,
    isUsed: false,
  });
};
module.exports = { getVipVoucher, createVipVoucher };
