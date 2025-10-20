const { Pool } = require("pg");
const pool = new Pool();

const getTotalProfit = async (req, res, next) => {
  try {
    const listDuration = [1, 7, 30, 365];
    const fieldStatistic = ["day", "week", "month", "year"];
    const entranceresult = {};
    const gameresult = {};

    const entrancePromises = listDuration.map(duration => {
      const d = new Date();
      d.setDate(d.getDate() - duration);
      return pool.query(
        "SELECT SUM(cost) as totalProfit FROM Ticket where type <> 3 AND isPayed=1 AND timeIn>CAST($1 AS timestamp)",
        [d.toJSON()]
      );
    });
    const gamePromises = listDuration.map(duration => {
      const d = new Date();
      d.setDate(d.getDate() - duration);
      return pool.query("SELECT SUM(cost) as totalProfit FROM Ticket where type = 3  AND timeIn>CAST($1 AS timestamp)", [
        d.toJSON(),
      ]);
    });
    const entrance = await Promise.all(entrancePromises);
    const game = await Promise.all(gamePromises);
    fieldStatistic.forEach((element, index) => {
      entranceresult[element] =
        entrance[index].rows[0].totalprofit !== null ? Number(entrance[index].rows[0].totalprofit) : 0;
      gameresult[element] = game[index].rows[0].totalprofit !== null ? Number(game[index].rows[0].totalprofit) : 0;
    });
    res.json({ entrance: entranceresult, game: gameresult });
  } catch (e) {
    next(e);
  }
};
const getGameMetaData = async (req, res, next) => {
  try {
    const listDuration = [1, 7, 30];
    const fieldStatistic = ["day", "week", "month"];
    const listPromises = listDuration.map(duration => {
      const d = new Date();
      d.setDate(d.getDate() - duration);
      return pool.query(
        `SELECT G.id,G.name,SUM(cost) as totalProfit,Count(*) as totalNumber 
        From Ticket
        JOIN GameTicket on Ticket.ticketId=GameTicket.ticketId
        JOIN Game G on GameTicket.gameId=G.id
        where Ticket.type=3 AND Ticket.timeIn>CAST($1 as timestamp)
      Group by G.id,G.name
      Order by totalProfit DESC`,
        [d.toJSON()]
      );
    });
    const results = await Promise.all(listPromises);
    const out = {};
    fieldStatistic.forEach((element, index) => {
      out[element] = results[index].rows;
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
};
const getVipMetaData = async (req, res, next) => {
  try {
    const vipStatisTicRes = await pool.query(`
      Select V.name,V.point,V.vipCode ,SUM(Ticket.cost) as totalPayment,COUNT(Ticket.ticketId) as totalTicketBuy from Vip as V
      left join VipTicket on VipTicket.vipId=V._id
      left join Ticket on VipTicket.ticketId=Ticket.ticketId 
      Group by V.name,V.point,V.vipCode 
      Order by totalPayment DESC
    `);
    const countRes = await pool.query("SELECT COUNT(*) as count FROM Vip");
    res.json({ vipStatisTic: vipStatisTicRes.rows, count: Number(countRes.rows[0].count) });
  } catch (e) {
    next(e);
  }
};
const getTicketStatistic = async (req, res, next) => {
  try {
    const listPeriod = [];
    for (let i = 34; i >= 0; i -= 1) {
      listPeriod.push(Date.now() - i * 60 * 60 * 1000 * 24);
    }
    const listPromises = [];
    for (let i = 0; i < 35; i += 1) {
      const up = new Date(listPeriod[i + 1]).toJSON();
      const down = new Date(listPeriod[i]).toJSON();
      listPromises.push(
        pool.query(
          `SELECT SUM(cost) as totalPayment,COUNT(*) as totalNumber from Ticket where timeIn>CAST($1 as timestamp) AND timeIn<CAST($2 as timestamp) Group by type Order by type`,
          [down, up]
        )
      );
    }
    const ticket = await Promise.all(listPromises);
    const fakeList = listPeriod.map(el => el - 60 * 60 * 1000).slice(0, 35);
    const result = {};
    fakeList.forEach((element, index) => {
      result[element] = ticket[index].rows;
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
};

module.exports = { getTicketStatistic, getGameMetaData, getTotalProfit, getVipMetaData };
