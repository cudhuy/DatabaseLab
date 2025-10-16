const httpStatus = require("http-status");
const mssql = require("mssql");
const cloudinary = require("../utils/cloudinary");
const { emailService } = require("../services");

const getNewEvent = async (req, res, next) => {
  const request = new mssql.Request();
  let eventQuery;
  try {
    eventQuery = await request.query(
      "SELECT * from EventTemplate LEFT JOIN Images on EventTemplate.imageId=Images.cloudinaryId"
    );
  } catch (e) {
    return next(e);
  }
  console.log(eventQuery.recordset);
  res.json(eventQuery.recordset);
};
const getRunningEvent = async (req, res, next) => {
  const request = new mssql.Request();
  let eventQuery;
  try {
    eventQuery = await request.query(
      "SELECT * from RunningEvent LEFT JOIN Images on RunningEvent.imageId=Images.cloudinaryId"
    );
  } catch (e) {
    return next(e);
  }
  res.json(eventQuery.recordset);
};
const createNewEvent = async (req, res, next) => {
  let createBody;
  if (!req.file) {
    createBody = {
      title: req.body.title ? req.body.title : "Untitled",
      description: req.body.description ? req.body.description : "No description",
      discount: req.body.discount || 0,
    };
  } else {
    const result = await cloudinary.uploader.upload(req.file.path);
    const request = new mssql.Request();
    if (!result) {
      const err = new Error("Can not upload image");
      err.statusCode = 400;
      return next(err);
    }
    await request.query(`INSERT INTO IMAGES(url,cloudinaryId) VALUES ('${result.secure_url}','${result.public_id}') `);
    let discount = 0;
    if (!req.body.discount) discount = req.body.discount;
    console.log(discount);
    createBody = {
      title: req.body.title ? req.body.title : "Untitled",
      description: req.body.description ? req.body.description : "No description",
      discount,
      image: { url: result.secure_url, cloudinary_id: result.public_id },
    };
  }
  console.log(createBody);

  const request = new mssql.Request();
  if (createBody.image) {
    await request.query(
      `INSERT INTO EventTemplate(title,description,discount,imageId) VALUES('${createBody.title}','${createBody.description}','${createBody.discount}','${createBody.image.cloudinary_id}')`
    );
    console.log("Event create");
  } else {
    await request.query(
      `INSERT INTO EventTemplate(title,description,discount) VALUES('${createBody.title}','${createBody.description}','${createBody.discount}')`
    );
    console.log("Event create");
  }
  const idQuery = await request.query("SELECT TOP(1) id FROM EventTemplate ORDER BY id DESC");
  res.json({ ...createBody, _id: idQuery.recordset[0].id });
};
const updateEvent = async (req, res, next) => {
  const request = new mssql.Request();
  const eventQuery = await request.query(`SELECT * from EventTemplate where id='${req.params.id}'`);
  if (eventQuery.recordset.length <= 0) {
    const err = new Error("Can not find event");
    err.statusCode = 404;
    return next(err);
  }
  const event = eventQuery.recordset[0];
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
    console.log(`SELECT * FROM RunningEvent where 
    (
      startTime <= CAST '${req.body.meta.startTime}' as datetime) AND
      endTime >=(CAST '${req.body.meta.endTime}' as datetime)
    ) OR 
    (
      startTime <= (CAST '${req.body.meta.endTime}' as datetime) AND
      endTime >=(CAST '${req.body.meta.endTime}' as datetime) 
    )
    OR 
    (
      startTime <= (CAST '${req.body.meta.startTime}' as datetime) AND
      endTime >=(CAST '${req.body.meta.startTime}' as datetime)
    )
    
    `);
    const eventCheck = await request.query(
      `SELECT * FROM RunningEvent where 
    (
      startTime <= CAST( '${req.body.meta.startTime}' as datetime) AND
      endTime >=CAST( '${req.body.meta.endTime}' as datetime)
    ) OR 
    (
      startTime <= CAST( '${req.body.meta.endTime}' as datetime) AND
      endTime >=CAST( '${req.body.meta.endTime}' as datetime) 
    )
    OR 
    (
      startTime <= CAST( '${req.body.meta.startTime}' as datetime) AND
      endTime >=CAST( '${req.body.meta.startTime}' as datetime)
    )
    
    `
    );

    if (eventCheck.recordset.length >= 1) {
      const err = new Error("Can not create because in the same period with another event");
      err.statusCode = 403;
      return next(err);
    }
    if (!event.imageId) {
      await request.query(`INSERT INTO RunningEvent(title,description,discount,startBookingTime,
        endBookingTime,startTime,endTime) 
      VALUES ('${event.title}','${event.description}','${event.discount}',
      '${req.body.meta.startBookingTime}',
      '${req.body.meta.endBookingTime}','${req.body.meta.startTime}','${req.body.meta.endTime}')`);
    } else
      await request.query(`INSERT INTO RunningEvent(title,description,discount,imageId,startBookingTime,
                         endBookingTime,startTime,endTime) 
                       VALUES ('${event.title}','${event.description}','${event.discount}','${event.imageId}',
                       '${req.body.meta.startBookingTime}',
                       '${req.body.meta.endBookingTime}','${req.body.meta.startTime}','${req.body.meta.endTime}')`);
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
      if (event.imageId) cloudinary.uploader.destroy(event.imageId);
      await Promise.all([
        request.query(`INSERT INTO IMAGES(url,cloudinaryId) VALUES('${result.secure_url}','${result.public_id}')`),
      ]);
      console.log("OK");
    }
    console.log(`UPDATE EventTemplate SET title='${req.body.title || event.title}' ,
    description='${req.body.description || event.description}' , discount='${req.body.discount || event.discount}',
     imageId='${result.public_id || event.imageId}' where id='${req.params.id}'`);

    await request.query(`UPDATE EventTemplate SET title='${req.body.title || event.title}' 
  , description='${req.body.description || event.description}' , discount='${req.body.discount || event.discount}',
   imageId='${result.public_id || event.imageId}' where id='${req.params.id}'`);
    if (req.file) await request.query(`DELETE FROM Images where cloudinaryId='${event.imageId}'`);
    res.status(200).send("Create successfully");
  }
};
const deleteNewEvent = async (req, res, next) => {
  const request = new mssql.Request();
  try {
    await request.query(`DELETE FROM EventTemplate Where id='${req.params.id}'`);
    res.status(200).send("Delete sucessfully");
  } catch (e) {
    return next(e);
  }
};
const deleteRunningEvent = async (req, res, next) => {
  const request = new mssql.Request();
  try {
    await request.query(`DELETE FROM EventBooking where eventId='${req.params.id}'`);
    await request.query(`DELETE FROM RunningEvent Where id='${req.params.id}'`);
    res.status(200).send("Delete sucessfully");
  } catch (e) {
    return next(e);
  }
};
const stopEvent = async (req, res, next) => {
  const request = new mssql.Request();
  await request.query(`UPDATE RunningEvent SET isStop='1' where id='${req.params.id}'`);
  res.send("Stop successfully!");
};
const sentNotificationEmail = async (req, res, next) => {
  const request = new mssql.Request();
  const eventQuery = await request.query(`SELECT * FROM RunningEvent where id='${req.params.id}'`);
  const { discount } = eventQuery.recordset[0];
  let listEmail = (await request.query("SELECT email From Customer")).recordset;
  listEmail = listEmail.map(el => el.email);
  const to = listEmail.join(",");
  console.log(to);

  const data = { to, subject: "New event upcoming!!" };
  try {
    await emailService.sendEjsMail({ template: "template", templateVars: { discount }, ...data });
    res.send("Send mail successfully !");
  } catch (error) {
    res.status(500).send("Send mail fail !");
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
