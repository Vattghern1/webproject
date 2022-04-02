//canvas settings:
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var widthConst = (window.innerWidth / 100);
var heightConst = (window.innerHeight / 100);
canvas.width = widthConst * 70;
canvas.height = heightConst * 70;

//function to show clusters count:
function setClustersCount() {
    let counterClusters = document.getElementById("counterClusters").value;
    let windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = counterClusters;
}

ctx.strokeStyle = "#404040";
ctx.lineWidth = 4;
ctx.fillStyle = "white";

//vars for array of coords:
var coords = {
    x : [],
    y : []
}

var counterPoints = 0;

function drawArc(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function random(maxVal) {
    return Math.floor(Math.random()*maxVal);
}

//to paint points:
canvas.addEventListener('mousedown', function (e) {
    let tempCoordX = e.clientX-290;
    let tempCoordY = e.clientY-30;
    counterPoints++;
    drawArc(tempCoordX, tempCoordY);
    coords.x.push(tempCoordX);
    coords.y.push(tempCoordY);
});

//function to generate random points:
function randomPoints() {
    clearing();
    let randomPointsCount = random(500);
    counterPoints = randomPointsCount;
    for(let i = 0; i < randomPointsCount; i++) {
        let randX = random(canvas.width);
        let randY = random(canvas.height);
        drawArc(randX, randY);
        coords.x.push(randX);
        coords.y.push(randY);
    }
}

//function to check count of clusters and count of points:
function alertFunc() {
    let counterClusters = document.getElementById("counterClusters").value;
    if (counterClusters > counterPoints) {
        alert("Кластеров не может быть большем, чем точек. Измените количество!");
    }
    else {
        bestClustering();
    }
}

//function to clear the canvas and arrays:
function clearing() {
    let counterClusters = document.getElementById("counterClusters");
    let windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = "1";
    counterClusters.value = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coords.x = [];
    coords.y = [];
    counterPoints = 0;
}

function generateColor() {
    return '#' + random(16777215).toString(16);
}

//the last function to draw clusters:
function coloringClusters(counterClusters, clusteringGroups, centralPoints) {
    for (let i = 0; i < counterClusters; i++) {
        ctx.fillStyle = generateColor();
        ctx.beginPath();
        ctx.fillRect(centralPoints.x[i]-10, centralPoints.y[i]-10, 20, 20);
        for (let j = 0; j < clusteringGroups[i].length; j++) {
            drawArc(coords.x[clusteringGroups[i][j]], coords.y[clusteringGroups[i][j]]);
        }
    }
    ctx.fillStyle = 'white';
}

//function to find the closest centroids:
function distances(counterClusters, clusteringGroups, centralPoints) {
    clusteringGroups = [];
    for(let i = 0; i < counterClusters; i++) {
        clusteringGroups[i] = [];
    }
    for(let i = 0; i < counterPoints; i++) {
        let minLength = Infinity;
        let minClusterNum;
        for(let j = 0; j < counterClusters; j++) {
            let tempLength = Math.sqrt(Math.pow((centralPoints.x[j]-coords.x[i]),2) + Math.pow((centralPoints.y[j]-coords.y[i]),2));
            if (tempLength < minLength) {
                minLength = tempLength;
                minClusterNum = j;
            }
        }
        clusteringGroups[minClusterNum].push(i);
    }
    return clusteringGroups;
}

//function to calculate new centroids:
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
}

//function to copy objects:
function copy(obj) {
    return obj;
}

//function to check two objects for equality:
function isEqual(firstObj, secObj, counter) {
    for(let i = 0; i < counter; i++) {
        if ((firstObj.x[i] != secObj.x[i]) && (firstObj.y[i] != secObj.y[i])) {
            return false;
        }
    }
    return true;
}

function kMeansPlusPlus(counterClusters, centralPoints) {
    let tempRand = random(counterPoints);
    centralPoints.x[0] = coords.x[tempRand];
    centralPoints.y[0] = coords.y[tempRand];
    for(let i = 1; i < counterClusters; i++) {
        let sumDistances = 0;
        for(let j = 0; j < counterPoints; j++) {
            let minDist = Infinity;
            for(let k = 0; k < centralPoints.x.length; k++) {
                let tempLength = Math.pow((centralPoints.x[k]-coords.x[j]),2) + Math.pow((centralPoints.y[k]-coords.y[j]),2);
                if (tempLength < minDist) {
                    minDist = tempLength;
                }
            }
            sumDistances += minDist;
        }
        let randSum = random(sumDistances);
        sumDistances = 0;
        for(let j = 0; j < counterPoints; j++) {
            let minDist = Infinity;
            for(let k = 0; k < centralPoints.x.length; k++) {
                let tempLength = Math.pow((centralPoints.x[k]-coords.x[j]),2) + Math.pow((centralPoints.y[k]-coords.y[j]),2);
                if (tempLength < minDist) {
                    minDist = tempLength;
                }
            }
            sumDistances += minDist;
            if (sumDistances > randSum) {
                centralPoints.x[i] = coords.x[j];
                centralPoints.y[i] = coords.y[j];
                break;
            }
        }
    }
    return centralPoints;
}

//the main clustering function:
function clustering() {
    let counterClusters = document.getElementById("counterClusters").value;
    let centralPoints = {
        x : [],
        y : []
    }
    let clusteringGroups = [];

    centralPoints = kMeansPlusPlus(counterClusters, centralPoints);

    clusteringGroups = distances(counterClusters, clusteringGroups, centralPoints);

    let previousCentralPoints = copy(centralPoints);

    while (true) {
        newClusters(counterClusters, clusteringGroups, centralPoints);
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

//function to choose the best clustering:
function bestClustering () {
    let minDistance = Infinity;
    let bestClusters;
    for(let i = 0; i < 10; i++) {
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
    coloringClusters(bestClusters.counterClusters, bestClusters.clusteringGroups, bestClusters.centralPoints);
}
