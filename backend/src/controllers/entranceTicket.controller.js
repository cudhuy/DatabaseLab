const { Pool } = require("pg");
const pool = new Pool();

const getTicket = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM Ticket");
    res.json(result.rows);
  } catch (e) {
    next(e);
  }
};

const createTicket = async (req, res, next) => {
  try {
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
      const gameRes = await pool.query("SELECT * FROM Game WHERE id=$1", [req.body.gameId]);
      if (gameRes.rows.length <= 0) {
        const err = new Error("Game not found");
        err.statusCode = 404;
        return next(err);
      }
      const game = gameRes.rows[0];
      const cost = game.price;
      const inserts = [];
      for (let i = 0; i < req.body.tickNum; i += 1) {
        inserts.push(
          pool.query("INSERT INTO Ticket(type,timeIn,discount,cost,isPayed) VALUES ($1,$2,$3,$4,$5)", [
            3,
            timeIn,
            0,
            cost,
            1,
          ])
        );
      }
      await Promise.all(inserts);
      const listIdRes = await pool.query("SELECT ticketId FROM Ticket WHERE type=$1 ORDER BY ticketId DESC LIMIT $2", [
        3,
        req.body.tickNum,
      ]);
      const listId = listIdRes.rows.map(el => el.ticketid);
      const gameTickets = [];
      for (let i = 0; i < req.body.tickNum; i += 1) {
        gameTickets.push(pool.query("INSERT INTO GameTicket(ticketId,gameId) VALUES ($1,$2)", [listId[i], game.id]));
      }
      await Promise.all(gameTickets);
      res.json(listId);
    } else {
      let booking;
      let discount = 0;
      if (req.body.code) {
        const bookingQuery = await pool.query("SELECT * FROM EventBooking WHERE code=$1", [req.body.code]);
        if (bookingQuery.rows.length <= 0) {
          const err = new Error("Can not found this coupon code!");
          err.statusCode = 404;
          return next(err);
        }
        booking = bookingQuery.rows[0];
        if (!booking.isemailverify && !booking.isEmailVerify) {
          const err = new Error("The email is not verify!");
          err.statusCode = 403;
          return next(err);
        }
        if (booking.isused && booking.isUsed) {
          const err = new Error("This coupon code is used");
          err.statusCode = 403;
          return next(err);
        }
        const eventQuery = await pool.query("SELECT * FROM RunningEvent WHERE id=$1", [booking.eventid || booking.eventId]);
        if (eventQuery.rows.length <= 0) {
          const err = new Error("Not found event");
          err.statusCode = 404;
          return next(err);
        }
        const event = eventQuery.rows[0];
        if (
          Date.now() < new Date(event.starttime || event.startTime) ||
          Date.now() > new Date(event.endtime || event.endTime)
        ) {
          const err = new Error("The code can only use in the event");
          err.statusCode = 403;
          return next(err);
        }
        discount = event.discount || 0;
      }
      if (discount > 100) discount = 100;
      const tickets = [];

      for (let i = 0; i < req.body.tickNum; i += 1) {
        if (i <= 4) {
          tickets.push(
            pool.query("INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ($1,$2,$3,$4)", [
              req.body.typeTicket,
              timeIn,
              discount,
              0,
            ])
          );
        } else {
          tickets.push(
            pool.query("INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ($1,$2,$3,$4)", [
              req.body.typeTicket,
              timeIn,
              0,
              0,
            ])
          );
        }
      }
      if (booking) {
        try {
          await pool.query("UPDATE EventBooking SET isUsed=1 WHERE code=$1", [req.body.code]);
        } catch (err) {
          return next(err);
        }
      }
      await Promise.all(tickets);
      const listIdRes = await pool.query("SELECT ticketId FROM Ticket WHERE type<>$1 ORDER BY ticketId DESC LIMIT $2", [
        3,
        req.body.tickNum,
      ]);
      const result = listIdRes.rows.map(el => el.ticketid);
      res.json({
        result,
        name: booking ? booking.name || booking.Name : undefined,
        email: booking ? booking.email || booking.Email : undefined,
      });
    }
  } catch (e) {
    next(e);
  }
};

