/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, Brendon Elmore
 */

window.onload = loadSettings;

// Get modal and button
const graph_modal = document.getElementById('graph-modal');
const data_modal = document.getElementById('data-modal');



// Show the data modal when the "Data Display" button is clicked
document.getElementById('btn-data-display').addEventListener('click', () => {
    data_modal.style.display = 'block';
});

// Close the data modal when the "X" button is clicked
document.getElementById('close-data-modal').addEventListener('click', () => {
    data_modal.style.display = 'none';
});

// Close the graph or data modal if user clicks outside of it
window.onclick = function (event) {
    if (event.target == graph_modal) {
        graph_modal.style.display = 'none';
    }
    if (event.target == data_modal) {
        data_modal.style.display = 'none';
    }
}

// Show the hidden graph dropdown if needed
const dataSelect = document.getElementById('graph-data-select');
const typeSelectGroup = document.getElementById('graph-type-select-group');
let filteredData = [];

// Show the hidden data dropdown if needed
const ddataSelect = document.getElementById('data-data-select');
const dtypeSelectGroup = document.getElementById('data-type-select-group');
function setDefaultDateRange(startId, endId) {
    const startDateInput = document.getElementById(startId);
    const endDateInput = document.getElementById(endId);

    // Set to latest quarter statically
    startDateInput.value = '2024-01-01';
    endDateInput.value = '2024-03-31';

    // Optionally set limits if you want to restrict selection
    startDateInput.max = '2024-03-31';
    endDateInput.min = '2024-01-01';
}

// Apply to both forms
setDefaultDateRange('data-start-date', 'data-end-date');

// Apply to both modals
syncDatePickers('data-start-date', 'data-end-date');
const apiKey = 'OL4N342B4496RSGK';

function pull_data_data() {
    let start_date = document.getElementById('data-start-date').value;
    let end_date = document.getElementById('data-end-date').value;
    return [start_date, end_date]
}

// Load data into preview display
document.getElementById('btn-data-preview').addEventListener('click', async () => {
    // Get start and end dates from the input fields
    const [startDate, endDate] = pull_data_data();

    // Validate date range
    if (startDate && endDate && (startDate > endDate || endDate < startDate)) {
        alert('Invalid date range: Start date must precede end date.');
        return;
    }

    // Example for pulling USD to EUR exchange rate
    const url = `https://www.alphavantage.co/query?function=CPI&interval=monthly&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data['data']) {
            document.getElementById('data-preview').innerHTML = `
        <div class="error">
            <h3>Error: CPI data could not be retrieved.</h3>
        </div>`;
            return;
        }
        const timeSeries = data['data'];
        if (!timeSeries) {
            document.getElementById('data-preview').innerHTML = `
                <div class="error">
                    <h3>Error: CPI data could not be retrieved.</h3>
                </div>`;
            return;
        }
        filteredData = timeSeries
            .filter(item => item.date >= startDate && item.date <= endDate)
            .map((item) => {
                return {
                    date: item.date,
                    value: parseFloat(item.value) // Closing exchange rate value for USD to EUR
                };
            })
            .reverse();
        // If no data found for the date range
        if (filteredData.length === 0) {
            document.getElementById('data-preview').innerHTML = `
                <div class="no-data">
                    <h3>No Data Found for the Selected Date Range.</h3>
                </div>`;
            return;
        }

        const dataContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.innerHTML = `CPI Data (${startDate} to ${endDate})`;
        dataContainer.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = `This data shows the Consumer Price Index (CPI) over time.`;
        dataContainer.appendChild(description);

        filteredData.forEach(item => {
            const dataItem = document.createElement('div');
            dataItem.classList.add('data-item');
            dataItem.innerHTML = `
        <h4>Date: ${item.date}</h4>
        <p><strong>CPI Value:</strong> ${item.value}</p>`;
            dataContainer.appendChild(dataItem);
        });

        // Clear existing preview and insert the new data
        document.getElementById('data-preview').innerHTML = '';
        document.getElementById('data-preview').appendChild(dataContainer);

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('data-preview').innerHTML = `
            <div class="error">
                <h3>There was an error retrieving the data. Please try again later.</h3>
            </div>`;
    }
});
// Handle form submission (to generate a table based on selected data type and time)
document.getElementById('data-form').onsubmit = function (event) {
    document.getElementById('chart').innerHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><canvas id="myChart"></canvas>';
    document.getElementById('clear-btn').click();
    event.preventDefault();
    if (filteredData.length === 0) {
        alert('No data picked yet');
        return;
    }
    const labels = filteredData.map(entry => entry.date);
    const data = filteredData.map(entry => entry.value);

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'CPI',
                data: data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'CPI Over Time'
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'CPI'
                    },
                    beginAtZero: false
                }
            }
        }
    });
    data_modal.style.display = 'none';
};

///////////////////////////////
// Show the current GDP Data//
//////////////////////////////
const homeData = document.getElementById('homeButton');
if (homeData) {
    homeData.addEventListener('click', () => {
        window.location.href = "index.html";
    });
}

const gdpData = document.getElementById('gdpButton');
if (gdpData) {
    gdpData.addEventListener('click', () => {
        window.location.href = "gdp.html";
    });
}

const cpiData = document.getElementById('cpiButton');
if (cpiData) {
    cpiData.addEventListener('click', () => {
        window.location.href = "cpi.html";
    });
}

const pceData = document.getElementById('pceButton');
if (pceData) {
    pceData.addEventListener('click', () => {
        window.location.href = "usd.html";
    });
}

const fedData = document.getElementById('fedButton');
if (fedData) {
    fedData.addEventListener('click', () => {
        window.location.href = "fed.html";
    });
}
document.getElementById("clear-btn").addEventListener('click', () => { 
    document.getElementById('chart').innerHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><canvas id="myChart"></canvas>';
});
const dateInput = document.getElementById('graph-end-date');
const today = new Date().toISOString().split('T')[0];
dateInput.max = today;
const dateInput2 = document.getElementById('data-end-date');
dateInput2.max = today;