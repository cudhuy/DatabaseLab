const mssql = require("mssql");

const getTotalProfit = async (req, res, next) => {
  const request = new mssql.Request();
  const listDuration = [1, 7, 30, 365];
  const fieldStatistic = ["day", "week", "month", "year"];
  const listEntranceStatistic = [];
  const listGameStatisctic = [];
  for (const duration of listDuration) {
    const d = new Date();
    d.setDate(d.getDate() - duration);

    const totalEntranceCost = request.query(
      `SELECT SUM(cost) as totalProfit FROM Ticket where type <> 3 AND isPayed=1 AND timeIn>CAST ('${d.toJSON()}' AS Datetime ) `
    );

    const totalGameCost = request.query(
      `SELECT SUM(cost) as totalProfit FROM Ticket where type = 3  AND timeIn>CAST ('${d.toJSON()}' AS Datetime ) `
    );
    listEntranceStatistic.push(totalEntranceCost);
    listGameStatisctic.push(totalGameCost);
  }

  const entrance = await Promise.all(listEntranceStatistic);
  const game = await Promise.all(listGameStatisctic);
  const entranceresult = {};
  const gameresult = {};
  fieldStatistic.forEach((element, index) => {
    entranceresult[element] =
      entrance[index].recordset[0].totalProfit !== null ? entrance[index].recordset[0].totalProfit : 0;
  });
  fieldStatistic.forEach((element, index) => {
    gameresult[element] = game[index].recordset[0].totalProfit !== null ? game[index].recordset[0].totalProfit : 0;
  });
  res.json({ entrance: entranceresult, game: gameresult });
};
const getGameMetaData = async (req, res, next) => {
  const listDuration = [1, 7, 30];
  const fieldStatistic = ["day", "week", "month"];
  const listGameStatistic = [];
  const request = new mssql.Request();
  for (const duration of listDuration) {
    const d = new Date();
    d.setDate(d.getDate() - duration);
    const gameData = request.query(`SELECT G.id,G.name,SUM(cost) as totalProfit,Count(*) as totalNumber 
    From Ticket,GameTicket,Game G where Ticket.type=3 AND Ticket.timeIn>CAST('${d.toJSON()}' as Datetime) AND Ticket.ticketId=GameTicket.gameId
    AND GameTicket.gameId=G.id
  Group by G.id,G.name
  Order by totalProfit DESC`);

    listGameStatistic.push(gameData);
  }
  const game = await Promise.all(listGameStatistic);
  const result = {};

  fieldStatistic.forEach((element, index) => {
    result[element] = game[index].recordset;
  });
  res.json(result);
};
const getVipMetaData = async (req, res, next) => {
  const request = new mssql.Request();
  const vipStatisTic = (
    await request.query(`Select V.name,V.point,V.vipCode ,SUM(Ticket.cost) as totalPayment,COUNT(Ticket.ticketId) as totalTicketBuy from Vip as V
    left join VipTicket on VipTicket.vipId=V._id
    left join Ticket on VipTicket.ticketId=Ticket.ticketId 
    Group by V.name,V.point,V.vipCode 
      ORder by totalPayment DESC`)
  ).recordset;
  const count = (await request.query(`SELECT COUNT(*) as count FROM Vip`)).recordset[0].count;

  res.json({ vipStatisTic, count });
};
const getTicketStatistic = async (req, res, next) => {
  // const listPeriod = [0, 12, 24, 36, 48, 96, 192, 336, 720, 2880, 5760, 8760].map(el => Date.now() - el * 60 * 60 * 1000);
  const listPeriod = [];
  for (let i = 34; i >= 0; i -= 1) {
    listPeriod.push(Date.now() - i * 60 * 60 * 1000 * 24);
  }

  const listStatistic = [];
  const request = new mssql.Request();
  for (let i = 0; i < 35; i += 1) {
    const up = new Date(listPeriod[i + 1]).toJSON();
    const down = new Date(listPeriod[i]).toJSON();
    const ticketStatistic = request.query(`SELECT SUM(cost) as totalPayment,COUNT(*) as totalNumber from Ticket where
     timeIn>CAST('${down}' as datetime) AND ${up ? `timeIn<CAST('${up}' as datetime)` : `1=1`} 
    Group by type Order by type`);
    listStatistic.push(ticketStatistic);
  }
  const ticket = await Promise.all(listStatistic);
  const fakeList = listPeriod.map(el => el - 60 * 60 * 1000).slice(0, 35);
  // console.log(fakeList);
  const result = {};

  fakeList.forEach((element, index) => {
    result[element] = ticket[index].recordset;
  });

  res.json(result);
};

module.exports = { getTicketStatistic, getGameMetaData, getTotalProfit, getVipMetaData };
