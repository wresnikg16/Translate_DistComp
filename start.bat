@echo off

call npm install
call pip install pika
call pip install websocket-client

echo starting JavaScript addworker...
cd .\workers
start cmd /k call .\findworker.py

echo starting Python findworker...
start cmd /k call node .\addworker

echo starting Java deleteworker...
start cmd /k call java -jar DeleteWorker.jar

echo starting Node Webserver...
cd .\server
call node .\server.js