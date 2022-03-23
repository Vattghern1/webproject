// canvas settings:
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var widthConst = (window.innerWidth / 100);
var heightConst = (window.innerHeight / 100);
canvas.width = widthConst * 70;
canvas.height = heightConst * 70;

//func to show clusters count:
function setClustersCount() {
    let counterClusters = document.getElementById("counterClusters").value;
    let windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = counterClusters;
}

// vars for array of coords:
var coords = {
    x : [],
    y : []
}

var counterPoints = 0;

// to paint points:
canvas.addEventListener('mousedown', function (e) {
    ctx.beginPath();
    let tempCoordX = e.clientX-280;
    let tempCoordY = e.clientY-30;
    counterPoints++;
    ctx.arc(tempCoordX, tempCoordY, 10, 0, Math.PI * 2);
    ctx.fill();
    coords.x.push(tempCoordX);
    coords.y.push(tempCoordY);
});

//func to clustering:
function alertFunc() {
    let counterClusters = document.getElementById("counterClusters").value;
    if (counterClusters > counterPoints) {
        alert("Кластеров не может быть большем, чем точек. Измените количество!");
    }
    else {
        bestClustering();
    }
}

//func to clear the canvas and array:
function clearing() {
    let counterClusters = document.getElementById("counterClusters");
    let windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = "1";
    counterClusters.value = 1;
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coords.x = [];
    coords.y = [];
    counterPoints = 0;
}

function generateColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function drawColors(counterClusters, clusteringGroups, centralPoints) {
    for (let i = 0; i < counterClusters; i++) {
        ctx.fillStyle = generateColor();
        for (let j = 0; j < clusteringGroups[i].length; j++) {
            ctx.beginPath();
            ctx.arc(coords.x[clusteringGroups[i][j]], coords.y[clusteringGroups[i][j]], 10, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.fillRect(centralPoints.x[i]-10, centralPoints.y[i]-10, 20, 20);
    }
    ctx.fillStyle = 'black';
}

function distances(counterClusters, clusteringGroups, centralPoints) {
    clusteringGroups = [];
    for(let i = 0; i < counterClusters; i++) {
        clusteringGroups[i] = [];
    }
    for(let i = 0; i < counterPoints; i++) {
        let minLength = Infinity;
        let minClusterNum;
        for(var j = 0; j < counterClusters; j++) {
            var tempLength = Math.sqrt(Math.pow((centralPoints.x[j]-coords.x[i]),2) + Math.pow((centralPoints.y[j]-coords.y[i]),2));
            if (tempLength < minLength) {
                minLength = tempLength;
                minClusterNum = j;
            }
        }
        clusteringGroups[minClusterNum].push(i);
    }
    return clusteringGroups;
}


function newClusters(counterClusters, clusteringGroups, centralPoints) {
    for(let i = 0; i < counterClusters; i++) {
        let tempX = 0;
        let tempY = 0;
        let counter = 0;
        for(let j = 0; j < clusteringGroups[i].length; j++) {
            tempX += coords.x[clusteringGroups[i][j]];
            tempY += coords.y[clusteringGroups[i][j]];
            counter++
        }
        if (counter !== 0) {
            tempX = tempX / counter;
            tempY = tempY / counter;
            centralPoints.x[i] = tempX;
            centralPoints.y[i] = tempY;
        }
    }
    return centralPoints;
}

function copy(secObj, counterClusters) {
    let firstObj = {
        x : [],
        y : []
    }
    for (let i = 0; i < counterClusters; i++) {
        firstObj.x[i] = secObj.x[i];
        firstObj.y[i] = secObj.y[i];
    }
    return firstObj;
}

function isEqual(firstObj, secObj, counter) {
    for(let i = 0; i < counter; i++) {
        if ((firstObj.x[i] != secObj.x[i]) || (firstObj.y[i] != secObj.y[i])) {
            return false;
        }
    }
    return true;
}

function clustering() {
    let counterClusters = document.getElementById("counterClusters").value;
    let centralPoints = {
        x : [],
        y : []
    }
    let clusteringGroups = [];

    for(let i = 0; i < counterClusters; i++) {
        clusteringGroups[i] = [];
        centralPoints.x[i] = Math.floor(Math.random()*canvas.width);
        centralPoints.y[i] = Math.floor(Math.random()*canvas.height);
    }

    clusteringGroups = distances(counterClusters, clusteringGroups, centralPoints);

    let previousCentralPoints = copy(centralPoints, counterClusters);
    let iterations = 0;

    while (true) {
        iterations++;

        centralPoints = newClusters(counterClusters, clusteringGroups, centralPoints);
        clusteringGroups = distances(counterClusters, clusteringGroups, centralPoints);
        if (isEqual(previousCentralPoints, centralPoints, counterClusters)) {
            break;
        } else {
            previousCentralPoints = copy(centralPoints, counterClusters);
        }
    }
    return {
        centralPoints : centralPoints,
        clusteringGroups : clusteringGroups,
        counterClusters : counterClusters
    }
}

function bestClustering () {
    let minDistance = Infinity;
    let bestClusters;
    for(let i = 0; i < 100; i++) {
        let tempDistance = 0;
        let resultClustering = clustering();
        for(let j = 0; j < resultClustering.counterClusters; j++) {
            for(let k = 0; k < resultClustering.clusteringGroups[j].length; k++) {
                tempDistance += Math.sqrt(Math.pow((resultClustering.centralPoints.x[j] - coords.x[resultClustering.clusteringGroups[j][k]]), 2) +
                    Math.pow((resultClustering.centralPoints.y[j] - coords.y[resultClustering.clusteringGroups[j][k]]), 2));
            }
        }
        if (tempDistance < minDistance) {
            minDistance = tempDistance;
            bestClusters = resultClustering;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawColors(bestClusters.counterClusters, bestClusters.clusteringGroups, bestClusters.centralPoints);
}
