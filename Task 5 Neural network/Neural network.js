let mapSize;
document.addEventListener("DOMContentLoaded", () => {
    mapSize = 5;
    createMap();
});

function createMap() {
    const table = document.getElementById('table-matrix');
    for (let i = 0; i < 5; i++) {
        let tr = document.createElement('tr');
        tr.classList.add("map-line");
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            td.classList.add("map-block");
            td.setAttribute("onclick", 'checkerButtons(this)');
            td.setAttribute("id", j+" - "+i)
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}