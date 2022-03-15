function createMap(){
    var mapSize = parseInt(document.getElementById('InputMapSize').value);
    var table = document.createElement('table');

    for (var i = 0; i < mapSize; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < mapSize; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    appendChild(table)
}

function clearMap() {
    document.querySelector('.map').innerHTML = '';
}

function createLabyrinth(mapSize) {

}
