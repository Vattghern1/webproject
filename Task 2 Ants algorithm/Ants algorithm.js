import {swap, qsort} from "./Quick-Sort";
document.addEventListener("DOMContentLoaded", start);

let number = 1;

function start(){
    var canvas = document.getElementById("fieldForPoints");
    var context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', function (e) {
        context.beginPath();
        context.arc(e.clientX - 710, e.clientY - 30, 10, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.strokeStyle = 'black'
        context.stroke();

        addPointsInArray(e.clientX - 710, e.clientY - 30);

        context.fillStyle = '#00F';
        context.strokeStyle = '#F00';
        context.font = '25px Verdana';
        context.fillText(number,e.clientX - 720 , e.clientY - 43);
        context.font = 'bold 10px sans-serif';
        number++;

    });
}

let coordinates = [];

function addPointsInArray(x, y){ //запоминаем координаты точек
    coordinates.push({x:x, y:y});
}

function makeDistanceMatrix(distancesMatrix){
    for (let i = 0; i < coordinates.length; i++){
        distancesMatrix[i] = new Array(coordinates.length);
    }

    for (let i = 0; i < coordinates.length; i++){
        for (let j = 0; j < coordinates.length; j++){
            distancesMatrix[i][j] = ((coordinates[i].x - coordinates[j].x) ** 2 + (coordinates[i].y - coordinates[j].y) ** 2) ** 0.5;
        }
    }
}

const alpha = 3; // задаем коэффициенты
const beta = 2;
const Q = 4;
const p = 0.4;
const maxTime = 25; // кол-во итераций

function getStartPheromones(pheromones){ //начальное значение феромонов
    for (let i = 0; i < coordinates.length; i++){
        pheromones[i] = new Array(coordinates.length);
    }

    for (let i = 0; i < coordinates.length; i++){
        for (let j = 0; j < coordinates.length; j++){
            pheromones[i][j] = 1.2;
        }
    }

    return pheromones;
}

function getProximity(distancesMatrix, proximity){ //значения "близости" между городами
    for (let i = 0; i < coordinates.length; i++){
        proximity[i] = new Array(coordinates.length);
    }

    for (let i = 0; i < coordinates.length; i++){
        for (let j = 0; j < coordinates.length; j++){
            if (i !== j){
                proximity[i][j] = 1 / distancesMatrix[i][j];
            }

            else {
                proximity[i][j] = 0;
            }
        }
    }

    return proximity;
}

function isVisited(cityNumber, visited){ //проверяем, был ли посещен этот город
    for (let i = 0; i < visited.length; i++){
        if (visited[i] === cityNumber){
            return true;
        }
    }

    return false;
}

function chooseNextCity(i, visited, pheromones, proximity){ //муравей из города i выбирает следующий город
    if (visited.length === coordinates.length - 1){
        for (let k = 1; k <= coordinates.length; k++){
            if (isVisited(k, visited) === false){
                return k;
            }
        }
    }

    let probabilityArray = [];

    let sumWishes = 0;

    for (let k = 1; k <= coordinates.length; k++){
        if ((k !== i) && ((isVisited(k, visited)) === false)){
            sumWishes += Math.pow(pheromones[i - 1][k - 1], alpha) * Math.pow(proximity[i - 1][k - 1], beta);
        }
    }

    for (let j = 1; j <= coordinates.length; j++){
        if ((j !== i) && ((isVisited(j, visited)) === false)) {
            let wish = Math.pow(pheromones[i - 1][j - 1], alpha) * Math.pow(proximity[i - 1][j - 1], beta);
            let probabilityValue = wish / sumWishes;

            probabilityArray.push({probability: probabilityValue, numberOfCity: j});
        }
    }

    qsort(probabilityArray);

    let temp = 1;
    let randomNumber = Math.random();
    let nextCity = probabilityArray[probabilityArray.length - 1];
    let index = probabilityArray.length - 1;

    while (temp >= randomNumber){
        temp -= probabilityArray[index].probability;
        nextCity = probabilityArray[index].numberOfCity;
        index--;
    }

    return nextCity;
}

function deltaPheromone(i, j, pathLenght){ // добавка феромона одним муравьем между городами i и j
    return Q / pathLenght;
}

function newPheromone(i, j, sumDeltaPheromone, pheromones){ // обновление феромона между городом i и j на новой итерации по времени жизни колонии
    pheromones[i - 1][j - 1] = (1 - p) * pheromones[i - 1][j - 1] + sumDeltaPheromone;
}

function antsAlgorithm(){
    let distancesMatrix = new Array(coordinates.length);
    makeDistanceMatrix(distancesMatrix);

    let pheromones = new Array(coordinates.length);
    getStartPheromones(pheromones);

    let proximity = new Array(coordinates.length);
    getProximity(distancesMatrix, proximity);

    let antsCount = coordinates.length; // кол-во муравьев берем равным кол-ву городов
    let currentShortestPath = [];
    let currentMinLenght = 10000;

    let sumDeltaPheromone = [];

    for (let i = 0; i < antsCount; i++){
        sumDeltaPheromone[i] = [];
    }

    for (let t = 1; t <= maxTime; t++){ //цикл по кол-ву итераций
        for (let i = 0; i < antsCount; i++){ //создаем матрицу для суммы добавок феромона после каждой итерации и заполняем нулями
            for (let j = 0; j < antsCount; j++){
                sumDeltaPheromone[i][j] = 0;
            }
        }

        for (let k = 1; k <= antsCount; k++){ //запускаем всех муравьев в разные города
            let visited = [];
            let startCityNumber = k;
            let currentCity = startCityNumber;
            let currentLenght = 0;

            visited.push(startCityNumber);

            for (let i = 1; i <= antsCount - 1; i++){
                let nextCity = chooseNextCity(currentCity, visited, pheromones, proximity);
                visited.push(nextCity);
                currentLenght += distancesMatrix[currentCity - 1][nextCity - 1];
                currentCity = nextCity;
                sumDeltaPheromone[visited[i - 1] - 1][visited[i] - 1] += deltaPheromone(visited[i - 1], visited[i], currentLenght);
            }

            visited.push(startCityNumber);
            currentLenght += distancesMatrix[currentCity - 1][startCityNumber - 1];

            if (currentLenght < currentMinLenght){
                currentMinLenght = currentLenght;
                currentShortestPath = visited;
                console.log(t);
            }

        }

        for (let i = 0; i < antsCount; i++){ //обновление феромона
            for (let j = 0; j < antsCount; j++){
                newPheromone(i + 1, j + 1, sumDeltaPheromone[i][j], pheromones);
            }

        }

    }

    return currentShortestPath;

}

function drawLines(){ //соединяем города из пути коммивояжера линиями
    var canvas = document.getElementById("fieldForPoints");
    var context = canvas.getContext('2d');

    let path = antsAlgorithm();

    for (let i = 0; i <= path.length - 2; i++){
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.moveTo(coordinates[path[i] - 1].x, coordinates[path[i] - 1].y);
        context.lineTo(coordinates[path[i + 1] - 1].x, coordinates[path[i + 1] - 1].y);
        context.stroke();
    }
}

function clearing(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    coordinates = [];
    number = 1;
}







