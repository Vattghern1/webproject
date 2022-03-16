function createMap(){
    clearMap();
    var mapSize = parseInt(document.getElementById('InputMapSize').value);
    var table = document.querySelector('tbody');

    for (var i = 0; i < mapSize; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < mapSize; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function clearMap() {
    document.querySelector('tbody').innerHTML = '';
}

function createLabyrinth(mapSize) {

}
