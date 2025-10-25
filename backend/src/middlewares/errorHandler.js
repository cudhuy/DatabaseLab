exports.errorHandler = (err, req, res, _) => {
  const error = err || {};
  // Normalize statusCode/message
  if (!error.statusCode) {
    // choose 500 for unexpected errors, else 400
    error.statusCode = error.statusCode || 400;
  }
  if (error.code === 11000) {
    error.statusCode = 400;
    for (const p in error.keyValue) {
      if (Object.prototype.hasOwnProperty.call(error.keyValue, p)) error.message = `${p} has to be unique`;
    }
  } else if (error.kind === "ObjectId") {
    error.statusCode = 404;
    error.message = `The ${req.originalUrl} is not found because of wrong ID`;
  } else if (error.statusCode >= 500 && !error.message) {
    error.message = "Internal server error";
  } else if (!error.message) {
    error.message = "Bad request";
  }

  res.status(error.statusCode).json({
    status: "fail",
    message: error.message,
  });
};
