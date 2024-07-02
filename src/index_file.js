const express = require('express');
const multer = require('multer');
const uploadRouter = require('./routes/upload_file'); // Asegúrate de que el nombre del archivo coincida

const app = express();
const port = 3026;

// Configurar multer como middleware global para manejar multipart/form-data
const upload = multer();
app.use(upload.none());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/upload', uploadRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
