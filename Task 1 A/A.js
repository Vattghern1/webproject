let index = 0;
let startBlock = 0;
let endBlock = 0;
let mapSize = 0;
let labSize = 0;
let counterOfNeighbours = 0;
let openList = [];
let closeList = [];
let matrix = [];
let matrixLab = [];
let arrayOfNeighbours = [];
let breakFlag = false;

class blockCoordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class oneBlock {
    constructor(value, F, G, H, parent) {
        this.value = value;
        this.G = G;
        this.H = H;
        this.F = F;
        this.parent = parent;
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
    deleteFilesAStar();
}

//Создание таблицы на старте страницы
document.addEventListener("DOMContentLoaded", () => {
    mapSize = 10;
    createMap();
});

//Получение размера карты
function getMapSize() {
    mapSize = parseInt(document.getElementById('InputMapSize').value);
    if (mapSize < 5) {
        alert("Choose a larger size!")
        return 0;
    }
    if (mapSize > 80) {
        alert("Choose a smaller size!")
        return 0;
    }
    if (isNaN(mapSize) || undefined) {
        alert("Put a number!")
        return 0;
    }
    createMap();
}
//Создание карты
function createMap(){
    document.querySelector('tbody').innerHTML = '';
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
            td.setAttribute("onclick", 'checkerButtons(this)');
            td.setAttribute("id", j+" - "+i)
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    createMatrix();
}

//Работа кнопок
function chooseWallBeginEnd(valueSelectedButton) {
    const divButtons = document.getElementById("buttons");
    switch (valueSelectedButton) {
        case "Begin":
            divButtons.setAttribute("value", "Begin");
            break;
        case "End":
            divButtons.setAttribute("value", "End");
            break;
        case "Wall":
            divButtons.setAttribute("value", "Wall");
            break;
        case "deleteWall":
            divButtons.setAttribute("value", "deleteWall");
            break;
    }
}

function checkerButtons(block) {
    const divButtons = document.getElementById("buttons");
    let valueButtons = divButtons.getAttribute("value");
    switch (valueButtons) {
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
    endBlock.style.backgroundColor = "white";
    block.style.backgroundColor = "red";
    endBlock = block;
}

function setBegin(block) {
    startBlock.style.backgroundColor = "white";
    block.style.backgroundColor = "green";
    startBlock = block;
}

//Создание матрицы
function createMatrix() {
    for (let i = 0; i < mapSize; i++) {
        matrix[i] = new Array(mapSize);
        for (let j = 0; j < mapSize; j++) {
            matrix[i][j] = new oneBlock(0, 0, 0, 0, 0, 0);
        }
    }
}

function updateMatrix() {
    matrix.length = 0;
    matrix = new Array(mapSize);
    createMatrix();
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let tempColor = document.getElementById(i+" - "+j).style.backgroundColor;
            switch (tempColor) {
                case "black":
                    matrix[i][j].value = 1;
                    break;
                case "green":
                    startBlock = new blockCoordinates(i, j);
                    matrix[i][j].value = 0;
                    break;
                case "red":
                    endBlock = new blockCoordinates(i, j);
                    matrix[i][j].value = 0;
                    break;
                case "white":
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
    clearMap();
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

    await drawPath();
    deleteFilesAStar();
}

async function drawPath() {
    let temp = new blockCoordinates(endBlock.x, endBlock.y);
    let checkDraw = 0;
    while (temp !== startBlock) {
        temp = matrix[temp.x][temp.y].parent;
        checkDraw = document.getElementById((temp.x)+" - "+(temp.y));
        if (checkDraw.style.backgroundColor !== "green") {
            checkDraw.style.backgroundColor = "pink";
        }
        await new Promise(resolve => setTimeout(resolve, 15))
    }

    deleteFilesAStar();
}

function deleteFilesAStar () {
    index = 0;
    breakFlag = false;
    counterOfNeighbours = 0;
    openList.length = 0;
    closeList.length = 0;
    arrayOfNeighbours.length = 0;
    matrix.length = 0;
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

function createArrayOfNeighbours(current) {
    let x = current.x;
    let y = current.y;
    if (x - 1 >= 0 && matrix[x - 1][y].value !== 1 && !checkClosedList(new blockCoordinates(x - 1, y))) {
        arrayOfNeighbours.push(new blockCoordinates(x - 1, y));
        counterOfNeighbours++;
    }
    if (x + 1 < mapSize && matrix[x + 1][y].value !== 1 && !checkClosedList(new blockCoordinates(x + 1, y))) {
        arrayOfNeighbours.push(new blockCoordinates(x + 1, y));
        counterOfNeighbours++;
    }
    if (y - 1 >= 0 && matrix[x][y - 1].value !== 1 && !checkClosedList(new blockCoordinates(x, y - 1))) {
        arrayOfNeighbours.push(new blockCoordinates(x, y - 1));
        counterOfNeighbours++;
    }
    if (y + 1 < mapSize && matrix[x][y + 1].value !== 1 && !checkClosedList(new blockCoordinates(x, y + 1))) {
        arrayOfNeighbours.push(new blockCoordinates(x, y + 1));
        counterOfNeighbours++;
    }
    return arrayOfNeighbours;
}

function currentBlockNeighbours(current) {
    let temp;
    arrayOfNeighbours = createArrayOfNeighbours(current);

    for (let i = 0; i < counterOfNeighbours; i++) {
        let neighbour = arrayOfNeighbours[i];
        matrix[neighbour.x][neighbour.y].parent = current;
        matrix[neighbour.x][neighbour.y].G = 10 + matrix[current.x][current.y].G;
        matrix[neighbour.x][neighbour.y].F = matrix[neighbour.x][neighbour.y].H + matrix[neighbour.x][neighbour.y].G;
        if (!checkOpenedList(neighbour)) {
            openList.push(neighbour);
            matrix[neighbour.x][neighbour.y].H = distanceBetweenBlocks(neighbour, startBlock);
            if (neighbour.x === endBlock.x && neighbour.y === endBlock.y) {
                breakFlag = true;
                return 0;
            }
            temp = document.getElementById(neighbour.x + " - " + neighbour.y);
            temp.style.backgroundColor = "blue";
        }
    }

    arrayOfNeighbours.length = 0;
    counterOfNeighbours = 0;
}