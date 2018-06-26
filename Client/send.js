#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

//Connect to RabbitMQ Server & Create Channel
//Create Queue (it will only be created if it doesn't exist already)
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });
  //Close the Connection
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});