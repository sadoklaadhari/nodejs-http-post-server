const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
var bodyParser = require('body-parser');

// var cors = require('cors');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 50000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('file');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|svg/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));
app.use(bodyParser.json({ limit: '5mb' }))
app.get('/', (req, res) => {
  // res.render('index');
});

app.post('/upload', (req, res) => {
  req.header("Access-Control-Allow-Origin: *");
  res.header("Access-Control-Allow-Origin: *");
  res.header("Access-Control-Allow-Methods: POST");
  res.header("Access-Control-Allow-Headers: Origin, Methods, Content-Type");
  res.header('Accept : application/json');
  res.header('Content-Type : application/json');
  res.header('enctyp : multipart/form-data');
  upload(req, res, (err) => {
    console.log(res);
    if(err){
      res.status(500).send({ err: 'something went wrong' });
    } else {
      if(req == undefined){
        res.status(404).send( {err: 'Sorry, cant upload image!'});
      } else {

          
          file: `uploads/${req.file.filename}`;
          console.log(req.file.filename)
          res.sendStatus(200);
      }
      
      
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));