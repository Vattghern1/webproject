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

function drawColors(counterClusters, clusteringGroups) {
    for (var i = 0; i < counterClusters; i++) {
        var colorNow = generateColor();
        for (var j = 0; j < clusteringGroups[i].length; j++) {
            ctx.fillStyle = colorNow;
            ctx.beginPath();
            ctx.arc(coordsX[clusteringGroups[i][j]], coordsY[clusteringGroups[i][j]], 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.fillStyle = 'black';
}

function generateColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY) {
    clusteringGroups.length = 0;
    for(var i = 0; i < counterClusters; i++) {
        centralPointsX[i] = Math.floor(Math.random()*canvas.width);
        centralPointsY[i] = Math.floor(Math.random()*canvas.height);
    }
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
    centralPointsX.length = 0;
    centralPointsY.length = 0;
    for(var i = 0; i < counterClusters; i++) {
        var temp;
        for(var j = 0; j < clusteringGroups[i].length; j++) {
            temp += coordsX[clusteringGroups[i][j]];
        }
        temp = temp / clusteringGroups[i].length;
        centralPointsX[i] = temp;
    }
    for(var i = 0; i < counterClusters; i++) {
        var temp;
        for(var j = 0; j < clusteringGroups[i].length; j++) {
            temp += coordsY[clusteringGroups[i][j]];
        }
        temp = temp / clusteringGroups[i].length;
        centralPointsY[i] = temp;
    }
}

function clustering() {
    var counterClusters = document.getElementById("counterClusters").value;
    var centralPointsX = [];
    var centralPointsY = [];
    var clusteringGroups = [];
    distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
    var flag = 0;
    for(var i = 0; i < clusteringGroups.length; i++) {
        if (clusteringGroups[i].length == 0) {
            flag = 1;
            break;
        }
    }
    if (flag == 1) {
        clustering();
    }
    else {
        var copyCentralPointsX = centralPointsX;
        var copyCentralPointsY = centralPointsY;
        while (true) {
            newClusters(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
            distances(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
            if ((copyCentralPointsX == centralPointsX) && (copyCentralPointsY == centralPointsY)) {
                break;
            }
            else {
                copyCentralPointsX = centralPointsX;
                copyCentralPointsY = centralPointsY;
            }
        }
        flag = 0;
        for(var i = 0; i < clusteringGroups.length; i++) {
            if (clusteringGroups[i].length == 0) {
                flag = 1;
                break;
            }
        }
        if (flag == 1) {
            clustering();
        }
        else {
            
            console.log(clusteringGroups);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawColors(counterClusters, clusteringGroups, centralPointsX, centralPointsY);
        }
    }
}
