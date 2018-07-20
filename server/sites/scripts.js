function loadJson() {
    var xmlhttp = new XMLHttpRequest();
    var url = "/findall";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            myFunction(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function myFunction(arr) {
    var out = "<ul>";
    var i;
    for (i = 0; i < arr.length; i++) {
        out += '<li>' + arr[i].german + ' | ' + arr[i].english + '</li>'
    }
    out += "</ul>";
    document.getElementById("all").innerHTML = out;
}

// function that executes after the search button is pressed
function search() {
     console.log("started loadWord()");
     var xmlhttp = new XMLHttpRequest();
     var word = document.getElementById("search").value;
     console.log(word);
     var url = "/find";

     xmlhttp.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
             var myJson = JSON.parse(this.responseText);
             myJsonFunction(myJson);
         }
     };
     xmlhttp.open("GET", url, true);
     xmlhttp.setRequestHeader("Content-Type", "text/plain");
     xmlhttp.send(word);

}

function myJsonFunction(myJson) {
    var out = "";
    if (myJson === undefined){
        out = "Sorry, nothing found";
    } else {
        out = 'German: ' + myJson.german + ' English: ' + myJson.english;
        vibrate();
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
            AddFunction(this.responseText);
        }
    };

    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(params));
}

function AddFunction(text) {
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


function loadAdd() {
    var xmlhttp = new XMLHttpRequest();
    var url = "/add";
    var server = $('input[name="lb"]').val();

    console.log(server);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            document.getElementById("done").innerHTML = "it was created";
        }
    };
    xmlhttp.open("POST", url, true);
    xmlhttp.send();
}


function vibrate() {
    var supportsVibrate = "vibrate" in navigator;

    if (supportsVibrate) {
        function myFunction() {
            var time = document.getElementById("seconds").value;
            navigator.vibrate(time * 1000);
        }
    }
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