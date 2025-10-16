const QRCode = require("qrcode");
const mssql = require("mssql");
const paypal = require("../utils/paypal");

const mintQRPayment = async (req, res, next) => {
  if (!req.body.listId) {
    const err = new Error("Lack of listId");
    err.statusCode = 400;
    return next(err);
  }
  const { listId } = req.body;
  const inList = listId.map(el => `'${el}'`).join(",");
  const request = new mssql.Request();
  const tickets = (await request.query(`SELECT * FROM Ticket where ticketId in (${inList})`)).recordset.filter(
    el => el.type !== 3 && el.isPayed !== true
  );
  if (!tickets || tickets.length === 0) {
    return res.send("");
  }
  const totalCost = (tickets.reduce((sum, a) => sum + a.cost, 0) / 23000).toFixed(2);
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
        description: "Payment ticket",
      },
    ],
  };
  paypal.payment.create(paymentJson, async (error, payment) => {
    if (error) {
      throw error;
    } else {
      const qrCode = await QRCode.toDataURL(payment.links[1].href);
      res.send(qrCode);
    }
  });
};
const executePayment = async (req, res, next) => {
  const payerId = req.query.PayerID;
  const { paymentId } = req.query;
  const request = new mssql.Request();
  let listId = req.query.list.split(",");
  listId = listId.map(el => Number(el));
  const inList = listId.map(el => `'${el}'`).join(",");
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
      throw error;
    } else {
      await request.query(`UPDATE Ticket SET isPayed=1 Where ticketId in (${inList})`);
      res.redirect("/congratPayment");
    }
  });
};

module.exports = { mintQRPayment, executePayment };
