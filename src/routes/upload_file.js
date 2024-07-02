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
    const uploadPath = path.join(__dirname, '../../uploads', rfc);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const verifyRFC = (req, res, next) => {
  console.log('Verificando RFC:', req.body.rfc);
  console.log('Request body:', req.body); // Añadir esta línea para verificar el cuerpo de la solicitud
  if (!req.body.rfc) {
    return res.status(400).send({ message: 'Por favor proporciona un RFC' });
  }
  next();
};

router.post('/', verifyRFC, upload.any(), (req, res) => {
  console.log('Archivos recibidos:', req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: 'Por favor sube al menos un archivo' });
  }

  res.send({
    message: 'Archivos subidos exitosamente',
    files: req.files.map(file => file.originalname)
  });
});

module.exports = router;
