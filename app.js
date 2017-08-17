const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const fs = require('fs-extra');
const Busboy = require('busboy');
const app = express();
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req, res){
  res.render("index");
});

// Accept POST request on '/upload'.
app.post('/upload', function (req, res) {
  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    var saveTo = path.join('./public/uploads/', path.basename(filename));
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', function() {
    res.writeHead(200, { 'Connection': 'close' });
    res.end("Uploaded file to: /uploads");
  });
  //Parse HTTP-POST upload
  return req.pipe(busboy);
});

app.listen(3000, function () {
  console.log('Successfully started node application!')
})
