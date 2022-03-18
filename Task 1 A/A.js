class blockCoordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function clearMap() {
    document.querySelector('tbody').innerHTML = '';
}

function createMap(){
    clearMap();
    mapSize = parseInt(document.getElementById('InputMapSize').value);
    table = document.querySelector('tbody');

    for (let i = 0; i < mapSize; i++) {
        let tr = document.createElement('tr');
        tr.classList.add("map-line");
        for (let j = 0; j < mapSize; j++) {
            let td = document.createElement('td');
            td.classList.add("map-block");
            if (i === 0 && j === 0) {
                lastBegin = td;
                td.style.backgroundColor = "green";
            }
            if (i === mapSize-1 && j === mapSize-1) {
                lastEnd = td;
                td.style.backgroundColor = "red";
            }
            td.setAttribute("onclick", "checkerButtons(this)");
            td.setAttribute("id", j+" - "+i)
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    createMatrix();

}

function chooseWallBeginEnd(valueSelectedButton) {
    divButton = document.getElementById("selectButton");
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

function checkerButtons(block) {
    let countSelectedButton = divButton.getAttribute("value");
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

function setEnd(block) {
    lastEnd.style.backgroundColor = "white";
    block.style.backgroundColor = "red";
}

function setBegin(block) {
    lastBegin.style.backgroundColor = "white";
    block.style.backgroundColor = "green";
}


function createLabyrinth() {
    createMatrix();
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let allBlocks = document.getElementById(i + " - " + j).style.backgroundColor;
            switch (allBlocks) {
                case "green":
                    break;
                case "red":
                    break;
                default:
                    setWall(document.getElementById(i + " - " + j));
            }
        }
    }

    let to_check = [];
    if (startBlock.y - 2 >= 0) {
        let newBlock = new blockCoordinates(startBlock.x, startBlock.y - 2)
        to_check.push(newBlock);
    }
    if (startBlock.y + 2 < mapSize) {
        let newBlock = new blockCoordinates(startBlock.x, startBlock.y + 2)
        to_check.push(newBlock);
    }
    if (startBlock.x - 2 >= 0) {
        let newBlock = new blockCoordinates(startBlock.x-2, startBlock.y)
        to_check.push(newBlock);
    }
    if (startBlock.x + 2 < mapSize) {
        let newBlock = new blockCoordinates(startBlock.x+2, startBlock.y)
        to_check.push(newBlock);
    }

    while (to_check.length > 0) {
        let index = Math.floor(Math.random() * to_check.length);
        let cell = new blockCoordinates(to_check[index].x, to_check[index].y);
        let x = cell.x;
        let y = cell.y;
        deleteWall(document.getElementById(x + " - " + y));
        to_check.splice(index, 1);

        let direction = ["directionNORTH", "directionSOUTH", "directionEAST", "directionWEST"];
        while (direction.length > 0) {
            let dir_index = Math.floor(Math.random() * direction.length);
            switch (direction[dir_index]) {
                case "directionNORTH":
                    if (y - 2 >= 0 && document.getElementById(x+" - "+(y - 2)).style.backgroundColor === "white") {
                        deleteWall(document.getElementById(x + " - " + (y - 1)));
                        return;
                    }
                    break;
                case "directionSOUTH":
                    if (y + 2 < mapSize && document.getElementById(x+" - " +(y+2)).style.backgroundColor === "white") {
                        deleteWall(document.getElementById(x + " - " + y + 1));
                        return;
                    }
                    break;
                case "directionEAST":
                    if (x - 2 >= 0 && document.getElementById((x - 2)+ " - "+y).style.backgroundColor === "white") {
                        deleteWall(document.getElementById((x - 1)+" - "+y));
                        return;
                    }
                    break;
                case "directionWEST":
                    if (x + 2 < mapSize && document.getElementById((x + 2)+ " - " + y).style.backgroundColor === "white") {
                        deleteWall(document.getElementById(x + 1 + " - " + y));
                        return;
                    }
                    break;
            }
            direction.splice(dir_index, 1);
        }
        if (y - 2 >= 0 && document.getElementById(x+" - "+(y - 2)).style.backgroundColor === "black") {
            let newBlock = new blockCoordinates(startBlock.x, startBlock.y - 2)
            to_check.push(newBlock);
        }
        if (y + 2 < mapSize && document.getElementById(x+" - "+(y + 2)).style.backgroundColor === "black") {
            let newBlock = new blockCoordinates(startBlock.x, startBlock.y + 2)
            to_check.push(newBlock);
        }
        if (x - 2 >= 0 && document.getElementById((x - 2)+" - "+ y).style.backgroundColor === "black") {
            let newBlock = new blockCoordinates(startBlock.x - 2, startBlock.y)
            to_check.push(newBlock);
        }
        if (x + 2 < mapSize && document.getElementById((x + 2)+" - "+y).style.backgroundColor === "black") {
            let newBlock = new blockCoordinates(startBlock.x + 2, startBlock.y)
            to_check.push(newBlock);
        }
    }
}


function findPath() {
    createMatrix();
}

function createMatrix() {
    delete matrix;
    matrix = new Array(mapSize);
    for (let i = 0; i < mapSize; i++) {
        matrix[i] = new Array(mapSize);
    }
    for (let i = 0; i < mapSize; i++)
    {
        for (let j = 0; j < mapSize; j++) {
            let currentBlock = document.getElementById(i+" - "+j).style.backgroundColor;
            switch (currentBlock) {
                case ("black"):
                    matrix[i][j] = -1;
                    break;
                case ("white"):
                    matrix[i][j] = 0;
                    break
                case ("green"):
                    matrix[i][j] = 0;
                    startBlock = new blockCoordinates(i, j);
                    break;
                case ("red"):
                    matrix[i][j] = 0;
                    endBlock = new blockCoordinates(i, j);
                    break;
            }
        }
    }
}
