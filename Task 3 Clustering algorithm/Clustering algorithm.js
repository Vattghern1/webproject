var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var widthConst = (window.innerWidth / 100);
var heightConst = (window.innerHeight / 100);
var button = document.getElementById('button1');
canvas.width = widthConst * 70;
canvas.height = heightConst * 70; // size of canvas


function sizeWindow() {
    var counterClusters = document.getElementById("counterClusters").value;
    var windowOfCounter = document.getElementById("windowOfCounter");
    windowOfCounter.innerText = counterClusters;
}

var coordsX = [];
var coordsY = [];

canvas.addEventListener('mousedown', function (e) {
    ctx.beginPath();
    var tempCoordX = e.clientX-280;
    var tempCoordY = e.clientY-30;
    ctx.arc(tempCoordX, tempCoordY, 10, 0, Math.PI * 2);
    ctx.fill();
    coordsX.push(tempCoordX);
    coordsY.push(tempCoordY);
});

