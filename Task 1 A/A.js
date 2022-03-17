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
            td.setAttribute("id", i+" - "+j)
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
            let allBlocks = document.getElementById(i+" - "+j).style.backgroundColor;
            switch (allBlocks) {
                case "green":
                    break;
                case "red":
                    break;
                default:
                    setWall(document.getElementById(i+" - "+j));
            }
        }
    }

    matrixLab = new Array(mapSize);
    for (let i = 0; i < mapSize; i++) {
        matrixLab[i] = new Array(mapSize);
    }
    for (let i = 0; i < mapSize; i++)
    {
        for (let j = 0; j < mapSize; j++) {
            matrixLab[i][j] = false;
        }
    }
    matrixLab[startBlock.x][startBlock.y] = true;
    matrixLab[endBlock.x][endBlock.y] = true;

    listOfWall = [];
    addWallsToListOfWall(startBlock);

    while (listOfWall.length !== 0) {
        let randomIndex = Math.floor(Math.random() * listOfWall.length);
        let randomWall = listOfWall[randomIndex];
        checkerOfWall(randomWall);
        listOfWall.splice(randomIndex, 1);
    }
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function checkerOfWall(randomWall) {
    let directions = [0, 1, 2, 3];
    while (directions.length) {
        let randomDirections = randomIntFromInterval(0, directions.length - 1);
        let currentDirect = directions.splice(randomDirections, 1)[0];
        switch (currentDirect) {
            case 0:
                if (matrixLab[randomWall.x - 1] && matrixLab[randomWall.x + 1] && matrixLab[randomWall.x - 1][randomWall.y] === true && matrixLab[randomWall.x + 1][randomWall.y] === false) {
                    deleteWall(document.getElementById(randomWall.x + " - " + randomWall.y));
                    matrixLab[randomWall.x + 1][randomWall.y] = true;
                    searchForWalls(randomWall.x, randomWall.y);
                    return;
                }
                break;
            case 1:
                if (matrixLab[randomWall.x - 1] && matrixLab[randomWall.x + 1] && matrixLab[randomWall.x - 1][randomWall.y] === false && matrixLab[randomWall.x + 1][randomWall.y] === true) {
                    deleteWall(document.getElementById(randomWall.x + " - " + randomWall.y));
                    matrixLab[randomWall.x - 1][randomWall.y] = true;
                    searchForWalls(randomWall.x, randomWall.y);
                    return;
                }
                break;
            case 2:
                if (matrixLab[randomWall.x][randomWall.y - 1] === true && matrixLab[randomWall.x][randomWall.y + 1] === false) {
                    deleteWall(document.getElementById(randomWall.x + " - " + randomWall.y));
                    matrixLab[randomWall.x][randomWall.y + 1] = true;
                    searchForWalls(randomWall.x, randomWall.y);
                    return;
                }
                break;
            case 3:
                if (matrixLab[randomWall.x][randomWall.y - 1] === false && matrixLab[randomWall.x][randomWall.y + 1] === true) {
                    deleteWall(document.getElementById(randomWall.x + " - " + randomWall.y));
                    matrixLab[randomWall.x][randomWall.y - 1] = true;
                    searchForWalls(randomWall.x, randomWall.y);
                    return;
                }
                break;
        }
    }
}

function searchForWalls(mainWallX, mainWallY){
    if (matrixLab[mainWallX-1] && matrixLab[mainWallX-1][mainWallY]  === false){
        let nextWall = new blockCoordinates(mainWallX-1, mainWallY);
        listOfWall.push(nextWall);
    }
    if (matrixLab[mainWallX+1] && matrixLab[mainWallX+1][mainWallY]  === false){
        let nextWall = new blockCoordinates(mainWallX+1, mainWallY);
        listOfWall.push(nextWall);
    }
    if (matrixLab[mainWallX][mainWallY-1]  === false){
        let nextWall = new blockCoordinates(mainWallX, mainWallY-1);
        listOfWall.push(nextWall);
    }
    if (matrixLab[mainWallX][mainWallY+1] === false){
        let nextWall = new blockCoordinates(mainWallX, mainWallY+1);
        listOfWall.push(nextWall);
    }


}

function addWallsToListOfWall(currentBlock) {
    if (matrixLab[currentBlock.x - 1] && currentBlock.x > 0) {
        matrixLab[currentBlock.x - 1][currentBlock.y] = true;
        let newWall = new blockCoordinates(currentBlock.x - 1, currentBlock.y);
        listOfWall.push(newWall);
    }
    if (matrixLab[currentBlock.x + 1] && currentBlock.x < mapSize - 1) {
        matrixLab[currentBlock.x + 1][currentBlock.y] = true;
        let newWall = new blockCoordinates(currentBlock.x + 1, currentBlock.y);
        listOfWall.push(newWall);
    }
    if (currentBlock.y > 0) {
        matrixLab[currentBlock.x][currentBlock.y - 1] = true;
        let newWall = new blockCoordinates(currentBlock.x, currentBlock.y - 1);
        listOfWall.push(newWall);
    }
    if (currentBlock.y < mapSize - 1) {
        matrixLab[currentBlock.x][currentBlock.y + 1] = true;
        let newWall = new blockCoordinates(currentBlock.x, currentBlock.y + 1);
        listOfWall.push(newWall);
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
