const mssql = require("mssql");

const getTicket = async (req, res, next) => {
  const request = new mssql.Request();
  const tickets = (await request.query(`SELECT * FROM Ticket`)).recordset;
  res.json(tickets);
};
const createTicket = async (req, res, next) => {
  if (!req.body.tickNum || !req.body.typeTicket) {
    const err = new Error("Lack of type or number of ticket");
    err.statusCode = 400;
    return next(err);
  }
  if (req.body.tickNum < 1 || req.body.tickNum > 50) {
    const err = new Error("Minimum 1 ticket and maximum 50 ticket");
    err.statusCode = 404;
    return next(err);
  }
  if (req.body.typeTicket === 3 && !req.body.gameId) {
    const err = new Error("Lack of game Id");
    err.statusCode = 400;
    return next(err);
  }
  const timeIn = new Date().toJSON();
  const request = new mssql.Request();
  if (req.body.typeTicket === 3) {
    const tickets = [];
    const gameQuery = await request.query(`SELECT * from Game where id='${req.body.gameId}'`);
    if (gameQuery.recordset.length <= 0) {
      const err = new Error("Game not found");
      err.statusCode = 404;
      return next(err);
    }
    const game = gameQuery.recordset[0];
    const cost = game.price;

    for (let i = 0; i < req.body.tickNum; i += 1) {
      tickets.push(
        request.query(`INSERT INTO Ticket(type,timeIn,discount,cost,isPayed) VALUES ('3','${timeIn}','0','${cost}',1)`)
      );
    }
    await Promise.all(tickets);
    let listId = (
      await request.query(`SELECT TOP ${req.body.tickNum} ticketId from TICKET where type='3' ORDER BY ticketId DESC`)
    ).recordset;
    listId = listId.map(el => el.ticketId);
    const gameTickets = [];
    for (let i = 0; i < req.body.tickNum; i += 1) {
      gameTickets.push(request.query(`INSERT INTO GameTicket(ticketId,gameId) VALUES ('${listId[i]}','${game.id}')`));
    }
    await Promise.all(gameTickets);
    res.json(listId);
  } else {
    let booking;
    let discount = 0;
    if (req.body.code) {
      const bookingQuery = await request.query(`SELECT * from EventBooking where code='${req.body.code}'`);
      if (bookingQuery.recordset.length <= 0) {
        const err = new Error("Can not found this coupon code!");
        err.statusCode = 404;
        return next(err);
      }

      booking = bookingQuery.recordset[0];
      if (!booking.isEmailVerify) {
        const err = new Error("The email is not verify!");
        err.statusCode = 403;
        return next(err);
      }
      if (booking.isUsed) {
        const err = new Error("This coupon code is used");
        err.statusCode = 403;
        return next(err);
      }
      const eventQuery = await request.query(`SELECT * FROM RunningEvent where id='${booking.eventId}'`);
      if (eventQuery.recordset.length <= 0) {
        const err = new Error("Not found event");
        err.statusCode = 404;
        return next(err);
      }
      const event = eventQuery.recordset[0];
      if (Date.now() < new Date(event.startTime) || Date.now() > new Date(event.endTime)) {
        const err = new Error("The code can only use in the event");
        err.statusCode = 403;
        return next(err);
      }
      discount = event.discount;
    }
    if (discount > 100) discount = 100;
    const tickets = [];

    for (let i = 0; i < req.body.tickNum; i += 1) {
      if (i <= 4)
        tickets.push(
          request.query(
            `INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ('${req.body.typeTicket}','${timeIn}','${discount}','0')`
          )
        );
      else
        tickets.push(
          request.query(
            `INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ('${req.body.typeTicket}','${timeIn}','0','0')`
          )
        );
    }
    if (booking) {
      try {
        await request.query(`UPDATE EventBooking SET isUsed=1 Where code='${req.body.code}' `);
      } catch (err) {
        return next(err);
      }
    }
    await Promise.all(tickets);
    const listId = (
      await request.query(`SELECT TOP ${req.body.tickNum} ticketId from TICKET where type<>'3' ORDER BY ticketId DESC`)
    ).recordset;
    const result = listId.map(el => el.ticketId);
    res.json({
      result,
      name: booking ? booking.name : undefined,
      email: booking ? booking.email : undefined,
    });
  }
};
const createTicketForVip = async (req, res, next) => {
  if (!req.body.uuid && !req.body.vipCode) {
    const err = new Error("Lack of field");
    err.statusCode = 404;
    return next(err);
  }
  let vip;
  const request = new mssql.Request();
  if (req.body.uuid) vip = (await request.query(`SELECT * FROM Vip where _id='${req.body.uuid}'`)).recordset[0];
  else vip = (await request.query(`SELECT * FROM Vip where vipCode='${req.body.vipCode}'`)).recordset[0];
  if (!vip) {
    const err = new Error("Cannot found vip!");
    err.statusCode = 404;
    return next(err);
  }
  if (new Date(vip.dateEnd) < Date.now()) {
    const err = new Error("The vip account is expired!");
    err.statusCode = 400;
    return next(err);
  }
  if (!req.body.tickNum || !req.body.typeTicket) {
    const err = new Error("Lack of type or number of ticket");
    err.statusCode = 400;
    return next(err);
  }
  if (req.body.tickNum < 1 || req.body.tickNum > 50) {
    const err = new Error("Minimum 1 ticket and maximum 50 ticket");
    err.statusCode = 404;
    return next(err);
  }
  if (req.body.typeTicket === 3 && !req.body.gameId) {
    const err = new Error("Lack of game Id");
    err.statusCode = 400;
    return next(err);
  }
  const timeIn = new Date().toJSON();
  if (req.body.typeTicket === 3) {
    const tickets = [];
    const gameQuery = await request.query(`SELECT * from Game where id='${req.body.gameId}'`);
    if (gameQuery.recordset.length <= 0) {
      const err = new Error("Game not found");
      err.statusCode = 404;
      return next(err);
    }
    const game = gameQuery.recordset[0];
    const cost = game.price;

    for (let i = 0; i < req.body.tickNum; i += 1) {
      tickets.push(request.query(`INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ('3','${timeIn}','0','${cost}')`));
    }
    await Promise.all(tickets);
    let listId = (
      await request.query(`SELECT TOP ${req.body.tickNum} ticketId from TICKET where type='3' ORDER BY ticketId DESC`)
    ).recordset;
    listId = listId.map(el => el.ticketId);
    const gameTickets = [];
    for (let i = 0; i < req.body.tickNum; i += 1) {
      gameTickets.push(request.query(`INSERT INTO GameTicket(ticketId,gameId) VALUES ('${listId[i]}','${game.id}')`));
    }
    await Promise.all(gameTickets);
    res.json(listId);
  } else {
    let booking;
    let discount = 0;
    if (req.body.code) {
      const bookingQuery = await request.query(`SELECT * from EventBooking where code='${req.body.code}'`);
      if (bookingQuery.recordset.length <= 0) {
        const err = new Error("Can not found this coupon code!");
        err.statusCode = 404;
        return next(err);
      }

      booking = bookingQuery.recordset[0];
      if (!booking.isEmailVerify) {
        const err = new Error("The email is not verify!");
        err.statusCode = 403;
        return next(err);
      }
      if (booking.isUsed) {
        const err = new Error("This coupon code is used");
        err.statusCode = 403;
        return next(err);
      }
      const eventQuery = await request.query(`SELECT * FROM RunningEvent where id='${booking.eventId}'`);
      if (eventQuery.recordset.length <= 0) {
        const err = new Error("Not found event");
        err.statusCode = 404;
        return next(err);
      }
      const event = eventQuery.recordset[0];
      if (Date.now() < new Date(event.startTime) || Date.now() > new Date(event.endTime)) {
        const err = new Error("The code can only use in the event");
        err.statusCode = 403;
        return next(err);
      }

      discount += event.discount;
    }
    if (req.body.vipVoucherCode) {
      const vipVoucherCode = (await request.query(`SELECT * FROM VipVoucher where voucherCode='${req.body.vipVoucherCode}'`))
        .recordset[0];
      if (!vipVoucherCode) {
        const err = new Error("Can not find!");
        err.statusCode = 404;
        return next(err);
      }
      if (vipVoucherCode.vipId !== vip._id) {
        const err = new Error("This voucher is not belong to you!");
        err.statusCode = 404;
        return next(err);
      }
      if (Date.now() > new Date(vipVoucherCode.dateEnd)) {
        const err = new Error("This voucher is expired!");
        err.statusCode = 400;
        return next(err);
      }
      discount += vipVoucherCode.discount;
      await request.query(`DELETE FROM VipVoucher WHERE voucherCode='${req.body.vipVoucherCode}'`);
    }
    discount += 20;
    if (discount > 100) discount = 100;

    const tickets = [];

    for (let i = 0; i < req.body.tickNum; i += 1) {
      if (i <= 4)
        tickets.push(
          request.query(
            `INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ('${req.body.typeTicket}','${timeIn}','${discount}','0')`
          )
        );
      else
        tickets.push(
          request.query(
            `INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ('${req.body.typeTicket}','${timeIn}','0','0')`
          )
        );
    }
    if (booking) {
      try {
        await request.query(`UPDATE EventBooking SET isUsed=1 Where code='${req.body.code}' `);
      } catch (err) {
        return next(err);
      }
    }
    await Promise.all(tickets);
    const listId = (
      await request.query(`SELECT TOP ${req.body.tickNum} ticketId from TICKET where type<>'3' ORDER BY ticketId DESC`)
    ).recordset;
    const result = listId.map(el => el.ticketId);
    const vipTickets = [];
    for (let i = 0; i < req.body.tickNum; i += 1) {
      vipTickets.push(request.query(`INSERT INTO VipTicket(ticketId,vipId) VALUES ('${result[i]}','${vip._id}')`));
    }
    await Promise.all(vipTickets);
    const type = (await request.query(`SELECT * FROM TicketType`)).recordset;
    const dayPrice = type[0].cost;
    const turnPrice = type[1].cost;
    if (req.body.typeTicket === 1) {
      const plus = (dayPrice * req.body.tickNum) / 10;
      await request.query(`UPDATE Vip SET point=point+${plus} where _id='${vip._id}'`);
    } else if (req.body.typeTicket === 2) {
      const plus = (turnPrice * req.body.tickNum) / 10;
      await request.query(`UPDATE Vip SET point=point+${plus} where _id='${vip._id}'`);
    }

    res.json({
      result,
      name: booking ? booking.name : vip.name,
      email: booking ? booking.email : vip.email,
    });
  }
};
const updateTicket = async (req, res, next) => {
  const request = new mssql.Request();
  const type = (await request.query(`SELECT * FROM TicketType`)).recordset;
  const dayPrice = type[0].cost;
  const turnPrice = type[1].cost;
  const extraPrice = 50000;
  if (!req.body.listId) {
    const err = new Error("Lack of listId");
    err.statusCode = 400;
    return next(err);
  }
  let total = 0;
  console.log(dayPrice, turnPrice);

  const list = req.body.listId;
  const saveDb = [];
  let tickets = (await request.query(`SELECT * FROM Ticket where ticketId in (${list.join(",")})`)).recordset;
  console.log(tickets);
  for (const ticket of tickets) {
    // const ticket = await crudService.getbyParam(EntranceTicket, { ticketId: id });
    const updateContent = {};
    if (ticket && !ticket.isPayed) {
      if (ticket.type === 1) {
        updateContent.cost = (dayPrice * (100 - ticket.discount)) / 100;
        total += updateContent.cost;
      } else if (ticket.type === 3) {
        updateContent.cost = ticket.cost;
        total += ticket.cost;
      } else {
        if (!ticket.isPayed) {
          if (req.body.timeOut) updateContent.timeOut = req.body.timeOut;
          else updateContent.timeOut = new Date();
          const diff = Math.round((updateContent.timeOut - ticket.timeIn) / 60000) - 120 - 15;
          if (diff <= 0) {
            updateContent.cost = (turnPrice * (100 - ticket.discount)) / 100;
            total += updateContent.cost;
          } else {
            const power = Math.ceil(diff / 30);
            if (power > 4) updateContent.cost = ((6 * extraPrice + turnPrice) * (100 - ticket.discount)) / 100;
            else {
              updateContent.cost =
                (Math.round((extraPrice * (1.2 ** power - 1)) / 0.2 + turnPrice) * (100 - ticket.discount)) / 100;
            }
            total += updateContent.cost;
          }
        } else total += ticket.cost;
      }
      const jsonTimeOut = new Date().toJSON();
      saveDb.push(
        request.query(
          `UPDATE Ticket SET timeAway='${jsonTimeOut}',cost='${updateContent.cost}' where ticketId='${ticket.ticketId}'`
        )
      );
    }
  }
  await Promise.all(saveDb);
  tickets = (await request.query(`SELECT * FROM Ticket where ticketId in (${list.join(",")})`)).recordset;
  res.status(200).json({
    tickList: tickets,
    totalCost: total,
  });
};

const payTicket = async (req, res, next) => {
  const list = req.body.listId;
  const request = new mssql.Request();
  await request.query(`Update Ticket SET isPayed=1 where ticketId in(${list.join(",")})`);
  console.log(`Update Ticket SET isPayed=1 where ticketId in(${list.join(",")})`);
  res.status(200).json({});
};
module.exports = {
  createTicket,
  updateTicket,
  getTicket,
  payTicket,
  createTicketForVip,
};
