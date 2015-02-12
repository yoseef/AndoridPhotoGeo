
function db_insert(imatge) {
    alert('insertant dades...')
    var db = openDatabase('imageDB', '1.0', 'My Sample DB', 100 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('create table if not exists imatge(id, titol, image, descripcio,latitud,longitud)');
        tx.executeSql('insert into imatge(id, titol, image, descripcio, latitud, longitud) values (?,?,?,?,?,?)',
                [imatge.idImatge, imatge.titol, imatge.image, imatge.descripcio, imatge.lat, imatge.long]);

    }, errorCB, successCB);
    function errorCB(){
        alert('Error al insertar dades');
    };
    function successCB(){
        alert('S \'ha insertat les dades');
    };
}

function db_select() {
    tx.executeSql('select * from imatge', [100], function (tx, rs) {
        var imagenes=[];
        for (var i = 0; i < rs.rows.length; i++) {
            var imagen = rw.rows.item(i);
            imagenes.push(imagen);
            console.log(imagen.idImatge, imagen.titol, imagen.image, imagen.descripcio, imagen.lat, imagen.long);
        }
        return imagenes;
    }, errorCB);
    function errorCB(){
        alert('Error al seleccionar dades');
    };
}

