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
var results = [];
const generationMax = 400;
var generationCounter = 0;
const mutationPercent = 50;

function drawNums(x, y, num) {
    ctx.fillStyle = 'black';
    ctx.font = '25px Verdana';
    ctx.fillText(num,x, y - 23);
    ctx.font = 'bold 10px sans-serif';
    ctx.fillStyle = 'white';
}

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
    drawNums(tempCoordX, tempCoordY, counterPoints);
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

function findDistancesSum(arrayPoints) {
    let tempSum = 0;
    for(let j = 0; j < counterPoints-1; j++) {
        tempSum += distMatrix[arrayPoints[j]][arrayPoints[j+1]];
    }
    tempSum += distMatrix[arrayPoints[0]][arrayPoints[counterPoints-1]];
    return tempSum;
}

function random(maxVal) {
    return Math.floor(Math.random()*maxVal);
}

function permute(points, memo) {
    let cur;

    memo = memo || [];

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

function copy(obj) {
    let copyObj = [];
    for(let i = 0; i < counterPoints; i++) {
        copyObj[i] = obj[i];
    }
    return copyObj;
}

function crossing(firstParent, secondParent) {

    let pointGap = random(counterPoints - 2);
    let child1 = [];
    let child2 = [];

    let copyFirstParent = copy(firstParent);
    let copySecParent = copy(secondParent);
    for(let i = 0; i <= pointGap; i++) {
        child1.push(firstParent[i]);
        for (let j = 0; j < counterPoints; j++) {
            if (firstParent[i] == secondParent[j]) {
                copySecParent[j] = -1;
            }
        }
    }
    for(let i = pointGap+1; i < counterPoints; i++) {
        if (copySecParent[i] != -1) {
            child1.push(secondParent[i]);
            for(let j = 0; j < counterPoints; j++) {
                if (secondParent[i] == firstParent[j]) {
                    copyFirstParent[j] = -1;
                }
            }
        }
    }
    if (child1.length < counterPoints) {
        for(let i = pointGap+1; i < counterPoints; i++) {
            if ((copyFirstParent[i] != -1) && (child1.length < counterPoints)) {
                child1.push(firstParent[i]);
            }
        }
    }

    copyFirstParent = copy(firstParent);
    copySecParent = copy(secondParent);
    for(let i = 0; i <= pointGap; i++) {
        child2.push(secondParent[i]);
        for (let j = 0; j < counterPoints; j++) {
            if (secondParent[i] == firstParent[j]) {
                copyFirstParent[j] = -1;
            }
        }
    }
    for(let i = pointGap+1; i < counterPoints; i++) {
        if (copyFirstParent[i] != -1) {
            child2.push(firstParent[i]);
            for(let j = 0; j < counterPoints; j++) {
                if (firstParent[i] == secondParent[j]) {
                    copySecParent[j] = -1;
                }
            }
        }
    }
    if (child2.length < counterPoints) {
        for(let i = pointGap+1; i < counterPoints; i++) {
            if ((copySecParent[i] != -1) && (child2.length < counterPoints)) {
                child2.push(secondParent[i]);
            }
        }
    }

    child1.push(findDistancesSum(child1));
    child2.push(findDistancesSum(child2));

    return {
        child1 : child1,
        child2 : child2
    }
}

function BubbleSort(array) {
    let n = array.length;
    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-1-i; j++) {
            if (array[j+1][counterPoints] < array[j][counterPoints]) {
                let t = array[j+1];
                array[j+1] = array[j];
                array[j] = t;
            }
        }
    }
}

function swap(arr, i1, i2){
    if (i1 === i2) return;

    const swap = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = swap;
}

function qsort(arr){
    let ranges = [[0, arr.length-1]];

    while (ranges.length) {
        let nextRanges = [];

        for (let k = 0; k < ranges.length; k++) {
            let start = ranges[k][0];
            let finish = ranges[k][1];

            let pos = Math.floor((start + finish) / 2);

            let number = arr[pos][counterPoints];
            let pos1 = pos;
            let pos2 = finish;

            while (pos1 < pos2){
                if (number > arr[pos2][counterPoints]){
                    swap(arr, pos2, pos1 + 1);
                    swap(arr, pos1 + 1, pos1);

                    pos1++;
                }

                else{
                    pos2--;
                }
            }
            for (let i = pos - 1; i >= start; i--) {
                if (arr[i][counterPoints] > number) {
                    swap(arr, i, pos1 - 1);
                    swap(arr, pos1 - 1, pos1);
                    pos1--;
                }
            }

            if (pos1 > start + 1){
                nextRanges.push([start, pos1 - 1]);
            }

            if (finish - pos1 > 1) {
                nextRanges.push([pos1 + 1, finish]);
            }
        }

        ranges = nextRanges;
    }
}

function mutation(child) {
    if (random(100) < mutationPercent) {
        let firstRandInd = random(counterPoints-1);
        let secRandInd = random(counterPoints-1);
        let temp = child[firstRandInd];
        child[firstRandInd] = child[secRandInd];
        child[secRandInd] = temp;
        child[counterPoints] = findDistancesSum(child);
    }
}

function drawPath(path) {
    setTimeout(function () {
        ctx.strokeStyle = '#800000';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(coords.x[path[0]], coords.y[path[0]]);
        for (let i = 1; i < counterPoints; i++) {
            ctx.lineTo(coords.x[path[i]], coords.y[path[i]]);
        }
        ctx.lineTo(coords.x[path[0]], coords.y[path[0]]);
        ctx.stroke();
        ctx.strokeStyle = '#404040';
        for (let i = 0; i < counterPoints; i++) {
            drawArc(coords.x[i], coords.y[i]);
            drawNums(coords.x[i], coords.y[i], i + 1);
        }
    }, 15);
}

function geneticAlg() {
    fullMatrix();
    let generations = permute(points);
    for(let i = 0; i < 1800; i++) {
        let firstParent = random(generations.length);
        let secondParent = random(generations.length);
        if (secondParent === firstParent) {
            while(secondParent === firstParent) {
                secondParent = random(counterPoints);
            }
        }
        let children = crossing(generations[firstParent], generations[secondParent]);
        mutation(children.child1);
        mutation(children.child2);
        generations.push(children.child1);
        generations.push(children.child2);
        qsort(generations);
        for(let j = 0; j < 2; j++) {
            generations.pop();
        }
        drawPath(generations[0]);
    }
}

function clearing() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    coords.x = [];
    coords.y = [];
    distMatrix = [];
    counterPoints = 0;
    points = [];
    results = [];
    generationCounter = 0;
}

