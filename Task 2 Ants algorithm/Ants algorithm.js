coordinates = [];

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

const alpha = 1; // задаем коэффициенты
const beta = 1;
const Q = 4;
const p = 0.4;
const maxTime = 1000; // кол-во итераций

function getStartPheromones(pheromones){ //начальное значение феромонов
    for (let i = 0; i < coordinates.length; i++){
        pheromones[i] = new Array(coordinates.length);
    }

    for (let i = 0; i < coordinates.length; i++){
        for (let j = 0; j < coordinates.length; j++){
            pheromones[i][j] = 0.2;
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

function getWish(i, j, pheromones, proximity){ //желание перехода из вершины i в вершину j
    return (pheromones[i - 1][j - 1] ** alpha) * (proximity[i - 1][j - 1] ** beta);
}

function sumWishes(i, pheromones, proximity) { //вычисление суммы желаний попасть во все доступные вершины из i (для расчета вероятности)
    let sum = 0;

    for (let j = 0; j < coordinates.length; j++){
        if (j !== i){
            sum += getWish(i, j, pheromones, proximity);
        }
    }

    return sum;
}

function getProbability(i, j, pheromones, proximity){ //расчет вероятности перехода из вершины i в j
    return (getWish(i, j, pheromones, proximity) / sumWishes(i, pheromones, proximity));
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
    let probabilityArray = {
        probability : [],
        numberOfCity : []
    }

    for (let j = 1; j <= coordinates.length; j++){
        if ((j !== i) && ((isVisited(j, visited)) === false)) {
            probabilityArray.probability.push(getProbability(i, j, pheromones, proximity));
            probabilityArray.numberOfCity.push(j);
        }
    }

    probabilityArray.probability.sort(function(a,b){
        return a - b
    })

    let sum = 0;
    let randomNumber = Math.random();
    let nextCity = probabilityArray.numberOfCity[0];
    let index = 0;

    while (sum < randomNumber){
        sum += probabilityArray.probability[index];
        nextCity = probabilityArray.numberOfCity[index];
        index++;
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


    for (let t = 1; t <= maxTime; t++){ //цикл по кол-ву итераций
        let allAntsPaths  = {
            path : [],
            pathLength : []
        }

        //for (let i = 0; i < antsCount; i++){
            //allAntsPaths[i].path = [];
        //}

        let sumDeltaPheromone = [];

        for (let i = 0; i < antsCount; i++){
            sumDeltaPheromone[i] = [];
        }

        for (let i = 0; i < antsCount; i++){ //создаем матрицу для суммы добавок феромона после каждой итерации и заполняем нулями
            for (let j = 0; j < antsCount; j++){
                sumDeltaPheromone[i][j] = 0;
            }
        }

        for (let k = 1; k <= antsCount; k++){ //запускаем всех муравьев в разные города
            let visited = [];
            let startCityNumber = k;
            let currentLenght = 0;

            visited.push(startCityNumber);

            for (let i = 0; i <= antsCount - 2; i++){
                var nextCity = chooseNextCity(visited[i], visited, pheromones, proximity);
                visited.push(nextCity);
                currentLenght += distancesMatrix[visited[i] - 1][nextCity - 1];
            }

            visited.push(startCityNumber);

            currentLenght += distancesMatrix[nextCity - 1][startCityNumber - 1];

            //for (let i = 0; i < antsCount; i++){
                //allAntsPaths.path[i] = [];
            //}

            allAntsPaths.path.push(visited);
            allAntsPaths.pathLength.push(currentLenght);

            for (let i = 0; i <= antsCount - 2; i++){ //добавка феромона
                sumDeltaPheromone[visited[i] - 1][visited[i + 1] - 1] += deltaPheromone(visited[i], visited[i + 1], currentLenght);
            }

        }

        for (let i = 0; i < antsCount; i++){ //находим текущий кратчайший путь и его длину
            if (allAntsPaths.pathLength[i] < currentMinLenght){
                currentShortestPath = allAntsPaths.path[i];
                currentMinLenght = allAntsPaths.pathLength[i];
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






