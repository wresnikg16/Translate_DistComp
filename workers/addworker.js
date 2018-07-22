#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

var express = require('express');
var sqlite = require('sqlite3').verbose();
var socketConfig = "ws://localhost:8082/";
var db;
var responseMessage = "";

//Websocket
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

  client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
  });

  client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
      console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
      console.log('Websocket Connection Closed');
    });
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log("Received: '" + message.utf8Data + "'");
      }
      connection.close();
    });

    function sendMessage() {
      if (connection.connected) {
        connection.sendUTF(responseMessage);
      }
    }
    sendMessage();
  });

 


//Database
function init() {

    db = new sqlite.Database('./db/dictionary.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        //console.log('Connected to the SQlite db.');
    });
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

    if (err) {
      responseMessage = "Word already exists, german: " + german +" english: " + english;
      console.log(responseMessage);
    } else {
      responseMessage = "Word created, german: " + german +" english: " + english;;
      console.log(responseMessage);
    }
    //sendResponse(responseMessage, socketConfig);
    client.connect(socketConfig, '');
    //client.
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

//Create Table
init();
createTable("translate");
dbClose();

//Get from the newWords queue
amqp.connect('amqp://localhost', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var q = 'addQueue';

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
