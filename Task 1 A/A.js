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
            if (i == 0 && j == 0) {
                var lastBegin = td;
                td.style.backgroundColor = "green";
            }
            if (i == 1 && j == 1) {
                var lastEnd = td;
                td.style.backgroundColor = "red";
            }
            td.setAttribute("onclick", "chekerButtons(this)");
            td.setAttribute("id", i+" - "+j)
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
        case "Wall":
            divButton.setAttribute("value", "Wall");
            break;
        case "deleteWall":
            divButton.setAttribute("value", "deleteWall");
            break;
    }
}

function chekerButtons(block) {
    var divButtons = document.getElementById('selectButton');
    var countSelectedButton = divButtons.getAttribute("value");
    switch (countSelectedButton) {
        case "Begin":
            setBegin(block);
            lastBegin = block;
            break;
        case "End":
            setEnd(block);
            lastEnd = block;
            break;
        case "Wall":
            setWall(block);
            break;
        case "deleteWall":
            deleteWall(block);
            break;
    }
}

function deleteWall(block) {
    block.style.backgroundColor = "white";
}

function setWall(block) {
    block.style.backgroundColor = "black";
}

function setEnd(block, lastEnd) {
    lastEnd.style.backgroundColor = "white";
    block.style.backgroundColor = "red";
}

function setBegin(block) {
    lastBegin.style.backgroundColor = "white";
    block.style.backgroundColor = "green";
}

function createLabyrinth(mapSize) {

}

function findPath(mapSize) {
    var matrix = createMatrix(mapSize);

}

function createMatrix(mapSize) {
    mapSize = parseInt(mapSize);
    var currentBlock;
    var matrix = new Array(mapSize);
    for (let i = 0; i < mapSize; i++) {
        matrix[i] = new Array(mapSize);
    }
    for (let i = 0; i < mapSize; i++)
    {
        for (let j = 0; j < mapSize; j++) {
            currentBlock = document.getElementById(i+" - "+j).style.backgroundColor;
            switch (currentBlock) {
                case ("black"):
                    matrix[i][j] = -1;
                    break;
                case ("white"):
                    matrix[i][j] = 0;
                    break
                case ("green"):
                    matrix[i][j] = 1;
                    break;
                case ("red"):
                    matrix[i][j] = 2;
                    break;
            }
        }
    }
    return matrix;
}
