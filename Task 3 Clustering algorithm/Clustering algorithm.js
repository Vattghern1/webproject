//canvas settings:
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthConst = (window.innerWidth / 100);
const heightConst = (window.innerHeight / 100);
canvas.width = widthConst * 70;
canvas.height = heightConst * 70;

let coords = {
    x : [],
    y : []
}

let counterPoints = 0;

ctx.strokeStyle = "#404040";
ctx.lineWidth = 4;
ctx.fillStyle = "white";

function setClustersCount() {
    let counterClusters = document.getElementById("counterClusters").value;
    let windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = counterClusters;
}

function alertInf() {
    let counterClusters = document.getElementById("counterClusters").value;
    return counterClusters > counterPoints;
}

function alertFuncKMeans() {
    if (alertInf()) {
        alert("Кластеров не может быть большем, чем точек. Измените количество!");
    }
    else {
        clustering();
    }
}

function random(maxVal) {
    return Math.floor(Math.random()*maxVal);
}

function pushCoords(x, y) {
    drawArc(x, y);
    coords.x.push(x);
    coords.y.push(y);
}

canvas.addEventListener('mousedown', function (e) {
    let tempX = e.clientX-290;
    let tempY = e.clientY-30;
    counterPoints++;
    pushCoords(tempX, tempY);
});

function randomPoints() {
    clearing();
    let randomPointsCount = random(500);
    counterPoints = randomPointsCount;
    for(let i = 0; i < randomPointsCount; i++) {
        let randX = random(canvas.width);
        let randY = random(canvas.height);
        pushCoords(randX, randY);
    }
}

function alertFuncHierarchical() {
    if (alertInf()) {
        alert("Кластеров не может быть большем, чем точек. Измените количество!");
    }
    else {
        clusteringHierarchical();
    }
}

function drawArc(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function coloringClusters(counterClusters, clusteringGroups, centralPoints) {
    for (let i = 0; i < counterClusters; i++) {
        ctx.fillStyle = chooseColors(i);
        ctx.beginPath();
        ctx.fillRect(centralPoints.x[i]-10, centralPoints.y[i]-10, 20, 20);
        for (let j in clusteringGroups[i]) {
            drawArc(coords.x[clusteringGroups[i][j]], coords.y[clusteringGroups[i][j]]);
        }
    }
    ctx.fillStyle = 'white';
}

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

function distances(counterClusters, clusteringGroups, centralPoints) {
    clusteringGroups = [];
    for(let i = 0; i < counterClusters; i++) {
        clusteringGroups[i] = [];
    }
    for(let i = 0; i < counterPoints; i++) {
        let minLength = Infinity;
        let minClusterNum = 0;
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

function newClusters(counterClusters, clusteringGroups, centralPoints) {
    for(let i = 0; i < counterClusters; i++) {
        let tempX = 0;
        let tempY = 0;
        let counter = 0;
        for(let j in clusteringGroups[i]) {
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

function copy(obj) {
    let copyObj = {
        x : [],
        y : []
    };

    for(let i in obj.x) {
        copyObj.x[i] = obj.x[i];
        copyObj.y[i] = obj.y[i];
    }

    return copyObj;
}

function isEqual(firstObj, secObj) {
    for(let i in firstObj.x) {
        if ((firstObj.x[i] !== secObj.x[i]) || (firstObj.y[i] !== secObj.y[i])) {
            return false;
        }
    }
    return true;
}

function findMinDistKPP(centralPoints, j) {
    let minDist = Infinity;
    for(let k in centralPoints.x) {
        let tempLength = Math.pow((centralPoints.x[k]-coords.x[j]),2) + Math.pow((centralPoints.y[k]-coords.y[j]),2);
        if (tempLength < minDist) {
            minDist = tempLength;
        }
    }
    return minDist;
}

function kMeansPlusPlus(counterClusters, centralPoints) {
    let tempRand = random(counterPoints);
    centralPoints.x[0] = coords.x[tempRand];
    centralPoints.y[0] = coords.y[tempRand];
    for(let i = 1; i < counterClusters; i++) {
        let sumDistances = 0;
        for(let j = 0; j < counterPoints; j++) {
            sumDistances += findMinDistKPP(centralPoints, j);
        }
        let randSum = random(sumDistances);
        sumDistances = 0;
        for(let j = 0; j < counterPoints; j++) {
            sumDistances += findMinDistKPP(centralPoints, j);
            if (sumDistances > randSum) {
                centralPoints.x[i] = coords.x[j];
                centralPoints.y[i] = coords.y[j];
                break;
            }
        }
    }
    return centralPoints;
}

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
        if (isEqual(previousCentralPoints, centralPoints)) {
            break;
        } else {
            previousCentralPoints = copy(centralPoints);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coloringClusters(counterClusters, clusteringGroups, centralPoints);
}

function findCenter(array) {
    let x = 0;
    let y = 0;
    for(let i = 0; i < array.length; i++) {
        x += coords.x[array[i]];
        y += coords.y[array[i]];
    }
    x = x/array.length;
    y = y/array.length;
    return {
        x : x,
        y : y
    };
}

function clustersPop(clusteringGroups, secCluster) {
    let temp = clusteringGroups[secCluster];
    clusteringGroups[secCluster] = clusteringGroups[clusteringGroups.length-1];
    clusteringGroups[clusteringGroups.length-1] = temp;
    clusteringGroups.pop();
}

function clusteringHierarchical() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let counterClusters = document.getElementById("counterClusters").value;

    let clusteringGroups = [];

    for(let i = 0; i < counterPoints; i++) {
        clusteringGroups[i] = [];
        clusteringGroups[i].push(i);
    }

    while (clusteringGroups.length > counterClusters) {
        let minDist = Infinity;
        let firstCluster = 0;
        let secCluster = 0;
        for (let i = 0; i < clusteringGroups.length; i++) {
            let cordsI = findCenter(clusteringGroups[i]);
            for (let j = i + 1; j < clusteringGroups.length; j++) {
                let cordsJ = findCenter(clusteringGroups[j]);
                let dist = Math.sqrt(Math.pow((cordsJ.x - cordsI.x), 2) + Math.pow((cordsJ.y - cordsI.y), 2));
                if (dist < minDist) {
                    minDist = dist;
                    firstCluster = i;
                    secCluster = j;
                }
            }
        }
        for(let i = 0; i < clusteringGroups[secCluster].length; i++) {
            clusteringGroups[firstCluster].push(clusteringGroups[secCluster][i]);
        }
        clustersPop(clusteringGroups, secCluster);
    }
    coloringClustersHierarchical(counterClusters, clusteringGroups);
}

function coloringClustersHierarchical(counterClusters, clusteringGroups) {
    for (let i = 0; i < counterClusters; i++) {
        ctx.fillStyle = chooseColors(i);
        ctx.beginPath();
        let centerCord = findCenter(clusteringGroups[i]);
        ctx.fillRect(centerCord.x-10, centerCord.y-10, 20, 20);
        for (let j in clusteringGroups[i]) {
            drawArc(coords.x[clusteringGroups[i][j]], coords.y[clusteringGroups[i][j]]);
        }
    }
    ctx.fillStyle = 'white';
}