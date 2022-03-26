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

antsCount = coordinates.length; //кол-во муравьев берем равным кол-ву городов

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
    var sum = 0;

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

function chooseNextCity(i){ //муравей из города i выбирает следующий город
    let probabilityArray = {
        probability : [],
        numberOfCity : []
    }

    for (let j = 0; j < antsCount; j++){
        if (j != i) {
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

function deltaPheromone(i, j, currentPath){ // добавка феромона одним муравьем между городами i и j
    return Q / currentPath;
}

function newPheromone(i, j, sumDeltaPheromone){ // обновление феромона между городом i и j на новой итерации по времени жизни колонии
    pheromones[i][j] = (1 - p) * pheromones[i][j] + sumDeltaPheromone;
}


