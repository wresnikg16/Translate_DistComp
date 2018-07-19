#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

var yml = require('read-yaml');
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var sqlite = require('sqlite3').verbose();
var config = yml.sync('config.yml');
var socketConfig = "ws://localhost:8082/";
var db;
let find_json = [];


//Websocket
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

function sendResponse(message, server) {
  client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
  });

  client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
      console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
      console.log('translate-protocol Connection Closed');
    });
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log("Received: '" + message.utf8Data + "'");
      }
    });

    function sendMessage() {
      if (connection.connected) {
        connection.sendUTF(message);
      }
    }
    sendMessage();
  });
  client.connect(server, 'translate-protocol');
}
//sendResponse("test1234567!!!123456789111112222333344445555666", socketConfig);

//Database
function init() {

  db = new sqlite.Database('./db/dictionary.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    //console.log('Connected to the SQlite db.');
  });
  // db.getAsync = function (sql) {
  //   var that = this;
  //   return new Promise(function (resolve, reject) {
  //     that.get(sql, function (err, row) {
  //       if (err)
  //         reject(err);
  //       else
  //         resolve(row);
  //     });
  //   });
  // };

  // db.allAsync = function (sql) {
  //   var that = this;
  //   return new Promise(function (resolve, reject) {
  //     that.all(sql, function (err, rows) {
  //       if (err)
  //         reject(err);
  //       else
  //         resolve(rows);
  //     });
  //   });
  // };

  // db.runAsync = function (sql) {
  //   var that = this;
  //   return new Promise(function (resolve, reject) {
  //     that.run(sql, function (err) {
  //       if (err)
  //         reject(err);
  //       else
  //         resolve();
  //     });
  //   })
  // };
}

function createTable(tablename) {
  db.run("CREATE TABLE " + tablename + " (german TEXT PRIMARY KEY, english TEXT)", (err) => {
    if (err) {
      console.log("Table already exists.");
    } else {
      console.log("Table created");
    }
  });
}

function insert(tablename, german, english) {
  var stmt = db.prepare("INSERT INTO " + tablename + " VALUES (?, ?)");
  stmt.run([german, english], (err) => {

    var responseMessage = "";

    if (err) {
      responseMessage = "Word already exists, german: " + german +" english: " + english;
      console.log(responseMessage);
    } else {
      responseMessage = "Word created, german: " + german +" english: " + english;;
      console.log(responseMessage);
    }
    //sendResponse(responseMessage, socketConfig);
  });
  stmt.finalize();
}

function dbClose() {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    //console.log('Close the database connection.');
  });
}

async function dbSelectAll() {
  var query = "SELECT * FROM translate";
  var rows = await db.allAsync(query);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(rows);
    }, 100);
  })
}

async function dbDeleteWord(lang, word) {
  var query = "DELETE FROM translate WHERE ??LANG?? like '??WORD??'".replace("??WORD??", word).replace("??LANG??", lang);
  console.log(query);
  var row = await db.runAsync(query);

  if (!row) {
    row = { status: "deleted" };
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(row);
    }, 100);
  })
}

async function dbSelectWord(lang, word) {
  var query = "SELECT german, english FROM translate WHERE ??LANG?? like '??WORD??%'".replace("??WORD??", word).replace("??LANG??", lang);
  var row = await db.getAsync(query);

  if (!row) {
    row = { status: "nothing found" };
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(row);
    }, 100);
  })
}

function deleteWord(lang, word) {
  init();
  find_json = dbDeleteWord(lang, word);
  dbClose();
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(find_json);
    }, 100);
  })
}

//Create Table
init();
createTable("translate");
dbClose();

//Get from the newWords queue
amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var q = 'newWords';

    ch.assertQueue(q, { durable: false });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function (msg) {
      // insert into database
      var splitted = msg.content.toString().split(" : ");
      var german = splitted[0];
      var english = splitted[1];

      init();
      insert("translate", german, english);
      dbClose();

      //console.log(" [x] Received german: %s english:", german,english);
    }, { noAck: true });
  });
});
