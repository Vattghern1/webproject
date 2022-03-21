// canvas settings:
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var widthConst = (window.innerWidth / 100);
var heightConst = (window.innerHeight / 100);
canvas.width = widthConst * 70;
canvas.height = heightConst * 70;

//func to show clusters count:
function setClustersCount() {
    var counterClusters = document.getElementById("counterClusters").value;
    var windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = counterClusters;
}

// vars for array of coords:
var coordsX = [];
var coordsY = [];
var counterPoints = 0;

// to paint points:
canvas.addEventListener('mousedown', function (e) {
    ctx.beginPath();
    var tempCoordX = e.clientX-280;
    var tempCoordY = e.clientY-30;
    counterPoints++;
    ctx.arc(tempCoordX, tempCoordY, 10, 0, Math.PI * 2);
    ctx.fill();
    coordsX.push(tempCoordX);
    coordsY.push(tempCoordY);
});

//func to clustering:
function alertFunc() {
    var counterClusters = document.getElementById("counterClusters").value;
    if (counterClusters > counterPoints) {
        alert("Sorry! Too many clusters!");
    }
    else {
        clustering();
    }
}

//func to clear the canvas and array:
function clearing() {
    var counterClusters = document.getElementById("counterClusters");
    var windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = "1";
    counterClusters.value = 1;
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coordsY.length = 0;
    coordsX.length = 0;
    counterPoints = 0;
}

function drawColors(counterClusters, clusteringGroups, centralPointsX, centralPointsY) {
    for (var i = 0; i < counterClusters; i++) {
        var colorNow = generateColor();
        ctx.fillStyle = colorNow;
        for (var j = 0; j < clusteringGroups[i].length; j++) {
            ctx.beginPath();
            ctx.arc(coordsX[clusteringGroups[i][j]], coordsY[clusteringGroups[i][j]], 10, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.fillRect(centralPointsX[i]-10, centralPointsY[i]-10, 20, 20);
    }
    ctx.fillStyle = 'black';
}

function generateColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY) {
    clusteringGroups.length = 0;
    for(var i = 0; i < counterClusters; i++) {
        clusteringGroups[i] = [];
    }
    for(var i = 0; i < counterPoints; i++) {
        var minLength = canvas.width+10;
        var minClusterNum = 0;
        for(var j = 0; j < counterClusters; j++) {
            var tempLength = Math.sqrt(Math.pow((centralPointsX[j]-coordsX[i]),2) + Math.pow((centralPointsY[j]-coordsY[i]),2));
            if (tempLength < minLength) {
                minLength = tempLength;
                minClusterNum = j;
            }
        }
        clusteringGroups[minClusterNum].push(i);
    }
}


function newClusters(counterClusters, clusteringGroups, centralPointsX, centralPointsY) {
    for(var i = 0; i < counterClusters; i++) {
        var temp = 0;
        var temp1 = 0;
        for(var j = 0; j < clusteringGroups[i].length; j++) {
            temp += coordsX[clusteringGroups[i][j]];
            temp1 += coordsY[clusteringGroups[i][j]];
        }
        if (clusteringGroups[i].length != 0) {
            temp = temp / clusteringGroups[i].length;
            temp1 = temp1 / clusteringGroups[i].length;
            centralPointsX[i] = temp;
            centralPointsY[i] = temp1;
        }
    }
}

function clustering() {
    var counterClusters = document.getElementById("counterClusters").value;
    var centralPointsX = [];
    var centralPointsY = [];
    var clusteringGroups = [];

    for(var i = 0; i < counterClusters; i++) {
        centralPointsX[i] = Math.floor(Math.random()*canvas.width);
        centralPointsY[i] = Math.floor(Math.random()*canvas.height);
    }

<<<<<<< HEAD
    clusteringGroups = distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY);

    var flag = 0;
    for (var i = 0; i < counterClusters; i++) {
        if (clusteringGroups[i].length == 0) {
            flag = 1;
=======
    distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY);

    var copyCentralPointsX = centralPointsX;
    var copyCentralPointsY = centralPointsY;
    while (true) {
        newClusters(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
        distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
        if ((copyCentralPointsX == centralPointsX) && (copyCentralPointsY == centralPointsY)) {
            break;
>>>>>>> parent of 776eb56 (FINAL)
        }
    }
    if (flag == 1) {
        clustering();
    }
    else {
        var copyCentralPointsX = centralPointsX;
        var copyCentralPointsY = centralPointsY;

        var iterations = 0;
        while (true) {
            iterations++;

            centralPointsX = newClusters(counterClusters, clusteringGroups, centralPointsX, coordsX);
            centralPointsY = newClusters(counterClusters, clusteringGroups, centralPointsY, coordsY);
            console.log(iterations);
            clusteringGroups = distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
            if (((copyCentralPointsX == centralPointsX) && (copyCentralPointsY == centralPointsY)) || (iterations > 100)) {
                break;
            } else {
                copyCentralPointsX = centralPointsX;
                copyCentralPointsY = centralPointsY;
            }
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawColors(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
}

