echo Start DB & Addworker
call cd ./workers
call node addworker.js

echo Start GUI
call cd ../server
call node server.js

echo Start other workers
call cd ../workers
::call java