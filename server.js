const express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const randomId = require('random-id');
const cors = require("cors");
const multer = require('multer');
const mysql = require('mysql');

const app = express();
const port = 3070;

//body parser configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// multer configuration for file storing
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../ai-chat/src/assets/img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

// CORS configuration
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'DELETE',
    'PUT',
  ],
  allowedHeaders: [
    'Content-Type',
  ],
};
app.use(cors(corsOpts));

// Controllers
const userController = require('./controllers/user_controller');
const documentController = require('./controllers/document_controller');

// Routes
// GET 
app.get('/user/:id', userController.getById);
app.get('/documents/:userId', documentController.getAllByUserId);

// POST
app.post('/login', userController.login);
app.post('/register', userController.register);
app.post('/essay', documentController.generateEssay);
app.post('/coverletter', documentController.generateCoverLetter);
app.post('/document', documentController.save);

// PUT
app.put('/userpicture/:id', upload.single('file'), userController.uploadProfilePicture);

// DELETE
app.delete('/documents/:id', documentController.deleteById);


app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});