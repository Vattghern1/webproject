function createMap(){
    clearMap();
    var mapSize = parseInt(document.getElementById('InputMapSize').value);
    var table = document.querySelector('tbody');

    for (var i = 0; i < mapSize; i++) {
        var tr = document.createElement('tr');
        tr.classList.add("map-line");
        for (var j = 0; j < mapSize; j++) {
            var td = document.createElement('td');
            td.classList.add("map-block");
            td.setAttribute("onclick", "chekerButtons(this)");
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function clearMap() {
    document.querySelector('tbody').innerHTML = '';
}

function chooseWallBeginEnd(valueSelectedButton) {
    var divButton = document.getElementById("selectButton");
    switch (valueSelectedButton) {
        case "Begin":
            divButton.setAttribute("value", "Begin");
            break;
        case "End":
            divButton.setAttribute("value", "End");
            break;
        default:
            divButton.setAttribute("value", "Wall");
    }
}

function chekerButtons(block) {
    var divButtons = document.getElementById('selectButton');
    var countSelectedButton = divButtons.getAttribute("value");
    switch (countSelectedButton) {
        case "Begin":
            setBegin(block);
            break;
        case "End":
            setEnd(block);
            break;
        default:
            setWall(block);
    }
}

function setWall(block) {
    block.style.backgroundColor = "black";
}

function setEnd(block) {
    block.style.backgroundColor = "red"
}

function setBegin(block) {
    block.style.backgroundColor = "green"
}

function createLabyrinth(mapSize) {

}

function findPath() {

}
