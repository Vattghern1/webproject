coordinates = [];

function addPointsInArray(x, y){
    coordinates.push({x:x, y:y});
}

matrix = [];

for (let i = 0; i < coordinates.length; i++){
    matrix[i] = [];
}

function makeDistanceMatrix(coordinates){
    for (let i = 0; i <= coordinates.length - 1; i++){
        for (let k = i; k <= coordinates.length - 1; k++){
            matrix[i][k] = ((coordinates[i].x - coordinates[k].x) ** 2 + (coordinates[i].y - coordinates[k].y) ** 2) ** 0.5;
        }
    }
}


