const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');


router.post('/', upload.single('image'), async (req, res) => {
    try {
      console.log("in upload to cloudinary")
      console.log(req.file.path)
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Vastra',
      });
      console.log('after upload')
      // Optional: Delete local file after upload
      fs.unlinkSync(req.file.path);
  
      res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      res.status(500).json({ message: 'Upload failed', error: err });
      console.log(err)
    }
  });

module.exports = router