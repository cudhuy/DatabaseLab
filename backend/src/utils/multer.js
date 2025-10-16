const multer = require("multer");

const storageEngine = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const fileType = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage: storageEngine,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: fileType,
});
