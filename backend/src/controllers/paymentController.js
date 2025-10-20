const QRCode = require("qrcode");
const { Pool } = require("pg");
const pool = new Pool();
const paypal = require("../utils/paypal");

const mintQRPayment = async (req, res, next) => {
  try {
    if (!req.body.listId) {
      const err = new Error("Lack of listId");
      err.statusCode = 400;
      return next(err);
    }
    const { listId } = req.body;
    const ticketsRes = await pool.query("SELECT * FROM Ticket where ticketId = ANY($1::int[])", [listId]);
    const tickets = ticketsRes.rows.filter(
      el =>
        el.type !== 3 &&
        el.ispayed !== true &&
        el.ispayed !== "t" &&
        el.ispayed !== "true" &&
        el.ispayed !== 1 &&
        el.ispayed !== "1"
    );
    if (!tickets || tickets.length === 0) {
      return res.send("");
    }
    const totalCost = (tickets.reduce((sum, a) => sum + Number(a.cost || 0), 0) / 23000).toFixed(2);
    const paymentJson = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.IP}/api/v1/pay/execute?total=${totalCost}&list=${listId}`,
        cancel_url: `${process.env.IP}/api/v1/pay/cancel`,
      },
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalCost,
          },
        },
      ],
    };
    paypal.payment.create(paymentJson, async (error, payment) => {
      if (error) {
        return next(error);
      } else {
        const qrCode = await QRCode.toDataURL(payment.links[1].href);
        res.send(qrCode);
      }
    });
  } catch (e) {
    next(e);
  }
};
const executePayment = async (req, res, next) => {
  try {
    const payerId = req.query.PayerID;
    const { paymentId } = req.query;
    let listId = req.query.list.split(",");
    listId = listId.map(el => Number(el));
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: req.query.total,
          },
        },
      ],
    };
    paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        return next(error);
      } else {
        await pool.query("UPDATE Ticket SET isPayed=1 Where ticketId = ANY($1::int[])", [listId]);
        res.redirect("/congratPayment");
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { mintQRPayment, executePayment };
