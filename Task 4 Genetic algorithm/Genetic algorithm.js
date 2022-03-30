var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var widthConst = (window.innerWidth / 100);
var heightConst = (window.innerHeight / 100);
canvas.width = widthConst * 70;
canvas.height = heightConst * 70;

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

canvas.addEventListener('mousedown', function (e) {
    let tempCoordX = e.clientX-290;
    let tempCoordY = e.clientY-30;
    counterPoints++;
    drawArc(tempCoordX, tempCoordY);
    coords.x.push(tempCoordX);
    coords.y.push(tempCoordY);
});

