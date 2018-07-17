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

//Websocket
process.title = 'Transaltor-Websocket';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = [ ];

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');

  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  var index = clients.push(connection) - 1;
  console.log((new Date()) + ' Connection accepted.');
  
  
	// we want to keep history of all sent messages
	var obj = {
	  text: 'Hello and welcome to the Chat Demo implementation!'
	  };
  var welcomeMsg = JSON.stringify({ type:'message', data: obj });
  connection.sendUTF(welcomeMsg);

  
  // user sent some message
  connection.on('message', function(message) {
	  
      console.log((new Date()) + " incoming message: " + message.utf8Data);
    // if (message.type === 'utf8') { // accept only text
    // first message sent by user is their name

        // we want to keep history of all sent messages
        var obj = {
          text: message.utf8Data
		  };
		  
        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj });
        for (var i=0; i < clients.length; i++) {
          clients[i].sendUTF(json);
        }
    // }
  });

  // user disconnected
  connection.on('close', function(connection) {
      console.log((new Date()) + " Peer "
          + connection.remoteAddress + " disconnected.");

      // remove user from the list of connected clients
      clients.splice(index, 1);
    
  });
});


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
