const multer = require("multer");
const path = require("path");

const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// module.exports = multer({
//   storage: storageEngine,
//   limits: {
//     fileSize: 1024 * 1024 * 3,
//   },
//   fileFilter: fileType,
// });

const upload = multer({ storageEngine });
module.exports = upload;
