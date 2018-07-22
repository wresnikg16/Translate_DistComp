# How to get the project running
***
- First of all, check in your CLI if and which version of node.js you have installed:
    ```where node```
    ```node --version```
    If your version is below v7.6 (e.g. v6.11.3) you need to update it.Follow the steps: [update node version - on Windows](./documentation/updateNodeVersion.md). 
- ```npm install``` loads all necessary dependencies and libraries
- go to the **workers** folder and start **addworker.js** to initialise the database and automatically create its table  
   ```cd .\workers```  
   ```node addworker.js```
- open a new CLI, go to the **server** folder and start **server.js** to get the front end running  
   ```cd .\server```  
   ```node server.js```
- open your browser on <http://localhost:8081>
- in the add/search/delete area of the webpage words can be added, searched for or deleted from the dictionary.
