# Wie bekommt man das Projekt zum Laufen
***
- Zuerst, kontolliere durch Eingabe in der Kommandozeile (cmd.exe) ob und welche Version von node.js installiert ist:
    ```where node```  
    ```node --version```
    Wenn deine Verion unter v7.6 ist (z.B. v6.11.3), dann musst du sie aktualisieren. Folge den Schritten: [**update node version - on Windows**](documentation/update node version.md). 
- ```npm install``` lädt alle notwendigen Abhängigkeiten und Bibliotheken
- wechsle in den **workers** Ordner und starte **addworker.js** um die Datenbank zu initialisieren und automatisch ihre Tabelle zu kreieren.  
   ```cd .\workers```  
   ```node addworker.js```
- welchsle in den **server** Ordner und start **server.js** um das Front End zum Laufen zu bringen  
   ```cd ..\server```  
   ```node server.js```
- Öffne deinen Browser auf <http://localhost:8081>
- im add/search/delete Bereich der Webseite können Wörter hinzugefügt, gesucht und aus dem Wörterbuch gelöscht werden.