var mapSize = parseInt(document.getElementById('InputMapSize').value);

var elem = document.querySelector('#elem');
createMap(elem, mapSize);

function createMap(parent,mapSize){
    var table = document.createElement('table');

    for (var i = 0; i < mapSize; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < mapSize; j++) {
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    parent.appendChild(table);
}

function clearMap() {
    document.getElementById('elem').innerHTML = '';
}

function createLabyrinth() {

}