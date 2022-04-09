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

            let number = arr[pos].probability;
            let pos1 = pos;
            let pos2 = finish;

            while (pos1 < pos2){
                if (number > arr[pos2].probability){
                    swap(arr, pos2, pos1 + 1);
                    swap(arr, pos1 + 1, pos1);

                    pos1++;
                }

                else{
                    pos2--;
                }
            }
            for (let i = pos - 1; i >= start; i--) {
                if (arr[i].probability > number) {
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

export {swap, qsort};