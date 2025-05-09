/**
 * JavaScript code for handling graph button, graph modal, and graphing display.
 * 
 * Author(s): Andrew Cramer, Emmett Grebe
 */

// Show the graph modal when the "Graph Display" button is clicked
document.getElementById('btn-graph-display').addEventListener('click', () => {
    graph_modal.style.display = 'block';
});

// Close the graph modal when the "X" button is clicked
document.getElementById('close-graph-modal').addEventListener('click', () => {
    graph_modal.style.display = 'none';
});

// Hide graph data selector when Cumulative Value Line Chart selected
const graphType = document.getElementById('graph-type');
const graphDataSelect = document.getElementById('graph-data-select-div');
graphType.addEventListener('change', () => {
    if (graphType.value == 'line') {
        graphDataSelect.style.display = 'none';
    } else {
        graphDataSelect.style.display = 'flex';
    }
});
if (graphType.value == 'line') graphDataSelect.style.display = 'none';

// Show the hidden graph dropdown if needed
const dataSelect = document.getElementById('graph-data-select');
const typeSelectGroup = document.getElementById('graph-type-select-group');
dataSelect.addEventListener('change', () => {
    if (dataSelect.value == 'data-type') {
        typeSelectGroup.style.display = 'flex';
    } else {
        typeSelectGroup.style.display = 'none';
    }
});
if (dataSelect.value == 'data-type') typeSelectGroup.style.display = 'flex';

// Set default dates for graph form
setDefaultDateRange('graph-start-date', 'graph-end-date');
syncDatePickers('graph-start-date', 'graph-end-date');

// Pulls graph information as a list object
function pull_graph_data() {
    let graph = document.getElementById('graph-type').value;
    let data = document.getElementById('graph-data-select').value; // Get the graph data selection type
    if (data == 'data-type') {
        data = document.getElementById('graph-entry-type').value; // Sets the actual graph data type 
    }
    let start_date = document.getElementById('graph-start-date').value;
    let end_date = document.getElementById('graph-end-date').value;
    return {type: graph, data: data, start: start_date, end: end_date}
}

// Graph preview
document.getElementById('btn-graph-preview').addEventListener('click', () => {
    const all_data = getData();
    const info = pull_graph_data();
    const prev = document.getElementById('graph-preview');
    // Checking to see if specified data/time range contains any entries
    if ((info.start && info.end) && (info.start > info.end || info.end < info.start)) {
        prev.textContent = 'Invalid date range: Start date must precede end date.';
    } else {
        let dateFiltered = [];
        all_data.forEach(entry => {
            if (entry.category.type != 'income' && entry.date >= info.start && entry.date <= info.end) {
                dateFiltered.push(entry);
            }
        });
        // No data at all
        if (dateFiltered.length < 1) {
            prev.innerHTML = 'No data entries found for this graph.';
        // Checking if there is data for specified type
        } else if (info.data != 'data-exp') {
            // Checking for at least one entry in the specified time with the specified type
            if (dateFiltered.some(entry => { return entry.category.type == info.data })) {
                prev.innerHTML = `Will be a Graph of:<br>Graph Type Selected: ${info.type}<br>Data Type Selected: ${info.data}<br>Over Time From ${info.start} to ${info.end}`;
            } else {
                prev.innerHTML = 'No data entries found for this graph.';
            }
        } else {
            prev.innerHTML = `Will be a Graph of:<br>Graph Type Selected: ${info.type}<br>Data Type Selected: ${info.data}<br>Over Time From ${info.start} to ${info.end}`;
        }
    }
});

