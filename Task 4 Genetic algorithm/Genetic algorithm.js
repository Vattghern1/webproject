var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var widthConst = (window.innerWidth / 100);
var heightConst = (window.innerHeight / 100);
canvas.width = widthConst * 75;
canvas.height = heightConst * 75;

ctx.strokeStyle = "#404040";
ctx.lineWidth = 4;
ctx.fillStyle = "white";

//vars for array of coords:
var coords = {
    x : [],
    y : []
}
var distMatrix = [];
var counterPoints = 0;
var points = [];

function drawArc(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

canvas.addEventListener('mousedown', function (e) {
    let tempCoordX = e.clientX-237;
    let tempCoordY = e.clientY-30;
    points.push(counterPoints++);
    drawArc(tempCoordX, tempCoordY);
    coords.x.push(tempCoordX);
    coords.y.push(tempCoordY);
});

function fullMatrix () {
    for(let i = 0; i < counterPoints; i++) {
        distMatrix[i] = [];
        for(let j = 0; j < counterPoints; j++) {
            distMatrix[i][j] = Math.sqrt(Math.pow((coords.x[j]-coords.x[i]),2) + Math.pow((coords.y[j]-coords.y[i]),2));
        }
    }
}

var results = [];
const generationMax = 400;
var generationCounter = 0;

function findDistancesSum(arrayPoints) {
    let tempSum = 0;
    for(let j = 0; j < counterPoints-1; j++) {
        tempSum += distMatrix[arrayPoints[j]][arrayPoints[j+1]];
    }
    return tempSum;
}

function random(maxVal) {
    return Math.floor(Math.random()*maxVal);
}

function permute(points, memo) {
    let cur;

    var memo = memo || [];

    for (let i = 0; i < points.length; i++) {
        cur = points.splice(i, 1);
        if (points.length === 0) {
            let temp = memo.concat(cur);
            let distancesSum = findDistancesSum(temp);
            temp.push(distancesSum);
            results.push(temp);
            generationCounter++;
        }
        if (generationCounter >= generationMax) {
            return results;
        }
        permute(points.slice(), memo.concat(cur));

        points.splice(i, 0, cur[0]);
    }
    return results;
}

function crossing(firstParent, secondParent) {

}

function geneticAlg() {
    fullMatrix();
    let generations = permute(points);
    merge_sort(generations, generations.length);
    console.log(generations);
    for(let i = 0; i < 1800; i++) {
        let firstParent = random(counterPoints);
        let secondParent = random(counterPoints);
        if (secondParent == firstParent) {
            while(secondParent == firstParent) {
                secondParent = random(counterPoints);
            }
        }

    }

}

function clearing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coords.x = [];
    coords.y = [];
    distMatrix = [];
    counterPoints = 0;
    points = [];
}

function merge(arr, left, mid, right, drr) {
    let i = left;
    let j = mid+1;
    for (let k = left; k <= right; k++) {
        if (j > right) drr[k] = arr[i++];
        else if (i > mid) drr[k] = arr[j++];
        else if (arr[i][counterPoints] <= arr[j][counterPoints]) drr[k]=arr[i++];
        else drr[k] = arr[j++];
    }
}

function merge_rec(arr, left, right, drr) {
    let mid = (left+right)/2;
    if (left<mid) {
        merge_rec(arr, left, mid, drr);
    }
    if (right>mid) {
        merge_rec(arr,mid+1, right, drr);
    }
    merge(arr,left,mid,right,drr);
    for(let i = left; i <= right; i++) {
        arr[i] = drr[i];
    }
}

function merge_sort(arr, n) {
    let d = [];
    merge_rec(arr,0,n-1, d);
}