// server.js

// BASE SETUP
// ==============================
var amqp = require('amqplib/callback_api');
var yml = require('read-yaml');
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var sqlite = require('sqlite3').verbose();
var config = yml.sync('config.yml');
var port = process.env.PORT || config["server"]["port"];
var db; 
let find_json = [];
var config = yml.sync('config.yml');


//Send to RabbitMQ
function sendToQueue(wordPair) {

  amqp.connect('amqp://localhost', function(err, conn) {
      conn.createChannel(function(err, ch) {
      var q = 'newWords';
      var msg = wordPair;

      ch.assertQueue(q, {durable: false});
      // Note: on Node 6 Buffer.from(msg) should be used
      ch.sendToQueue(q, new Buffer(msg));
      console.log(" [x] Sent %s", msg);
      });
  //Close the Connection
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/sites', express.static(__dirname + "/sites"));
app.use(express.static('imgs'));

// ROUTES
// ==============================

router.get('/', function (req, res) {
  res.sendfile("sites/index.html");
});

router.get('/add', function (req, res) {
  res.sendfile("sites/add.html");
});

router.get('/remove', function (req, res) {
  res.sendfile("sites/remove.html");
});

// ROUTES WITH PARAMETER

router.post('/new', async function (req, res) {
  var german = req.body.german;
  var english = req.body.english;

  sendToQueue(german + " : " + english);
  /*
  init();
  insert("translate", german, english);
  find_json = await dbSelectWord("german", german);
  dbClose();
  if (find_json["status"] != "nothing found") {
    res.send({status: "ok"});
  } else {
    res.send(find_json);
  }
  */
});

// START THE SERVER
// ==============================

app.use('/', router);

app.listen(port, config["server"]["ip"]);
console.log("Making le voodoo on port " + port + "! Go and check it out!");
