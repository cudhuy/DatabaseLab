const voucherCodes = require("voucher-code-generator");
const { Pool } = require("pg");
const pool = new Pool();

const getVipVoucher = async (req, res, next) => {
  try {
    let vipVoucher = [];
    if (req.body.vipId) {
      const resv = await pool.query("SELECT * FROM VipVoucher where vipId=$1", [req.body.vipId]);
      vipVoucher = resv.rows;
    }
    res.json(vipVoucher);
  } catch (e) {
    next(e);
  }
};
const createVipVoucher = async (req, res, next) => {
  try {
    if (!req.body.discount || !req.body.vipId) {
      const err = new Error("Lack of field");
      err.statusCode = 400;
      return next(err);
    }
    const { discount, vipId } = req.body;
    const vipRes = await pool.query("SELECT * FROM Vip where _id=$1", [vipId]);
    const vip = vipRes.rows[0];
    const dateEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toJSON();
    if (discount > 10 || discount < 0) {
      const err = new Error("Not valid discount");
      err.statusCode = 400;
      return next(err);
    }
    if (!vip || vip.point < discount * 10000) {
      const err = new Error("Not have enough point");
      err.statusCode = 400;
      return next(err);
    }
    const code = voucherCodes.generate({
      length: 5,
      charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    })[0];
    await Promise.all([
      pool.query("INSERT INTO VipVoucher(vipId,voucherCode,discount,dateEnd) VALUES($1,$2,$3,$4)", [
        req.body.vipId,
        code,
        discount,
        dateEnd,
      ]),
      pool.query("UPDATE Vip set point=(point-$1) WHERE _id=$2", [10000 * discount, req.body.vipId]),
    ]);
    res.json({
      vipId: req.body.vipId,
      voucherCode: code,
      discount,
      dateEnd,
      isUsed: false,
    });
  } catch (e) {
    next(e);
  }
};
module.exports = { getVipVoucher, createVipVoucher };
