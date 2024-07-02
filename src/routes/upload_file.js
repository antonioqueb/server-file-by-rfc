const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Estableciendo la carpeta de destino para el archivo');
    const rfc = req.body.rfc;
    console.log('RFC recibido en destination:', rfc);
    const uploadPath = path.join(__dirname, '../../uploads', rfc);
    console.log('Ruta de subida:', uploadPath);

    if (!fs.existsSync(uploadPath)) {
      console.log('La carpeta no existe, creando la carpeta:', uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log('Estableciendo el nombre del archivo:', file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).any();

const verifyRFC = (req, res, next) => {
  console.log('Verificando RFC');
  console.log('Request body:', req.body); // Verificar el cuerpo de la solicitud
  console.log('Headers:', req.headers); // Verificar los encabezados de la solicitud
  if (!req.body.rfc) {
    console.log('RFC no proporcionado');
    return res.status(400).send({ message: 'Por favor proporciona un RFC' });
  }
  console.log('RFC verificado:', req.body.rfc);
  next();
};

router.post('/', upload, (req, res, next) => {
  console.log('Middleware upload.any() completado');
  next();
}, verifyRFC, (req, res) => {
  console.log('Procesando la solicitud POST /upload');
  console.log('Archivos recibidos:', req.files);
  if (!req.files || req.files.length === 0) {
    console.log('No se recibieron archivos');
    return res.status(400).send({ message: 'Por favor sube al menos un archivo' });
  }

  res.send({
    message: 'Archivos subidos exitosamente',
    files: req.files.map(file => file.originalname)
  });
});

module.exports = router;
