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
var port = process.env.PORT || config["server"]["port"];
var db; 
let find_json = [];
var config = yml.sync('config.yml');

var connection = new WebSocket('ws://10.71.2.233:1337');

//Database
function init() {
  db = new sqlite.Database('./.db/dictionary.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    //console.log('Connected to the SQlite db.');
  });
  db.getAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.get(sql, function (err, row) {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
  };
  
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
  };
  
  db.runAsync = function (sql) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.run(sql, function(err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    })
  };
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
      console.log("Word already exists, german: %s english: %s", german, english);
    } else {
      console.log("Word created, german: %s english: %s", german, english);
    }
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
    row = {status: "deleted"};
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
    row = {status: "nothing found"};
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
amqp.connect('amqp://localhost',function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'newWords';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      // insert into database
      var splitted = msg.content.toString().split(" : ");
      var german = splitted[0];
      var english = splitted[1];

      init();
      insert("translate", german, english);
      dbClose();

      //console.log(" [x] Received german: %s english:", german,english);
    }, {noAck: true});
  });
});
