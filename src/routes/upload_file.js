const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rfc = req.body.rfc;
    const uploadPath = path.join('uploads', rfc);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const rfc = req.body.rfc;
    cb(null, `${rfc}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

const verifyRFC = (req, res, next) => {
  console.log('Verificando RFC:', req.body.rfc);
  if (!req.body.rfc) {
    return res.status(400).send({ message: 'Please provide an RFC' });
  }
  next();
};

router.post('/upload', upload.single('file'), verifyRFC, (req, res) => {
  console.log('Archivo recibido:', req.file);
  if (!req.file) {
    return res.status(400).send({ message: 'Please upload a file' });
  }

  const rfc = req.body.rfc;
  const filename = req.file.filename;
  const filePath = path.join('uploads', rfc, filename);

  res.send({
    message: 'File uploaded successfully',
    filePath: filePath
  });
});

router.get('/list', (req, res) => {
  const rfc = req.query.rfc;

  if (!rfc) {
    return res.status(400).send({ message: 'Please provide an RFC' });
  }

  const uploadPath = path.join('uploads', rfc);

  if (!fs.existsSync(uploadPath)) {
    return res.status(400).send({ message: 'RFC directory does not exist' });
  }

  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).send({ message: 'Error reading directory' });
    }

    res.send({
      rfc: rfc,
      files: files
    });
  });
});

module.exports = router;
