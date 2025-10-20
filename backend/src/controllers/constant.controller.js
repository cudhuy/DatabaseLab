const { Pool } = require("pg");
const pool = new Pool();

const getAllConstant = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM TicketType ORDER BY id ASC");
    const rows = result.rows;
    res.json({
      ticketPrice: {
        day: rows[0] ? rows[0].cost : 0,
        turn: rows[1] ? rows[1].cost : 0,
      },
    });
  } catch (e) {
    next(e);
  }
};
const updateConstant = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM TicketType ORDER BY id ASC");
    const rows = result.rows;
    if (!req.body.ticketPrice) {
      const err = new Error("Lack of field");
      err.statusCode = 400;
      return next(err);
    }
    const type1 = req.body.ticketPrice.day || (rows[0] && rows[0].cost) || 0;
    const type2 = req.body.ticketPrice.turn || (rows[1] && rows[1].cost) || 0;
    await Promise.all([
      pool.query(`UPDATE TicketType SET cost=$1 WHERE id=1`, [type1]),
      pool.query(`UPDATE TicketType SET cost=$1 WHERE id=2`, [type2]),
    ]);
    res.send("Successfully");
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getAllConstant,
  updateConstant,
};
