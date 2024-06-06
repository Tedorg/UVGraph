import Plotly from 'plotly.js-basic-dist-min'

var dataset_count = 0;

const trace1 = {
    x: [],
    y: [],
    type: 'scatter',
    name: 'Messwerte'
};

const data = [trace1];

const layout = {

    xaxis: {
        range: [0, 150
        ],
        title: "Distanz in cm",
        tickfont: {
            size: 11,
            color: 'rgb(107, 107, 107)'
        }
    },
    yaxis: {
        range: [0, 1024],
        title: 'Signalstärke UV-Sensor',
        titlefont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
        },
        tickfont: {
            size: 14,
            color: 'rgb(107, 107, 107)'
        }
    },
    legend: {
        x: 5,
        y: 5,
        bgcolor: 'rgba(255, 255, 255, 0)',
        bordercolor: 'rgba(255, 255, 255, 0)'
    },
    height: 600,
    autosize: true,
    colorway: ['#FF4500', '#7DF0AA', '#A4E7BE', '#a262a9', '#6f4d96', '#3d3b72', '#182844'],
    title: 'UV-Messwerte',
    ternary: {
        aaxis: {
            gridcolor: "#ffffff",
            color: "#42e0f5"
        }
    },
    showlegend: true
};

Plotly.newPlot('graph', data, layout, {
    displayModeBar: false,
    responsive: true,
    scrollZoom: false,
    staticPlot: true
});


document.getElementById("dataForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const button = this.buttonSend;

    addData(button);

});

const input = document.querySelector("input");


input.addEventListener("invalid", (e) => {

    console.log("invalid")
});

document.getElementById("buttonRemove").addEventListener("click",
    function (event) {

        const button = this.buttonRemove;

        removeData(button);
    })
var toggler = document.getElementById('switchGetMean');

toggler.addEventListener("click", function (event) {




    if (dataset_count % 2 == 0) {

        loadDataset(this);


        dataset_count++;
    }
    else {

        removeDataset(this);

        dataset_count++;


    }

});

function isValidNumber(value, min, max) {
    // Convert the input value to a number
    const isEmpty = !value || value.length === 0
    // Check if the value is a number and within the range 0 to 1024
    if (!isEmpty && !isNaN(value) && value >= min && value <= max) {
        //console.log("valid: " + value)
        return true;
    } else {
        //console.log("invalid: " + value)
        return false;
    }
}


function indicateWaiting(action, element) {

    if (action === "start") {
        element.classList.add("loading");
        element.ariaBusy = true
        element.disabled = true;
    } else if (action === "stop") {
        element.classList.remove("loading");
        element.ariaBusy = false
        element.disabled = false;
    }

}



function addData(button) {
    const distanceInput = document.getElementById("distanceInput");
    const valueInput = document.getElementById("valueInput");
    const newDistance = parseFloat(distanceInput.value);
    const newValue = parseFloat(valueInput.value);

    if (!isValidNumber(newDistance, 0, 200)) return;
    if (!isValidNumber(newValue, 0, 1024)) return;
    indicateWaiting("start", button);

    const existingIndex = trace1.x.indexOf(newDistance);
    if (existingIndex !== -1) {
        trace1.y[existingIndex] = newValue;
    } else if (trace1.x.length === 0 || newDistance > trace1.x[trace1.x.length - 1]) {
        trace1.x.push(newDistance);
        trace1.y.push(newValue);
    } else {
        for (let i = 0; i < trace1.x.length; i++) {
            if (newDistance < trace1.x[i]) {
                trace1.x.splice(i, 0, newDistance);
                trace1.y.splice(i, 0, newValue);
                break;
            }
        }
    }

    try {
        postData({
            distance: newDistance,
            uv: newValue
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); // Parse JSON response
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                console.log('Success:');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        distanceInput.value = ''; // Clear the distance input field
        valueInput.value = ''; // Clear the UV value input field
    } catch (error) {
        console.error("Error sending data:", error);
    } finally {
        animateUpdate(); // Use animateUpdate instead of Plotly.update
        createTableFromArrays('table', trace1);
        indicateWaiting("stop", button);
    }
}

function animateUpdate() {
    Plotly.animate('graph', {
        data: [{ x: trace1.x, y: trace1.y }]
    }, {
        transition: {
            duration: 500,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 500
        },
        autosize: true
    }, layout);
}







function removeData() {
    trace1.x.pop();
    trace1.y.pop();

    Plotly.update('graph', data, layout, { displayModeBar: false, responsive: true, scrollZoom: false, staticPlot: true });
    createTableFromArrays('table', trace1);

}
function removeDataset() {

    data.pop();
    Plotly.update('graph', data, layout, { displayModeBar: false, responsive: true, scrollZoom: false, staticPlot: true });


}

function loadDataset(button) {
    {
        indicateWaiting("start", button);
        getData()
            .then(d => {
                if (data.length > 1) {
                    data.pop();
                }

                const newDataset = {


                    x: d.values.map(e => parseInt(e[0])),
                    y: d.values.map(e => parseInt(e[1])),
                    type: 'scatter',
                    name: 'Durchschnitt'

                };
                data.push(newDataset);

                // Object.keys(data).forEach(function (key) {

                //     console.log(key, data[key]);

                // });

                Plotly.update('graph', data, layout);
                indicateWaiting("stop", button)

            }
            )
            .catch(e => console.log(e))



    }

}




const postData = data => {
    const body = JSON.stringify(data);
    return fetch('/input', {
        method: 'POST', // GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, same-origin
        cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, follow, error
        referrer: 'no-referrer', // no-referrer, client
        body
    });
}
const getData = data => {

    const body = JSON.stringify(data);
    return fetch('/data', {
        method: 'GET', // GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, same-origin
        cache: 'no-cache', // default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow', // manual, follow, error
        referrer: 'no-referrer', // no-referrer, client

    })
        .then(response => response.json()) // parses JSON response into native JavaScript objects
}



// document.addEventListener(
//     "keydown",
//     (event) => {
//         const keyName = event.key;

//         if (keyName === "Enter") {

//             addData();


//         }


//     },
//     false,
// );


function _addData() {
    postData({
        distance: newDistance,
        uv: newValue
    })
        .then(
    )
        .catch(e => console.log(e));


}




function createTableFromArrays(sectionId, trace) {
    const section = document.getElementById(sectionId);
    section.innerHTML = "";
    if (!section) {
        console.error(`Section with ID ${sectionId} not found`);
        return;
    }

    // Create the table element
    const table = document.createElement('table');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headerDistanz = document.createElement('th');
    headerDistanz.textContent = 'Distanz';
    headerRow.appendChild(headerDistanz);

    const headerMesswert = document.createElement('th');
    headerMesswert.textContent = 'Messwert';
    headerRow.appendChild(headerMesswert);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    for (let i = 0; i < trace.x.length; i++) {
        const row = document.createElement('tr');

        const cellX = document.createElement('td');
        cellX.textContent = trace.x[i];
        row.appendChild(cellX);

        const cellY = document.createElement('td');
        cellY.textContent = trace.y[i];
        row.appendChild(cellY);

        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    // Append the table to the section
    section.appendChild(table);
}


