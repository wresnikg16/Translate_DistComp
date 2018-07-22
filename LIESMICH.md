# Wie bekommt man das Projekt zum Laufen

- kontrolliere durch Eingabe in der Kommandozeile (cmd.exe) ob und welche Version von node.js installiert ist:
    ```where node```  
    ```node --version```  
    Wenn die Version unter v7.6 ist dann muss sie aktualisiert werden.  
    Entweder benutze die aktuellste Verstion oder folge diesen Schritten: [update node version - on Windows](./documentation/updateNodeVersion.md).
- downloade und installiere [RabbitMQ](https://www.rabbitmq.com/download.html) und die notwendigen [Plugins](https://www.rabbitmq.com/management.html). 
- kontrolliere ob die Umgebungsvariable die Pfade zu den executables für Node, Python und Java beinhaltet.
- tippe ```.\start.bat``` in die Kommandozeile um  
   - die notwendigen node Module zu installieren  
   - Python Bibliotheken zu installieren  
   - die drei Worker zu starten  
   - und den node Webserver zu starten
- öffne den Browser auf [http://localhost:8081](http://localhost:8081)
- im add/search/delete Bereich der Webseite können Wörter hinzugefügt, gesucht und aus dem Wörterbuch gelöscht werden.
