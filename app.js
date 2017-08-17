var express = require('express');
var path = require('path');
var index = require('./routes/index');
var bodyParser = require('body-parser');
var mustache = require('mustache-express');
var fs = require('fs-extra');
var Busboy = require('busboy');
var app = express();
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
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
