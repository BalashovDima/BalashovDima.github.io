let points = [];
let calculatedPoints = [];
let chart = null;

function readInitialTableValues() {
    const basePointsRows = document.querySelectorAll('.base-point-row');
    
    basePointsRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const xValue = parseFloat(cells[0].textContent);
        const yValue = parseFloat(cells[1].textContent);
        points.push({ x: xValue, y: yValue, type: 'base-point' });
    });

    // Optionally, sort the points array after loading the values
    points.sort((a, b) => a.x - b.x);
}

function addPoint() {
    const xInput = document.getElementById('x-input').value;
    const yInput = document.getElementById('y-input').value;

    if (xInput === '' || yInput === '') { // don't do anything if one of the inputs is empty
        return;
    }

    toggleNewPointInputs('hide');


    const xValue = parseFloat(xInput);
    const yValue = parseFloat(yInput);

    points.push({ x: xValue, y: yValue, type: 'new' });
    points.sort((a, b) => a.x - b.x);

    // recalculate culculated points (if there are any)
    if(calculatedPoints.length !== 0) {
        for (let i = 0; i < calculatedPoints.length; i++) {
            const point = calculatedPoints[i];
            
            point.y = calculateLagrange(point.x);
        }
        
        renderTable('tFoot');
    }
        
    renderTable('tBody');
    // updateChart();
}

function addCalculatedPoint(x, y) {
    const calcNewButton = document.getElementById('calc-new');

    calcNewButton.parentElement.classList.add('text-row-button');
    calcNewButton.parentElement.classList.remove('inputs-row');
    calcNewButton.style.display = 'table-cell';

    const x_input = document.getElementById('x-calc-y');
    const calculated_y = document.getElementById('calculated-y');

    x_input.parentElement.style.display = 'none'; // hide td (the input is inside of it)
    calculated_y.style.display = 'none';

    x_input.value = '';
    calculated_y.innerText = '';

    const xValue = parseFloat(x);
    const yValue = parseFloat(y);

    calculatedPoints.push({ x: xValue, y: yValue, type: 'new' });
    calculatedPoints.sort((a, b) => a.x - b.x);
    renderTable('tFoot');
}

function renderTable(bodyOrFoot) {
    if(bodyOrFoot == 'tBody') {
        const tableBody = document.querySelector('#points-table tbody');
    
        const rowsToRemove = Array.from(document.getElementsByClassName('base-point-row'));
        rowsToRemove.forEach(row => row.remove());
    
        points.forEach(point => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class='base-point-row'>${point.x.toFixed(2)}</td><td class='base-point-row'>${point.y.toFixed(2)}</td>`;
            tableBody.appendChild(row);
    
            // highlight just added point
            if(point.type == 'new') {
                highlightNewRow(row, point, 'base-point');
            }
        });
    } else if(bodyOrFoot == 'tFoot') {
        const tFoot = document.querySelector('#points-table tfoot');
    
        const rowsToRemove = Array.from(document.getElementsByClassName('calculated-point-row'));
        rowsToRemove.forEach(row => row.remove());
    
        calculatedPoints.forEach(point => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class='calculated-point-row'>${point.x.toFixed(2)}</td><td class='calculated-point-row'>${point.y.toFixed(2)}</td>`;
            tFoot.appendChild(row);
    
            // highlight just added point
            if(point.type == 'new') {
                highlightNewRow(row, point, 'calculated-point-row');
            }
        });
    }
}

function highlightNewRow(elem, point, type) {
    elem.childNodes.forEach((td) => {
        td.style.backgroundColor = '#7aff70';
        td.style.transition = '1000ms';
    });

    setTimeout(() => {
        elem.childNodes.forEach((td) => {
            td.style.backgroundColor = '';
            td.style.transition = '';
        });
        point.type = type;
    }, 200);
}

function newPointHandler(event) {
    toggleNewPointInputs('show');
    document.getElementById('x-input').focus();
}

function toggleNewPointInputs(action = 'toggle') {
    const addNewPointButton = document.getElementById('add-new-point'); // td element that serves as a button
    const x_input_elem = document.getElementById('x-input');
    const y_input_elem = document.getElementById('y-input');

    if(action == 'toggle') {
        // if 'add new point' button is not visible, then we hide the inputs and show the button
        if(addNewPointButton.style.display == 'none') { 
            action = 'hide';
        } else {
            action = 'show';
        }
    }

    if(action == 'show') {
        addNewPointButton.parentElement.classList.remove('text-row-button');
        addNewPointButton.parentElement.classList.add('inputs-row');

        addNewPointButton.style.display = 'none';

        x_input_elem.parentElement.style.display = 'table-cell';
        y_input_elem.parentElement.style.display = 'table-cell';
    } else if(action == 'hide') {
        addNewPointButton.parentElement.classList.add('text-row-button');
        addNewPointButton.parentElement.classList.remove('inputs-row');

        addNewPointButton.style.display = 'table-cell';
        
        x_input_elem.parentElement.style.display = 'none';
        y_input_elem.parentElement.style.display = 'none';
        
        // clear the inputs for the next use
        x_input_elem.value = '';
        y_input_elem.value = '';
    }
}

