// lightweight compatibility placeholder
// original file had commented mongoose logic. We keep a minimal middleware
// that can create a daily customer record if not exist when an endpoint wants it.
// NOTE: This file does NOT create DB rows automatically unless called from routes.
/*
Usage example in routes:
const { ensureDailyCustomer } = require('../middlewares/check');
app.post('/some-endpoint', ensureDailyCustomer, handler);
*/
const { Pool } = require("pg");
const pool = new Pool();

const ensureDailyCustomer = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) return next();
    const found = await pool.query("SELECT * FROM Customer WHERE email=$1", [email]);
    if (found.rows.length === 0 && name) {
      await pool.query("INSERT INTO Customer(email,name) VALUES($1,$2)", [email, name]);
    }
    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = { ensureDailyCustomer };