// Handle graph form submission (to generate a graph based on selected graph type, data type, and time)
document.getElementById('graph-form').onsubmit = function(event) {
    document.getElementById('clear-btn').click();
    event.preventDefault();
    const info = pull_graph_data();
    if ((info.start && info.end) && (info.start > info.end || info.end < info.start)) {
        alert('Invalid date range: Start date must precede end date.');
        return;
    }

    // Filtering data by specified time
    let dateFiltered = [];
    const all_data = getData();
    all_data.forEach(entry => {
        if (entry.date >= info.start && entry.date <= info.end) {
            dateFiltered.push(entry);
        }
    });

    // Arrays used to produce graph
    let labels = [];
    let numData = [];

    // timeline handled as a special case
    if (info.type == 'line') {
        console.log(info.start);
        let dateLabels = [];
        let currDate = new Date(info.start + 'T00:00:00');
        while (currDate <= new Date(info.end + 'T00:00:00')) {
            dateLabels.push(formatDate(currDate)); // Store a copy of the date
            currDate.setDate(currDate.getDate() + 1); // Increment the date by one day
        }
        console.log("Generated Date Labels:", dateLabels);

        const balByDate = {};
        all_data.forEach(entry => {
            const delta = entry.category.type == 'income' ? parseFloat(entry.amount) : -parseFloat(entry.amount);
            if (!balByDate[entry.date]) balByDate[entry.date] = 0;
            balByDate[entry.date] += delta;
        });

        let cumTotal = 0;
        dateLabels.forEach(date => {
            if (balByDate[date]) {
                cumTotal += balByDate[date];
            }
            labels.push(date);
            numData.push(cumTotal);
        });

        console.log(labels);
        console.log(numData);

        // Creating chart
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: info.type,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Running Balance ($)',
                    data: numData,
                    fill: true,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cumulative Balance Over Time'
                    },
                    tooltip: { callbacks: { label: function(ctx) { return '$' + ctx.raw } } }
                },
                scales: {
                    x: {
                        type: 'category',
                        labels: labels
                    },
                    y: { beginAtZero: false }
                }
            }
        });
    } else {
        if (info.data == 'data-exp') { // all entries, combine like types
            dateFiltered.forEach(entry => {
                if (entry.category.type != 'income') {
                    let i = labels.indexOf(entry.category.type);
                    if (i != -1) { // type found in labels/numData
                        numData[i] += parseFloat(entry.amount);
                    } else { // add type to labels/numData
                        labels.push(entry.category.type);
                        numData.push(parseFloat(entry.amount));
                    }
                }
            });
        } else { // entrys of type, combine subtypes
            dateFiltered.forEach(entry => {
                if (entry.category.type == info.data) { // if proper type
                    let i = labels.indexOf(entry.category.subtype);
                    if (i != -1) { // subtype found in labels/numData
                        numData[i] += parseFloat(entry.amount);
                    } else { // add subtype to labels/numData
                        labels.push(entry.category.subtype);
                        numData.push(parseFloat(entry.amount));
                    }
                }
            });
        }

        // Get sum of all values and fractionalize each component as %
        const totalSum = numData.reduce((sum, cur) => sum + cur, 0);
        let chartData = [];
        let title = 'Title';
        if (info.type == 'doughnut') {
            numData.forEach(entry => { chartData.push((entry * 100 / totalSum)) });
            title = '% of Expenditures';
        } else if (info.type == 'bar') {
            chartData = numData;
            title = 'Expenses by Type';
        }

        // Creating chart
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: info.type,
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: chartData,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    graph_modal.style.display = 'none';

    // placing emojis
    console.log(getData());
    let alldataem = getData();
    const totalSum = numData.reduce((sum, cur) => sum + cur, 0);
    alldataem.forEach((data) => {
        if ((data['category']['type'] === 'food') && ((data['amount']/totalSum) > 0.5)){
            document.getElementById("emojiContainer").innerHTML=('<img id="emoji" src="./images/cookie.png" width=200px>');
        } else if ((data['category']['type'] === 'bills') && ((data['amount']/totalSum) > 0.5)){
            document.getElementById("emojiContainer").innerHTML=('<img id="emoji" src="./images/worried.png" width=200px>');
        } else if ((data['category']['type'] === 'revenue') && ((data['amount']/totalSum) > 0.5)){
            document.getElementById("emojiContainer").innerHTML=('<img id="emoji" src="./images/cool.png" width=200px>');
        } else {
            document.getElementById("emojiContainer").innerHTML=('<img id="emoji" src="./images/content.png" width=200px>');
        }
    });

}
