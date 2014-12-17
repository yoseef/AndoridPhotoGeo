app = {
    // Application Constructor
    initialize: function () {
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

        ferFoto();
        //app.receivedEvent();
    },
    // Update DOM on a Received Event
    receivedEvent: function () {
        //ferFoto;
    }

};
var ferFoto = function () {
    var button = document.getElementById('btn');
    button.addEventListener('click', function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            destinationType: Camera.DestinationType.DATA_URL
                    //quality: 100,
                    //targetWidth: 400,
                    //targetHeight: 500,
                    //destinationType: Camera.DestinationType.DATA_URL,
                    //correctOrientation: true
        });
    }, false);
    function onSuccess(imageData) {
        //es mostra la imatge a la pantalla
        var image = document.getElementById('pht');
        image.src = "data:image/jpeg;base64," + imageData;
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
var obtenirCoordenades = function () {
    alert('buscant ubicacio...');
    watchID = navigator.geolocation.watchPosition(gotPosition, geolocationError, {maximumAge: 5000, timeout: 60000, enableHighAccuracy: true});
    /*
     navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError,
     {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
     var geolocationSuccess = function (position) {
     alert('Latitude: ' + position.coords.latitude + '\n' +
     'Longitude: ' + position.coords.longitude + '\n' +
     'Altitude: ' + position.coords.altitude);
     };
     */
    function geolocationError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }
};
function gotPosition(position) {
    var ele = document.getElementById('geoo');
    ele.innerText = position.coords.latitude + ' , ' + position.coords.longitude;
    //ele.setAttribute("alt", position.coords.latitude + ' ' + position.coords.longitude);

    /*alert('Latitude: ' + position.coords.latitude + '\n' +
     'Longitude: ' + position.coords.longitude + '\n');*/
}

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
app.initialize();
