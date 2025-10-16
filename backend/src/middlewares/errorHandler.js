exports.errorHandler = (err, req, res, _) => {
  const error = err;
  if (error.code === 11000) {
    error.statusCode = 400;

    for (const p in error.keyValue) {
      if (Object.prototype.hasOwnProperty.call(error.keyValue, p)) error.message = `${p} has to be unique`;
    }
  } else if (error.kind === "ObjectId") {
    error.statusCode = 404;
    error.message = `The ${req.originalUrl} is not found because of wrong ID`;
  } else if (error.statusCode >= 500 || !error.statusCode) error.statusCode = 400;
  res.status(error.statusCode).json({
    status: "fail",
    message: error.message,
  });
};
