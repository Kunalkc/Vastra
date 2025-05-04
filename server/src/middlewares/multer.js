const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/multeruploads/'); // create this folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // eg. 165642.png
  },
});

const upload = multer({ storage });
module.exports = upload;