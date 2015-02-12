app = {
    // Application Constructor
    init: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        var locateme = document.createElement('button');
        locateme.setAttribute("id", "getLocation");
        locateme.innerHTML = "get Location";
        var cam = document.getElementById('cam');
        cam.appendChild(locateme);
        locateme.addEventListener('click', obtenirCoordenades, false);
        
        var mostrarDades = document.createElement('button');
        mostrarDades.innerHTML = "mostrar dades";
        //mostrarDades.addEventListener('click', mostrarLesDadesSql(), false);
        cam.appendChild(mostrarDades);
        
        ferFoto();

        //app.receivedEvent();
    },
    // Update DOM on a Received Event
    receivedEvent: function () {
        //ferFoto;
    }

};
function imatge(idImatge, titol, image, descripcio, latitude, longitude) {
    this.idImatge = idImatge,
            this.titol = titol,
            this.image = image,
            this.descripcio = descripcio,
            this.lat = latitude;
    this.long = longitude;
};

var ferFoto = function () {

    var button = document.getElementById('btn');
    button.addEventListener('click', function () {
        navigator.camera.getPicture(onSuccess, onFail, {destinationType: Camera.DestinationType.DATA_URL});
    }, false);
    function onSuccess(imageData) {
        //es mostra la imatge a la pantalla
        var image = document.getElementById('pht');
        image.src = "data:image/jpeg;base64," + imageData;
        var pos = obtenirCoordenades();

        //var localitzacio = obtenirCoordenades();
        /* var ele = document.getElementById('geoo');
         ele.innerText = position.coords.latitude + ' , ' + position.coords.longitude;*/

        var newImatge = new imatge(
                1,
                "prova",
                image.src,
                "comentari",
                pos.coords.latitude,
                pos.coords.longitude);


        insertarAlSql(newImatge);

        //mostra el botp per pujar la foto
        var uploadPhotoBtn = document.createElement('button');
        uploadPhotoBtn.setAttribute("id", "upImage");
        uploadPhotoBtn.innerHTML = "upload photo";
        var cam = document.getElementById('cam');
        cam.appendChild(uploadPhotoBtn);

        var fileURI = image.src;

        //uploadPhotoBtn.addEventListener("click", uploadPhoto(fileURI), false);
    }
    function onFail(message) {
        alert('Failed cause: ' + message);
    }
};
var insertarAlSql = function (imatge) {
    alert('insertant dades...');
    db_insert(imatge);

};
var mostrarLesDadesSql = function () {
    alert('carregant dades...');
    var imatges = db_select();
    var cam = document.getElementById('cam');
    for (imatge in imatges) {
        cam.innerHTML += imatge.idImatge + '<br>' + imatge.image + '<br>' + imatge.descripcio + '<br>' + imatge.lat + ',' + imatge.long + '<br>';
    }
};
var obtenirCoordenades = function () {
    alert('buscant ubicacio...');
    //var mylocation = null;
    var onSuccess = function (position) {
        //alert(position.coords.latitude + ' , ' + position.coords.longitude);
        var ele = document.getElementById('geoo');
        ele.innerText = position.coords.latitude + ' , ' + position.coords.longitude;
        return position;
        //  mylocation = position.coords.latitude + ' , ' + position.coords.longitude;
    };

    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 5000, timeout: 60000, enableHighAccuracy: true});   

    //watchID = navigator.geolocation.watchPosition(onSuccess, onError, {maximumAge: 5000, timeout: 60000, enableHighAccuracy: true});
};


function uploadPhoto(fileURI) {
    alert('He arribat aqui, es pujara la imatge al servidor!');
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);

    if (cordova.platformId === "android") {
        //   options.fileName += ".jpg";
    }

    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request 
    options.headers = {
        Connection: "Close"
    };
    options.chunkedMode = false;

    var ft = new FileTransfer();
    ft.upload(
            fileURI,
            encodeURI("http://www.filedropper.com"),
            onFileUploadSuccess,
            onFileTransferFail,
            options);

    function onFileUploadSuccess(result) {
        console.log("FileTransfer.upload");
        console.log("Code = " + result.responseCode);
        console.log("Response = " + result.response);
        console.log("Sent = " + result.bytesSent);
        console.log("Link to uploaded file: http://www.filedropper.com" + result.response);
        var response = result.response;
        var destination = "http://www.filedropper.com/" + response.substr(response.lastIndexOf('=') + 1);
        alert("File uploaded to: " + destination);
        var openPhoto = document.createElement('button');
        openPhoto.setAttribute('onclick', "window.open('" + destination + "', '_blank', 'location=yes')");
        openPhoto.innerHTML = "Open Location";
        var cam = document.getElementById('cam');
        cam.appendChild(openPhoto);
        document.getElementById("upImage").style.display = "none";
        //document.getElementById("result").innerHTML = "File uploaded to: " +  destination + "</br><button onclick=\"window.open('" + destination + "', '_blank', 'location=yes')\">Open Location</button>";

    }

    function onFileTransferFail(error) {
        console.log("FileTransfer Error:");
        console.log("Code: " + error.code);
        console.log("Source: " + error.source);
        console.log("Target: " + error.target);
    }
}
app.init();
