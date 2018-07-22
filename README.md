# How to get the project running

- First of all, check in your CLI if and which version of node.js you have installed:  
    ```where node```  
    ```node --version```  
    If your version is below v7.6 you need to update it.  
    Either use the latest version from [node.js](https://nodejs.org/en/download/) or follow these steps: [update node version - on Windows](./documentation/updateNodeVersion.md). 
- Download and install [RabbitMQ](https://www.rabbitmq.com/download.html) and the necessary [Plugins](https://www.rabbitmq.com/management.html). 
- Check if your path variable contains the paths to the executables for Node, Python and Java.
- Type ```.\start.bat``` into your CLI to 
   - install the necessary node_modules,  
   - install Python libraries,
   - start the three workers,
   - start the node webserver. 
- Open your browser on [http://localhost:8081](http://localhost:8081)
- In the add/search/delete area of the webpage words can be added, searched for or deleted from the dictionary.