const createTicketForVip = async (req, res, next) => {
  try {
    if (!req.body.uuid && !req.body.vipCode) {
      const err = new Error("Lack of field");
      err.statusCode = 404;
      return next(err);
    }
    let vip;
    if (req.body.uuid) {
      const vipRes = await pool.query("SELECT * FROM Vip WHERE _id=$1", [req.body.uuid]);
      vip = vipRes.rows[0];
    } else {
      const vipRes = await pool.query("SELECT * FROM Vip WHERE vipCode=$1", [req.body.vipCode]);
      vip = vipRes.rows[0];
    }
    if (!vip) {
      const err = new Error("Cannot found vip!");
      err.statusCode = 404;
      return next(err);
    }
    if (new Date(vip.dateend || vip.dateEnd) < Date.now()) {
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
      const gameQuery = await pool.query("SELECT * FROM Game WHERE id=$1", [req.body.gameId]);
      if (gameQuery.rows.length <= 0) {
        const err = new Error("Game not found");
        err.statusCode = 404;
        return next(err);
      }
      const game = gameQuery.rows[0];
      const cost = game.price;
      const inserts = [];
      for (let i = 0; i < req.body.tickNum; i += 1) {
        inserts.push(pool.query("INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ($1,$2,$3,$4)", [3, timeIn, 0, cost]));
      }
      await Promise.all(inserts);
      const listIdRes = await pool.query("SELECT ticketId FROM Ticket WHERE type=$1 ORDER BY ticketId DESC LIMIT $2", [
        3,
        req.body.tickNum,
      ]);
      const listId = listIdRes.rows.map(el => el.ticketid);
      const gameTickets = [];
      for (let i = 0; i < req.body.tickNum; i += 1) {
        gameTickets.push(pool.query("INSERT INTO GameTicket(ticketId,gameId) VALUES ($1,$2)", [listId[i], game.id]));
      }
      await Promise.all(gameTickets);
      res.json(listId);
    } else {
      let booking;
      let discount = 0;
      if (req.body.code) {
        const bookingQuery = await pool.query("SELECT * FROM EventBooking WHERE code=$1", [req.body.code]);
        if (bookingQuery.rows.length <= 0) {
          const err = new Error("Can not found this coupon code!");
          err.statusCode = 404;
          return next(err);
        }
        booking = bookingQuery.rows[0];
        if (!booking.isemailverify && !booking.isEmailVerify) {
          const err = new Error("The email is not verify!");
          err.statusCode = 403;
          return next(err);
        }
        if (booking.isused && booking.isUsed) {
          const err = new Error("This coupon code is used");
          err.statusCode = 403;
          return next(err);
        }
        const eventQuery = await pool.query("SELECT * FROM RunningEvent WHERE id=$1", [booking.eventid || booking.eventId]);
        if (eventQuery.rows.length <= 0) {
          const err = new Error("Not found event");
          err.statusCode = 404;
          return next(err);
        }
        const event = eventQuery.rows[0];
        if (
          Date.now() < new Date(event.starttime || event.startTime) ||
          Date.now() > new Date(event.endtime || event.endTime)
        ) {
          const err = new Error("The code can only use in the event");
          err.statusCode = 403;
          return next(err);
        }

        discount += event.discount || 0;
      }
      if (req.body.vipVoucherCode) {
        const vipVoucherCodeRes = await pool.query("SELECT * FROM VipVoucher WHERE voucherCode=$1", [
          req.body.vipVoucherCode,
        ]);
        const vipVoucherCode = vipVoucherCodeRes.rows[0];
        if (!vipVoucherCode) {
          const err = new Error("Can not find!");
          err.statusCode = 404;
          return next(err);
        }
        if (vipVoucherCode.vipid !== vip._id && vipVoucherCode.vipId !== vip._id) {
          const err = new Error("This voucher is not belong to you!");
          err.statusCode = 404;
          return next(err);
        }
        if (Date.now() > new Date(vipVoucherCode.dateend || vipVoucherCode.dateEnd)) {
          const err = new Error("This voucher is expired!");
          err.statusCode = 400;
          return next(err);
        }
        discount += vipVoucherCode.discount || 0;
        await pool.query("DELETE FROM VipVoucher WHERE voucherCode=$1", [req.body.vipVoucherCode]);
      }
      discount += 20;
      if (discount > 100) discount = 100;

      const tickets = [];
      for (let i = 0; i < req.body.tickNum; i += 1) {
        if (i <= 4) {
          tickets.push(
            pool.query("INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ($1,$2,$3,$4)", [
              req.body.typeTicket,
              timeIn,
              discount,
              0,
            ])
          );
        } else {
          tickets.push(
            pool.query("INSERT INTO Ticket(type,timeIn,discount,cost) VALUES ($1,$2,$3,$4)", [
              req.body.typeTicket,
              timeIn,
              0,
              0,
            ])
          );
        }
      }
      if (booking) {
        try {
          await pool.query("UPDATE EventBooking SET isUsed=1 WHERE code=$1", [req.body.code]);
        } catch (err) {
          return next(err);
        }
      }
      await Promise.all(tickets);
      const listIdRes = await pool.query("SELECT ticketId FROM Ticket WHERE type<>$1 ORDER BY ticketId DESC LIMIT $2", [
        3,
        req.body.tickNum,
      ]);
      const result = listIdRes.rows.map(el => el.ticketid);
      const vipTickets = [];
      for (let i = 0; i < req.body.tickNum; i += 1) {
        vipTickets.push(pool.query("INSERT INTO VipTicket(ticketId,vipId) VALUES ($1,$2)", [result[i], vip._id]));
      }
      await Promise.all(vipTickets);
      const typeRes = await pool.query("SELECT * FROM TicketType ORDER BY id ASC");
      const type = typeRes.rows;
      const dayPrice = type[0] ? type[0].cost : 0;
      const turnPrice = type[1] ? type[1].cost : 0;
      const extraPrice = 50000;
      if (req.body.typeTicket === 1) {
        const plus = (dayPrice * req.body.tickNum) / 10;
        await pool.query("UPDATE Vip SET point=point+$1 WHERE _id=$2", [plus, vip._id]);
      } else if (req.body.typeTicket === 2) {
        const plus = (turnPrice * req.body.tickNum) / 10;
        await pool.query("UPDATE Vip SET point=point+$1 WHERE _id=$2", [plus, vip._id]);
      }

      res.json({
        result,
        name: booking ? booking.name : vip.name,
        email: booking ? booking.email : vip.email,
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const typeRes = await pool.query("SELECT * FROM TicketType ORDER BY id ASC");
    const types = typeRes.rows;
    const dayPrice = types[0] ? types[0].cost : 0;
    const turnPrice = types[1] ? types[1].cost : 0;
    const extraPrice = 50000;
    if (!req.body.listId) {
      const err = new Error("Lack of listId");
      err.statusCode = 400;
      return next(err);
    }
    let total = 0;
    const list = req.body.listId;
    const ticketsRes = await pool.query(`SELECT * FROM Ticket where ticketId = ANY($1::int[])`, [list]);
    let tickets = ticketsRes.rows;
    const saveDb = [];
    for (const ticket of tickets) {
      if (ticket && !ticket.ispayed && !ticket.isPayed && !ticket.ispayed) {
        // normalize field names
        const isPayed = ticket.ispayed || ticket.ispayed === false ? ticket.ispayed : ticket.ispayed;
        const updateContent = {};
        if (ticket.type === 1) {
          updateContent.cost = (dayPrice * (100 - ticket.discount)) / 100;
          total += updateContent.cost;
        } else if (ticket.type === 3) {
          updateContent.cost = ticket.cost;
          total += ticket.cost;
        } else {
          if (!ticket.ispayed && !ticket.isPayed) {
            const timeOut = req.body.timeOut ? new Date(req.body.timeOut) : new Date();
            const diff = Math.round((timeOut - ticket.timein) / 60000) - 120 - 15;
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
          pool.query("UPDATE Ticket SET timeAway=$1, cost=$2 WHERE ticketId=$3", [
            jsonTimeOut,
            updateContent.cost,
            ticket.ticketid || ticket.ticketId,
          ])
        );
      }
    }
    await Promise.all(saveDb);
    const refreshed = await pool.query(`SELECT * FROM Ticket where ticketId = ANY($1::int[])`, [list]);
    tickets = refreshed.rows;
    res.status(200).json({
      tickList: tickets,
      totalCost: total,
    });
  } catch (e) {
    next(e);
  }
};

const payTicket = async (req, res, next) => {
  try {
    const list = req.body.listId;
    await pool.query(`UPDATE Ticket SET isPayed=1 WHERE ticketId = ANY($1::int[])`, [list]);
    res.status(200).json({});
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createTicket,
  updateTicket,
  getTicket,
  payTicket,
  createTicketForVip,
};
