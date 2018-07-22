// BASE SETUP
// ==============================
var amqp = require('amqplib/callback_api');
var yml = require('read-yaml');
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var config = yml.sync('config.yml');
var port = process.env.PORT || config["server"]["port"];
var config = yml.sync('config.yml');

//Websocket
var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8082, function() {
    console.log((new Date()) + ' Websocket Server is listening on port 8082');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // we allow everyone to connect to our websocket
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept("", request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);

            //TODO call function for client feedback
            connection.sendUTF("got your message: " + message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


// Send the wordpair to add to the Add Queue
function sendToQueueAdd(wordPair) {

  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
    var q = 'addQueue';
    var msg = wordPair;

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
    });
    //Close the Connection
    setTimeout(function() { conn.close(); }, 500);
  });
}

// Send the word to delete to the deleteQueue
function sendToQueueDelete(word) {
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
    var q = 'deleteQueue';
    var msg = word;

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
    });
    //Close the Connection
    setTimeout(function() { conn.close(); }, 500);
  });
}

//Send the word to search for to the Find Queue
function sendToQueueFind(word) {

  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
    var q = 'findQueue';
    var msg = word;

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer.from(msg));
    console.log(" [x] Sent %s to find queue", msg);
    });
    //Close the Connection
    setTimeout(function() { conn.close(); }, 500);
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
// ==============================
router.post('/new', async function (req, res) {
  var german = req.body.german;
  var english = req.body.english;

  sendToQueueAdd(german + " : " + english);
  res.send("your word was send to the add queue");
});

router.get("/find/:word", async function (req, res) {
  var word = req.params.word;
  sendToQueueFind(word);
});

router.post('/delete', async function (req, res) {
  var word;
  if (req.body.word !== undefined) {
      word = req.body.word;
      sendToQueueDelete(word);
      res.send("your word was sent to the delete queue");
  }
});

// START THE SERVER
// ==============================
app.use('/', router);
app.listen(port, config["server"]["ip"]);
console.log("Webserver listening on port  " + port + "!");
