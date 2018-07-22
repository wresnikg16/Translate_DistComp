function myJsonFunction(myJson) {
    var out = "";
    if (myJson === undefined){
        out = "Sorry, nothing found";
    } else {
        out = 'German: ' + myJson.german + ' English: ' + myJson.english;
    }
    document.getElementById("word").innerHTML = out;
}

function addWord() {
    var xmlhttp = new XMLHttpRequest();
    var german = document.getElementById("german").value;
    var english = document.getElementById("english").value;
    var params = {"german": german, "english": english}
    var url = "/new";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            addFunction(this.responseText);
        }
    };

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(params));
}

function addFunction(text) {
    document.getElementById("done").innerHTML = text;
    document.getElementById("german").value = ""; 
    document.getElementById("english").value = ""; 
}

function removeWord() {
    var xmlhttp = new XMLHttpRequest();
    var word = document.getElementById("name").value;
    var params = {"word": word};
    var url = "/delete";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            RemoveFunction(this.responseText);
        }
    };
    
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(params));
    
}

function RemoveFunction(text) {
    document.getElementById("removed").innerHTML = text;
    document.getElementById("name").value =""; 
}

function loadWord() {
    var xmlhttp = new XMLHttpRequest();
    var word = document.getElementById("search").value;
    console.log(word);
    var url = "/find/" + word;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myJson = JSON.parse(this.responseText);
            myJsonFunction(myJson);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}