function toggleCalculateY(action = 'toggle') {
    const calcNewButton = document.getElementById('calc-new');
    const x_input = document.getElementById('x-calc-y');
    const calculated_y = document.getElementById('calculated-y');

    if(action == 'toggle') {
        // if 'calculate Y from X' button is not visible, then we hide the inputs and show the button
        if(calcNewButton.style.display == 'none') { 
            action = 'hide';
        } else {
            action = 'show';
        }
    }

    if(action == 'show') {
        calcNewButton.parentElement.classList.remove('text-row-button');
        calcNewButton.parentElement.classList.add('inputs-row');

        calcNewButton.style.display = 'none';
    
        x_input.parentElement.style.display = 'table-cell'; // show td (the input is inside of it)
        x_input.focus();

        calculated_y.style.display = 'table-cell';
    } else if(action == 'hide') {
        calcNewButton.parentElement.classList.add('text-row-button');
        calcNewButton.parentElement.classList.remove('inputs-row');

        calcNewButton.style.display = 'table-cell';
        
        
        x_input.parentElement.style.display = 'none';
        calculated_y.style.display = 'none';
        
        x_input.value = '';
        calculated_y.innerText = '';
    }
}

// handle keyboard input for 'new point' inputs
document.getElementById('x-input').addEventListener('keyup', (e) => {
    if(e.key == 'Enter') {
        document.getElementById('y-input').focus();
        addPoint(); 
    } else if(e.key === 'Escape') {
        toggleNewPointInputs('hide');
    }
});
// handle keyboard input for 'new point' inputs
document.getElementById('y-input').addEventListener('keyup', (e) => {
    if(e.key == 'Enter') {
        document.getElementById('x-input').focus();
        addPoint(); 
    } else if(e.key === 'Escape') {
        toggleNewPointInputs('hide');
    }
});

document.getElementById('add-new-point').addEventListener('click', newPointHandler);

function caclNewHandler(event) {
    toggleCalculateY('show');
}

document.getElementById('calc-new').addEventListener('click', caclNewHandler);

document.getElementById('x-calc-y').addEventListener('input', (event) => {
    if(event.target.value === '') {
        document.getElementById('calculated-y').innerText = '___';
        return;
    }
    document.getElementById('calculated-y').innerText = calculateLagrange(event.target.value);
});

// handle keyboard input for 'x-calculate-y' inputs
document.getElementById('x-calc-y').addEventListener('keyup', (event) => {
    if(event.key == 'Enter') {
        if(event.target.value == '') return;

        addCalculatedPoint(event.target.value, document.getElementById('calculated-y').innerText); 
    } else if(event.key === 'Escape') {
        toggleCalculateY('hide');
    }
});


function calculateLagrange(x) {
    xValue = parseFloat(x);

    if (isNaN(xValue)) return;

    let result = 0;

    // Perform Lagrange interpolation
    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                term *= (xValue - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }

    return result;
}


// // Initialize Chart.js
// function initChart() {
//     const ctx = document.getElementById('myChart').getContext('2d');
//     chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: [], // X values
//             datasets: [{
//                 label: 'Y Values',
//                 data: [], // Y values
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 borderWidth: 2,
//                 fill: false
//             }]
//         },
//         options: {
//             scales: {
//                 x: {
//                     title: {
//                         display: true,
//                         text: 'X'
//                     }
//                 },
//                 y: {
//                     title: {
//                         display: true,
//                         text: 'Y'
//                     }
//                 }
//             }
//         }
//     });
// }

// // Update the Chart with new points
// function updateChart() {
//     const xValues = points.map(point => point.x);
//     const yValues = points.map(point => point.y);

//     chart.data.labels = xValues; // X-axis labels
//     chart.data.datasets[0].data = yValues; // Y-axis data
//     chart.update();
// }

function notifyOfControls(event) {
    alert("Use 'Enter' to confirm, 'Esc' to cancel");


    localStorage.setItem('hasSeenNotification', 'yes');

    document.getElementById('add-new-point').removeEventListener('click', notifyOfControls);
    document.getElementById('calc-new').removeEventListener('click', notifyOfControls);
}

window.onload = function() {
    readInitialTableValues();
    // initChart(); // Initialize the chart after reading table values
    // updateChart(); // Update the chart with the initial values

    if(localStorage.getItem('hasSeenNotification') != 'yes') {
        document.getElementById('add-new-point').addEventListener('click', notifyOfControls);
        document.getElementById('calc-new').addEventListener('click', notifyOfControls);
    }
}