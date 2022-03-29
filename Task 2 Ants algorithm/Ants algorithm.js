coordinates = [];

function addPointsInArray(x, y){ //запоминаем координаты точек
    coordinates.push({x:x, y:y});
}

distancesMatrix = [];

for (let i = 0; i < coordinates.length; i++){
    distancesMatrix[i] = [];
}

function makeDistanceMatrix(){
    for (let i = 0; i <= coordinates.length - 1; i++){
        for (let k = i; k <= coordinates.length - 1; k++){
            distancesMatrix[i][k] = ((coordinates[i].x - coordinates[k].x) ** 2 + (coordinates[i].y - coordinates[k].y) ** 2) ** 0.5;
        }
    }
}

const alpha = 1; // задаем коэффициенты
const beta = 1;
const Q = 4;
const p = 0.4;
const maxTime = 1000; // кол-во итераций

antsCount = coordinates.length; // кол-во муравьев берем равным кол-ву городов

pheromones = [];

for (let i = 0; i < coordinates.length; i++){
    pheromones[i] = [];
}

function getStartPheromones(){ //начальное значение феромонов
    for (let i = 0; i <= antsCount - 1; i++){
        for (let j = 0; j <= antsCount - 1; j++){
            pheromones[i][j] = 0.2;
        }
    }
}

proximity = [];

for (let i = 0; i < coordinates.length; i++){
    proximity[i] = [];
}

function getProximity(){ //значения "близости" между городами
    for (let i = 0; i <= antsCount - 1; i++){
        for (let j = 0; j <= antsCount - 1; j++){
            if (i != j){
            proximity[i][j] = 1 / distancesMatrix[i][j];
            }
        }
    }
}

function getWish(i, j){ //желание перехода из вершины i в вершину j
    return (pheromones[i][j] ** alpha) * (proximity[i][j] ** beta);
}

function sumWishes(i) { //вычисление суммы желаний попасть во все доступные вершины из i (для расчета вероятности)
    let sum = 0;

    for (let j = 0; j < antsCount; j++){
        if (j != i){
            sum += getWish(i, j);
        }
    }

    return sum;
}

function getProbability(i, j){ //расчет вероятности перехода из вершины i в j
    return (getWish(i, j) / sumWishes(i));
}

function isVisited(cityNumber, visited){ //проверяем, был ли посещен этот город
    for (let i = 0; i < visited.length; i++){
        if (visited[i] == cityNumber){
            return true;
        }
    }

    return false;
}

function chooseNextCity(i, visited){ //муравей из города i выбирает следующий город
    let probabilityArray = {
        probability : [],
        numberOfCity : []
    }

    for (let j = 0; j < antsCount; j++){
        if ((j != i) && ((isVisited(j, visited)) == false)) {
            probabilityArray.probability.push(getProbability(i, j));
            probabilityArray.numberOfCity.push(j);
        }
    }

    probabilityArray.probability.sort(function(a,b){
        return a - b
    })

    let sum = 0;
    let randomNumber = Math.random();
    let nextCity = probabilityArray[0].numberOfCity;
    let index = 0;

    while (sum < randomNumber){
        sum += probabilityArray[index].probability;
        nextCity = probabilityArray[index].numberOfCity;
        index++;
    }

    return nextCity;
}

function deltaPheromone(i, j, pathLenght){ // добавка феромона одним муравьем между городами i и j
    return Q / pathLenght;
}

function newPheromone(i, j, sumDeltaPheromone){ // обновление феромона между городом i и j на новой итерации по времени жизни колонии
    pheromones[i][j] = (1 - p) * pheromones[i][j] + sumDeltaPheromone;
}

function antsAlgorithm(){
    makeDistanceMatrix();
    getStartPheromones();
    getProximity();

    let currentShortestPath = [];
    let currentMinLenght = 0;

    for (let t = 1; t <= maxTime; t++){ //цикл по кол-ву итераций
        let allAntsPaths  = {
            path : [],
            pathLength : []
        }

        for (let i = 0; i < antsCount; i++){
            allAntsPaths[i].path = [];
        }

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
                var nextCity = chooseNextCity(visited[i], visited);
                visited.push(nextCity);
                currentLenght += distancesMatrix[visited[i] - 1][nextCity - 1];
            }

            visited.push(startCityNumber);

            currentLenght += distancesMatrix[nextCity - 1][startCityNumber - 1];

            allAntsPaths.path.push(visited);
            allAntsPaths.pathLength.push(currentLenght);

            for (let i = 0; i <= antsCount - 2; i++){ //добавка феромона
                sumDeltaPheromone[visited[i] - 1][visited[i + 1] - 1] += deltaPheromone(visited[i], visited[i + 1], currentLenght);
            }

        }

        for (let i = 0; i < antsCount; i++){ //находим текущий кратчайший путь и его длину
            if (allAntsPaths[i].pathLength < currentMinLenght){
                currentShortestPath = allAntsPaths[i].path;
                currentMinLenght = allAntsPaths[i].pathLength;
            }
        }

        for (let i = 0; i < antsCount; i++){ //обновление феромона
            for (let j = 0; j < antsCount; j++){
                newPheromone(i + 1, j + 1, sumDeltaPheromone[i][j]);
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

function test(){
    var canvas = document.getElementById("fieldForPoints");
    var context = canvas.getContext('2d');

    for (let i = 0; i <= coordinates.length - 2; i++){
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = 'black';
        context.moveTo(coordinates[i].x, coordinates[i].y);
        context.lineTo(coordinates[i + 1].x, coordinates[i + 1].y);
        context.stroke();
    }


}




