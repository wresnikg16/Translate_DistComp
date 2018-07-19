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
var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8082, function() {
    console.log((new Date()) + ' Server is listening on port 8082');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('translate-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);

            //toDO call function for client feedback

            //Send Info to server of recieved message
            connection.sendUTF("got your message: " + message.utf8Data);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});


//Send the wordpair to add to the Add Queue
function sendToQueueAdd(wordPair) {

  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
    var q = 'newWords';
    var msg = wordPair;

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueueAdd(q, new Buffer.from(msg));
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
    ch.sendToQueueFind(q, new Buffer.from(msg));
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

router.post('/new', async function (req, res) {
  var german = req.body.german;
  var english = req.body.english;

  sendToQueueAdd(german + " : " + english);
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


router.get('/find', async function (req, res) {
  var word = req.body.word;
  sendToQueueFind(word);
});

/*router.get('/findall', async function (req, res) {
  var word = req.params.word;
  //init();
  find_json = await dbSelectAll();
  dbClose();
  console.log(find_json);
  res.send(find_json);
});

async function dbSelectAll() {
  var query = "SELECT * FROM dictionary";
  var rows = await db.allAsync(query); // allAsync ????

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(rows);
    }, 100);
  })
}

 db.allAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.all(sql, function (err, rows) {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
  };*/

// START THE SERVER
// ==============================

app.use('/', router);

app.listen(port, config["server"]["ip"]);
console.log("Making le voodoo on port " + port + "! Go and check it out!");
