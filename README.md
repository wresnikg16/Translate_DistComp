# How to get the project running
***
- First of all, check in your CLI if and which version of node.js you have installed:
    ```where node```
    ```node --version```
    If your version is below v7.6 (e.g. v6.11.3) you need to update it.
    Either use lates version or follow these steps: [update node version - on Windows](./documentation/updateNodeVersion.md). 
- Download and install [RabbitMQ](https://www.rabbitmq.com/download.html) and the necessary [Plugins](https://www.rabbitmq.com/management.html). 
- Check if your path variable contains the paths to the executables for Node, Python and Java.
- type ```.\start.bat``` into your CLI to 
   - install the necessary node_modules
   - install Python libraries
   - start the three workers
   - start the node webserver 
- open your browser on [http://localhost:8081](http://localhost:8081)
- in the add/search/delete area of the webpage words can be added, searched for or deleted from the dictionary.