const express = require('express');
const uploadFileRouter = require('./routes/upload_file');

const app = express();
const port = 3011;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/upload_file', uploadFileRouter);

app.listen(port, () => {
  console.log(`File Upload Server is running at http://localhost:${port}`);
});
