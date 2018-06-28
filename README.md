
# How to get the project running

- First of all, check if and which version of node.js you have installed:
    CLI where node
        node --version
    If your version is below v7.6 (e.g. v6.11.3) you need to update it.Follow the steps below *** START: update node version - on Windows ***. 
- npm install (load alle dependencies)
- start receive.js in Server folder with "node receive.js"
- the databse should be created automatic form the server, the table "translate" is currently not automatic created
  (can be created with createTable("translate") function) 
- start server.js in Client folder with "node server.js"
  in the add area of the webpage words can be added
- server.js writes in queue newWords and receive.js get the values and insert them into the database

# START: update node version - on Windows
## STEP 1: uninstall old versions of node / npm **
    https://stackoverflow.com/questions/20711240/how-to-completely-remove-node-js-from-windows
 - Uninstall from Programs & Features with the uninstaller.
 - Reboot (or you probably can get away with killing all node-related processes from Task Manager).
 - Look for these folders and remove them (and their contents) if any still exist. Depending on the version you installed, UAC settings, and CPU architecture, these may or may not exist:
    C:\Program Files (x86)\Nodejs
    C:\Program Files\Nodejs
    C:\Users\{User}\AppData\Roaming\npm (or %appdata%\npm)
    C:\Users\{User}\AppData\Roaming\npm-cache (or %appdata%\npm-cache)
    C:\Users\{User}\.npmrc (and possibly check for that without the . prefix too)
    C:\Users\{User}\AppData\Local\Temp\npm-*
 - Check your %PATH% environment variable to ensure no references to Nodejs or npm exist.
 - If it's still not uninstalled, type where node at the command prompt and you'll see where it resides -- delete that (and probably the parent directory) too.
 - Reboot, for good measure.
## STEP 2: install nvm
    https://github.com/coreybutler/nvm-windows/releases
 - download the latest nvm-setup.zip
 - unzip and run it, follow the setup wizard
 - start a new CLI and type "nvm" to check if its properly installed, you should get the running version and usage information. 
## STEP 3: install node & npm 
 - type "nvm install latest" into your CLI and restart it
 - "nvm arch" shows if node is running in 32 or 64 bit mode, "nvm list" lists the node.js installations.
 - type "nvm use yourVersionNumber", you should receive something like this: 'Now using node v10.5.0 (64-bit)'
 - check again "node --version" and go on with the installation of our project 
 ### END: update node version - on Windows
