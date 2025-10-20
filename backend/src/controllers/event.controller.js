const httpStatus = require("http-status");
const { Pool } = require("pg");
const pool = new Pool();
const cloudinary = require("../utils/cloudinary");
const { emailService } = require("../services");

const getNewEvent = async (req, res, next) => {
  try {
    const eventQuery = await pool.query(
      "SELECT * from EventTemplate LEFT JOIN Images on EventTemplate.imageId=Images.cloudinaryId"
    );
    res.json(eventQuery.rows);
  } catch (e) {
    next(e);
  }
};
const getRunningEvent = async (req, res, next) => {
  try {
    const eventQuery = await pool.query(
      "SELECT * from RunningEvent LEFT JOIN Images on RunningEvent.imageId=Images.cloudinaryId"
    );
    res.json(eventQuery.rows);
  } catch (e) {
    next(e);
  }
};
const createNewEvent = async (req, res, next) => {
  try {
    let createBody;
    if (!req.file) {
      createBody = {
        title: req.body.title ? req.body.title : "Untitled",
        description: req.body.description ? req.body.description : "No description",
        discount: req.body.discount || 0,
      };
    } else {
      const result = await cloudinary.uploader.upload(req.file.path);
      if (!result) {
        const err = new Error("Can not upload image");
        err.statusCode = 400;
        return next(err);
      }
      await pool.query("INSERT INTO IMAGES(url,cloudinaryId) VALUES($1,$2)", [result.secure_url, result.public_id]);
      let discount = 0;
      if (!req.body.discount) discount = req.body.discount;
      createBody = {
        title: req.body.title ? req.body.title : "Untitled",
        description: req.body.description ? req.body.description : "No description",
        discount,
        image: { url: result.secure_url, cloudinary_id: result.public_id },
      };
    }
    if (createBody.image) {
      await pool.query("INSERT INTO EventTemplate(title,description,discount,imageId) VALUES($1,$2,$3,$4)", [
        createBody.title,
        createBody.description,
        createBody.discount,
        createBody.image.cloudinary_id,
      ]);
    } else {
      await pool.query("INSERT INTO EventTemplate(title,description,discount) VALUES($1,$2,$3)", [
        createBody.title,
        createBody.description,
        createBody.discount,
      ]);
    }
    const idQuery = await pool.query("SELECT id FROM EventTemplate ORDER BY id DESC LIMIT 1");
    res.json({ ...createBody, _id: idQuery.rows[0].id });
  } catch (e) {
    next(e);
  }
};
const updateEvent = async (req, res, next) => {
  try {
    const eventQuery = await pool.query("SELECT * from EventTemplate where id=$1", [req.params.id]);
    if (eventQuery.rows.length <= 0) {
      const err = new Error("Can not find event");
      err.statusCode = 404;
      return next(err);
    }
    const event = eventQuery.rows[0];
    if (req.body.meta) {
      if (
        !req.body.meta.startTime ||
        !req.body.meta.endTime ||
        !req.body.meta.startBookingTime ||
        !req.body.meta.endBookingTime
      ) {
        const err = new Error("Lack of field!");
        err.statusCode = 400;
        return next(err);
      }
      const eventCheck = await pool.query(
        `SELECT * FROM RunningEvent where 
    (
      startTime <= CAST($1 AS timestamp) AND
      endTime >= CAST($2 AS timestamp)
    ) OR 
    (
      startTime <= CAST($3 AS timestamp) AND
      endTime >= CAST($3 AS timestamp) 
    )
    OR 
    (
      startTime <= CAST($1 AS timestamp) AND
      endTime >= CAST($1 AS timestamp)
    )`,
        [req.body.meta.startTime, req.body.meta.endTime, req.body.meta.endTime]
      );

      if (eventCheck.rows.length >= 1) {
        const err = new Error("Can not create because in the same period with another event");
        err.statusCode = 403;
        return next(err);
      }
      if (!event.imageid && !event.imageId) {
        await pool.query(
          "INSERT INTO RunningEvent(title,description,discount,startBookingTime,endBookingTime,startTime,endTime) VALUES($1,$2,$3,$4,$5,$6,$7)",
          [
            event.title,
            event.description,
            event.discount,
            req.body.meta.startBookingTime,
            req.body.meta.endBookingTime,
            req.body.meta.startTime,
            req.body.meta.endTime,
          ]
        );
      } else {
        await pool.query(
          "INSERT INTO RunningEvent(title,description,discount,imageId,startBookingTime,endBookingTime,startTime,endTime) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
          [
            event.title,
            event.description,
            event.discount,
            event.imageid || event.imageId,
            req.body.meta.startBookingTime,
            req.body.meta.endBookingTime,
            req.body.meta.startTime,
            req.body.meta.endTime,
          ]
        );
      }
      res.status(200).send();
    } else {
      let result = {};
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
        if (!result) {
          const err = new Error("Can not upload avatar");
          err.statusCode = 400;
          return next(err);
        }
        if (event.imageid || event.imageId) {
          try {
            await cloudinary.uploader.destroy(event.imageid || event.imageId);
          } catch (err) {
            // ignore destroy error
          }
        }
        await pool.query("INSERT INTO IMAGES(url,cloudinaryId) VALUES($1,$2)", [result.secure_url, result.public_id]);
      }
      await pool.query("UPDATE EventTemplate SET title=$1, description=$2, discount=$3, imageId=$4 WHERE id=$5", [
        req.body.title || event.title,
        req.body.description || event.description,
        req.body.discount || event.discount,
        result.public_id || event.imageid || event.imageId,
        req.params.id,
      ]);
      if (req.file) await pool.query("DELETE FROM Images where cloudinaryId=$1", [event.imageid || event.imageId]);
      res.status(200).send("Create successfully");
    }
  } catch (e) {
    next(e);
  }
};
const deleteNewEvent = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM EventTemplate Where id=$1", [req.params.id]);
    res.status(200).send("Delete sucessfully");
  } catch (e) {
    next(e);
  }
};
const deleteRunningEvent = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM EventBooking where eventId=$1", [req.params.id]);
    await pool.query("DELETE FROM RunningEvent Where id=$1", [req.params.id]);
    res.status(200).send("Delete sucessfully");
  } catch (e) {
    next(e);
  }
};
const stopEvent = async (req, res, next) => {
  try {
    await pool.query("UPDATE RunningEvent SET isStop=1 where id=$1", [req.params.id]);
    res.send("Stop successfully!");
  } catch (e) {
    next(e);
  }
};
const sentNotificationEmail = async (req, res, next) => {
  try {
    const eventQuery = await pool.query("SELECT * FROM RunningEvent where id=$1", [req.params.id]);
    const event = eventQuery.rows[0] || {};
    const discount = event.discount;
    let listEmailRes = await pool.query("SELECT email From Customer");
    let listEmail = listEmailRes.rows.map(el => el.email);
    const to = listEmail.join(",");
    const data = { to, subject: "New event upcoming!!" };
    try {
      await emailService.sendEjsMail({ template: "template", templateVars: { discount }, ...data });
      res.send("Send mail successfully !");
    } catch (error) {
      res.status(500).send("Send mail fail !");
    }
  } catch (e) {
    next(e);
  }
};
module.exports = {
  getNewEvent,
  getRunningEvent,
  createNewEvent,
  updateEvent,
  deleteNewEvent,
  deleteRunningEvent,
  sentNotificationEmail,
  stopEvent,
};
