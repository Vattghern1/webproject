//Создание таблицы и работа с ней
let mapSize;
document.addEventListener("DOMContentLoaded", () => {
    mapSize = 5;
    createMap();
});

function createMap() {
    const table = document.getElementById('table-matrix');
    for (let i = 0; i < 5; i++) {
        let tr = document.createElement('tr');
        tr.classList.add("map-line");
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            td.classList.add("map-block");
            td.setAttribute("onclick", 'colorChangeCell(this)');
            td.setAttribute("id", j+" - "+i)
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function colorChangeCell(block) {
    switch (block.style.backgroundColor) {
        case ("black"):
            block.style.backgroundColor = "white";
            break;
        default:
            block.style.backgroundColor = "black";
    }
}
//Матрица
let matrix = [];
function createMatrix() {
    for (let i = 0; i < mapSize; i++) {
        matrix[i] = new Array(mapSize);
        for (let j = 0; j < mapSize; j++) {
            let tempColor = document.getElementById(j+" - "+i).style.backgroundColor;
            if (tempColor === "black") {
                matrix[i][j] = 1;
            }
            else {
                matrix[i][j] = 0;
            }
        }
    }
}


//Сеть




