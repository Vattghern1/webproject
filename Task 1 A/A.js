let index = 0;
let startBlock = 0;
let endBlock = 0;
let mapSize = 0;
let labSize = 0;
let openList = [];
let closeList = [];
let matrix = [];
let matrixLab = [];
let breakFlag = false;

class blockCoordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class oneBlock {
    constructor(value, F, G, H, parentX, parentY) {
        this.value = value;
        this.G = G;
        this.H = H;
        this.F = F;
        this.parentX = parentX;
        this.parentY = parentY;
    }
}

//Отчистка
function clearMap() {
    let temp;
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            temp = document.getElementById(i+" - "+j);
            if (temp.style.backgroundColor !== "black") {
                temp.style.backgroundColor = "white";
            }
        }
    }
    startBlock = document.getElementById(0+" - "+0);
    endBlock = document.getElementById((mapSize-1)+" - "+(mapSize-1));
}

//Создание карты
function createMap(){
    document.querySelector('tbody').innerHTML = '';
    mapSize = parseInt(document.getElementById('InputMapSize').value);
    if (mapSize < 5) {
        alert("Choose a larger size!")
        return 0;
    }
    if (mapSize > 80) {
        alert("Choose a smaller size!")
        return 0;
    }
    const table = document.querySelector('tbody');

    for (let i = 0; i < mapSize; i++) {
        let tr = document.createElement('tr');
        tr.classList.add("map-line");
        for (let j = 0; j < mapSize; j++) {
            let td = document.createElement('td');
            td.classList.add("map-block");
            if (i === 0 && j === 0) {
                startBlock = td;
                td.style.backgroundColor = "green";
            }
            if (i === mapSize-1 && j === mapSize-1) {
                endBlock = td;
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

//Работа кнопок
function chooseWallBeginEnd(valueSelectedButton) {
    const divButton = document.getElementById("selectButton");
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
    const divButton = document.getElementById("selectButton");
    let countSelectedButton = divButton.getAttribute("value");
    switch (countSelectedButton) {
        case "Begin":
            setBegin(block);
            break;
        case "End":
            setEnd(block);
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
    if (endBlock) {
        endBlock.style.backgroundColor = "white";
    }
    block.style.backgroundColor = "red";
    endBlock = block;
}

function setBegin(block) {
    if (startBlock) {
        startBlock.style.backgroundColor = "white";
    }
    block.style.backgroundColor = "green";
    startBlock = block;
}

//Создание матрицы
function createMatrix() {
    matrix = new Array(mapSize);
    for (let i = 0; i < mapSize; i++) {
        matrix[i] = new Array(mapSize);
        for (let j = 0; j < mapSize; j++) {
            matrix[i][j] = new oneBlock(0, 0, 0, 0, 0, 0);
        }
    }
}

function updateMatrix() {
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let tempColor = document.getElementById(i+" - "+j).style.backgroundColor;
            switch (tempColor) {
                case "black":
                    matrix[i][j].value = 1;
                    break;
                case "green":
                    startBlock = new blockCoordinates(i, j);
                    break;
                case "red":
                    endBlock = new blockCoordinates(i, j);
                    break;
                default:
                    matrix[i][j].value = 0;
                    break;

            }
        }
    }
}

//Создание лабиринта
const lastik = {
    x: 0,
    y: 0,
}

function createLabyrinth() {
    labSize = mapSize;
    if (labSize % 2 === 0) {
        labSize--;
    }
    for (let i = 0; i < labSize; i++) {
        for (let j = 0; j < labSize; j++) {
            setWall(document.getElementById(i + " - " + j));
            }
        }

    matrixLab = new Array(mapSize);
    for (let i = 0; i < mapSize; i++) {
        matrixLab[i] = new Array(mapSize);
    }
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            matrixLab[i][j] = false;
        }
    }
    matrixLab[0][0] = 0;
    while (!isValidMaze()) {
        lastikPath();
    }
    if (mapSize % 2 === 0) {
       finishLabyrinth2();
    }
    drawMaze();
}

function finishLabyrinth2() {
    for (let i = 1; i < mapSize - 1; i++) {
        if (matrixLab[i-1][mapSize-2] === false || matrixLab[i][mapSize-2] === false || matrixLab[i+1][mapSize-2] === false){
            matrixLab[i][mapSize-1] = true;
        }
        if (matrixLab[mapSize-2][i-1] === false || matrixLab[mapSize-2][i] === false || matrixLab[mapSize-2][i+1] === false){
            matrixLab[mapSize-1][i] = true;
        }
    }
    if (matrixLab[0][mapSize-2] === false || matrixLab[1][mapSize-2] === false)
    {
        matrixLab[0][mapSize-1] = true;
    }
    if (matrixLab[mapSize-2][0] === false || matrixLab[mapSize-2][1] === false)
    {
        matrixLab[mapSize-1][0] = true;
    }
    if (matrixLab[mapSize-1][mapSize-2] === true || matrixLab[mapSize-2][mapSize-1] === true)
    {
        matrixLab[mapSize-1][mapSize-1] = true;
    }
}

function lastikPath() {
    const directions = []
    if (lastik.x > 0) {
        directions.push([-2, 0]);
    }
    if (lastik.x < labSize - 1) {
        directions.push([2, 0]);
    }
    if (lastik.y > 0) {
        directions.push([0, -2]);
    }
    if (lastik.y < labSize - 1) {
        directions.push([0, 2]);
    }

    const [dx, dy] = getRandomItem(directions);
    lastik.x += +dx;
    lastik.y += +dy;

    if (!matrixLab[lastik.y][lastik.x]) {
        matrixLab[lastik.y][lastik.x] = true;
        matrixLab[lastik.y - dy / 2][lastik.x - dx / 2] = true;
    }
}

function isValidMaze() {
    for (let i = 0; i < labSize; i += 2) {
        for (let j = 0; j < labSize; j += 2) {
            if (!matrixLab[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function getRandomItem(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function drawMaze() {
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            if (matrixLab[i][j] === false) {
                setWall(document.getElementById(i + " - " + j));
            }
            else {
                deleteWall(document.getElementById(i + " - " + j));
            }
        }
    }
}

//Алгоритм А*
async function findPath() {
    updateMatrix();
    let temp;
    let tempX = endBlock.x;
    let tempY = endBlock.y;
    openList.push(startBlock);
    while (!breakFlag) {
        let minBlock = minBlockF();
        openList.splice(index, 1);
        closeList.push(minBlock);
        currentBlockNeighbours(minBlock);
        if (openList.length <= 0) {
            alert("No path")
            breakFlag = true;
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 15))
    }

    while (tempX !== startBlock.x || tempY !== startBlock.y) {
        tempX = matrix[tempX][tempY].parentX;
        tempY = matrix[tempX][tempY].parentY;
        temp = document.getElementById(tempX+" - "+tempY);
        if (temp !== startBlock) {
            temp.style.backgroundColor = "pink";
        }
        await new Promise(resolve => setTimeout(resolve, 15))
    }

    deleteFilesAStar();
}

function deleteFilesAStar () {
    index = 0;
    breakFlag = false;
    openList.length = 0;
    closeList.length = 0;
    matrixLab.length = 0;
}

function minBlockF() {
    let min = 100000;
    let temp = new blockCoordinates(0, 0);
    for (let i = 0; i < openList.length; i++) {
        if (matrix[openList[i].x][openList[i].y].F < min) {
            min = [openList[i].x][openList[i].y];
            index = i;
            temp = new blockCoordinates(openList[i].x, openList[i].y);
        }
    }
    return temp;
}

function distanceBetweenBlocks(firstBlock, secondBlock) {
    return Math.abs(firstBlock.x - secondBlock.x) + Math.abs(firstBlock.y - secondBlock.y);
}

function checkOpenedList(temp) {
    for (let i = 0; i < openList.length; i++) {
        if (temp.x === openList[i].x && temp.y === openList[i].y) {
            return true;
        }
    }
    return false;
}

function checkClosedList(temp) {
    for (let i = 0; i < closeList.length; i++) {
        if (temp.x === closeList[i].x && temp.y === closeList[i].y) {
            return true;
        }
    }
    return false;
}

function currentBlockNeighbours(current) {
    let x = current.x;
    let y = current.y;
    let temp = 0;

    if (y - 1 >= 0 && matrix[x][y - 1].value !== 1 && !checkClosedList(new blockCoordinates(x, y - 1))) {
        if (!checkOpenedList(new blockCoordinates(x, y - 1))) {
            openList.push(new blockCoordinates(x, y - 1));
            matrix[x][y - 1].parentX = x;
            matrix[x][y - 1].parentY = y;
            matrix[x][y - 1].H = distanceBetweenBlocks(new blockCoordinates(x, y - 1), startBlock);
            matrix[x][y - 1].G = 10 + matrix[x][y].G;
            matrix[x][y - 1].F = matrix[x][y - 1].H + matrix[x][y - 1].G;
            if (x === endBlock.x && y - 1 === endBlock.y) {
                breakFlag = true;
                return 0;
            }
            temp = document.getElementById(x+" - "+(y-1));
            temp.style.backgroundColor = "blue";
        }
        else if (matrix[x][y - 1].G > matrix[x][y].G) {
            matrix[x][y - 1].parentX = x;
            matrix[x][y - 1].parentY = y;
            matrix[x][y - 1].G = 10 + matrix[x][y].G;
            matrix[x][y - 1].F = matrix[x][y - 1].H + matrix[x][y - 1].G;
        }
    }
    if (y + 1 < mapSize && matrix[x][y + 1].value !== 1 && !checkClosedList(new blockCoordinates(x, y + 1))) {
        if (!checkOpenedList(new blockCoordinates(x, y + 1))) {
            openList.push(new blockCoordinates(x, y + 1));
            matrix[x][y + 1].parentX = x;
            matrix[x][y + 1].parentY = y;
            matrix[x][y + 1].H = distanceBetweenBlocks(new blockCoordinates(x, y + 1), endBlock);
            matrix[x][y + 1].G = 10 + matrix[x][y].G;
            matrix[x][y + 1].F = matrix[x][y + 1].H + matrix[x][y + 1].G;
            if (x === endBlock.x && y + 1 === endBlock.y) {
                breakFlag = true;
                return 0;
            }
            temp = document.getElementById(x+" - "+(y+1));
            temp.style.backgroundColor = "blue";
        }
        else if (matrix[x][y + 1].G > matrix[x][y].G) {
            matrix[x][y + 1].parentX = x;
            matrix[x][y + 1].parentY = y;
            matrix[x][y + 1].G = 10 + matrix[x][y].G;
            matrix[x][y + 1].F = matrix[x][y + 1].H + matrix[x][y + 1].G;
        }
    }
    if (x - 1 >= 0 && matrix[x - 1][y].value !== 1 && !checkClosedList(new blockCoordinates(x - 1, y))) {
        if (!checkOpenedList(new blockCoordinates(x - 1, y))) {
            openList.push(new blockCoordinates(x - 1, y));
            matrix[x - 1][y].parentX = x;
            matrix[x - 1][y].parentY = y;
            matrix[x - 1][y].H = distanceBetweenBlocks(new blockCoordinates(x - 1, y), endBlock);
            matrix[x - 1][y].G = 10 + matrix[x][y].G;
            matrix[x - 1][y].F = matrix[x - 1][y].H + matrix[x - 1][y].G;
            if (x - 1 === endBlock.x && y === endBlock.y) {
                breakFlag = true;
                return 0;
            }
            temp = document.getElementById(x-1+" - "+y);
            temp.style.backgroundColor = "blue";
        }
        else if (matrix[y][x - 1].G > matrix[y][x].G) {
            matrix[x - 1][y].parentX = x;
            matrix[x - 1][y].parentY = y;
            matrix[x - 1][y].G = 10 + matrix[x][y].G;
            matrix[x - 1][y].F = matrix[x - 1][y].H + matrix[x - 1][y].G;
        }
    }
    if (x + 1 < mapSize && matrix[x + 1][y].value !== 1 && !checkClosedList(new blockCoordinates(x + 1, y))) {
        if (!checkOpenedList(new blockCoordinates(x + 1, y))) {
            openList.push(new blockCoordinates(x + 1, y));
            matrix[x + 1][y].parentX = x;
            matrix[x + 1][y].parentY = y;
            matrix[x + 1][y].H = distanceBetweenBlocks(new blockCoordinates(x + 1, y), endBlock);
            matrix[x + 1][y].G = 10 + matrix[x][y].G;
            matrix[x + 1][y].F = matrix[x + 1][y].H + matrix[x + 1][y].G;
            if (x + 1 === endBlock.x && y === endBlock.y) {
                breakFlag = true;
                return 0;
            }
            temp = document.getElementById(x+1+" - "+y);
            temp.style.backgroundColor = "blue";
        }
        else if (matrix[x + 1][y].G > matrix[x][y].G) {
            matrix[x + 1][y].parentX = x;
            matrix[x + 1][y].parentY = y;
            matrix[x + 1][y].G = 10 + matrix[x][y].G;
            matrix[x + 1][y].F = matrix[x + 1][y].H + matrix[x + 1][y].G;
        }
    }
}