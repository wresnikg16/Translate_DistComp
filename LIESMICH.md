# Wie man das Projekt zum Laufen bekommt

- Kontrolliere durch Eingabe in der Kommandozeile (cmd.exe) ob und welche Version von node.js installiert ist:  
    ```where node```  
    ```node --version```  
    Wenn die Version unter v7.6 ist muss sie aktualisiert werden.  
    Entweder benutze die aktuellste Version von [node.js](https://nodejs.org/en/download/) oder folge diesen Schritten: [update node version - on Windows](./documentation/updateNodeVersion.md).
- Downloade und installiere [RabbitMQ](https://www.rabbitmq.com/download.html) und die notwendigen [Plugins](https://www.rabbitmq.com/management.html). 
- Kontrolliere ob die Umgebungsvariable die Pfade zu den executables für Node, Python und Java beinhaltet.
- Tippe ```.\start.bat``` in die Kommandozeile um  
   - die notwendigen node Module zu installieren,   
   - Python Bibliotheken zu installieren,  
   - die drei Worker zu starten,  
   - und den node Webserver zu starten.
- Öffne den Browser auf [http://localhost:8081](http://localhost:8081)
- Im add/search/delete Bereich der Webseite können Wörter hinzugefügt, gesucht und aus dem Wörterbuch gelöscht werden.
