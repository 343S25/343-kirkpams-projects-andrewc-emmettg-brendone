/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, BRENDON ELMORE
 */

window.onload = loadSettings;

// Get data modal
const data_modal = document.getElementById('data-modal');
// Filtered data array
let filteredData = [];
// apiKey
const apiKey = 'MRWAWS3RRAUEQWZ3';

// Show the data modal when the "Data Display" button is clicked
document.getElementById('btn-data-display').addEventListener('click', () => {
    data_modal.style.display = 'block';
});

// Close the data modal when the "X" button is clicked
document.getElementById('close-data-modal').addEventListener('click', () => {
    data_modal.style.display = 'none';
});

// Close the data modal if user clicks outside of it
window.onclick = function (event) { if (event.target == data_modal) { data_modal.style.display = 'none' } }

// Apply date modifications
setDefaultDateRange('data-start-date', 'data-end-date', 365);
syncDatePickers('data-start-date', 'data-end-date');

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
    const url = `https://www.alphavantage.co/query?function=FEDERAL_FUNDS_RATE&interval=monthly&apikey=${apiKey}`; 
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (!data['data']) {
            document.getElementById('data-preview').innerHTML = `
        <div class="no-data">
            <h3>Error: The FED rate data could not be retrieved.</h3>
        </div>`;
            return;
        }
        const timeSeries = data['data'];


        // If no data found for the date range
        if (timeSeries.length === 0) {
            document.getElementById('data-preview').innerHTML = `
                <div class="no-data">
                    <h3>No Data Found for the Selected Date Range.</h3>
                </div>`;
            return;
        }
        filteredData = timeSeries
            .filter(item => item.date >= startDate && item.date <= endDate)
            .map((item => {
                return {
                    date: item.date,
                    value: parseFloat(item.value)
                }
            }))
            .reverse();
        const dataContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.innerHTML = `FED Rate Data (${startDate} to ${endDate})`;
        dataContainer.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = `This data shows the Federal Reserve interest rate (FED rate) over time.`;
        dataContainer.appendChild(description);

        timeSeries.forEach(item => {
            const dataItem = document.createElement('div');
            dataItem.classList.add('data-item');
            dataItem.innerHTML = `
        <h4>Date: ${item.date}</h4>
        <p><strong>Fed Rate:</strong> ${item.value}</p>`;
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

// Handle form submission
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
                label: 'FED Rate',
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
                    text: 'FED Rate Over Time'
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
                        text: 'Fed Rate %'
                    },
                    beginAtZero: false
                }
            }
        }
    });
    data_modal.style.display = 'none';
};

// Nav button linking
document.getElementById('homeButton').addEventListener('click', () => { window.location.href = "index.html" });
document.getElementById('gdpButton').addEventListener('click', () => { window.location.href = "gdp.html" });
document.getElementById('cpiButton').addEventListener('click', () => { window.location.href = "cpi.html" });
document.getElementById('pceButton').addEventListener('click', () => { window.location.href = "usd.html" });

document.getElementById("clear-btn").addEventListener('click', () => {
    document.getElementById('chart').innerHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><canvas id="myChart"></canvas>';
});

const today = new Date().toISOString().split('T')[0];
const dateInput2 = document.getElementById('data-end-date');
dateInput2.max = today;
