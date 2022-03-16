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
            if (i === 1 && j === 1) {
                lastEnd = td;
                td.style.backgroundColor = "red";
            }
            td.setAttribute("onclick", "checkerButtons(this)");
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
    let countBlockOfLab = Math.floor(mapSize*mapSize*0.4);
    for (let i = 0; i < countBlockOfLab; i++) {
        let x = Math.floor(Math.random() * (mapSize));
        let y = Math.floor(Math.random() * (mapSize));
        let randomBlock = document.getElementById(x+" - "+y).style.backgroundColor;
        switch (randomBlock) {
            case "green":
                break;
            case "red":
                break;
            default:
                setWall(document.getElementById(x+" - "+y));
        }
    }
}

function findPath() {
    createMatrix(mapSize);

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
                    startBlock = matrix[i][j];
                    break;
                case ("red"):
                    matrix[i][j] = 0;
                    endBlock = matrix[i][j];
                    break;
            }
        }
    }
}
