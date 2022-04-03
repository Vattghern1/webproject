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

function copy(obj) {
    return obj;
}

function crossing(firstParent, secondParent) {
    let copyFirstParent = copy(firstParent);
    let copySecParent = copy(secondParent);
    let pointGap = random(counterPoints - 2);
    let child1 = [];
    let child2 = [];
    for(let i = 0; i <= pointGap; i++) {
        child1.push(firstParent[i]);
        for(let j = 0; j < counterPoints; j++) {
            if (secondParent[j] == firstParent[i]) {
                copySecParent[j] = -1;
            }
        }
    }
    for(let i = pointGap + 1; i < counterPoints; i++) {
        if (copySecParent[i] != -1) {
            child1.push(copySecParent[i]);
            for(let j = 0; j < counterPoints; j++) {
                if (copySecParent[i] == firstParent[j]) {
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
        for(let j = 0; j < counterPoints; j++) {
            if (firstParent[j] == secondParent[i]) {
                copyFirstParent[j] = -1;
            }
        }
    }
    for(let i = pointGap + 1; i < counterPoints; i++) {
        if (copyFirstParent[i] != -1) {
            child2.push(copyFirstParent[i]);
            for(let j = 0; j < counterPoints; j++) {
                if (copyFirstParent[i] == secondParent[j]) {
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

    return {
        child1 : child1,
        child2 : child2
    };
}

function geneticAlg() {
    fullMatrix();
    let generations = permute(points);
    for(let i = 0; i < 1; i++) {
        let firstParent = random(counterPoints);
        let secondParent = random(counterPoints);
        if (secondParent == firstParent) {
            while(secondParent == firstParent) {
                secondParent = random(counterPoints);
            }
        }
        let children = crossing(generations[firstParent], generations[secondParent])
        console.log(children);

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
}

