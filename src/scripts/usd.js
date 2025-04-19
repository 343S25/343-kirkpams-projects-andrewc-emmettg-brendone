/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, 
 */

/**
 *   TODO88  dP"Yb   I888b.   dP"Yb     - do fetch() somewhere
 *     I8   dP   Yb  I8  Yb  dP   Yb    - create at least a second HTML page for some capability (could be for add-entry | import | export | settings)
 *     I8   8     8  I8   8  8     8    - Fill out HTML Project Report Page HTML (MAYBE? need to make accessible from index.html?)
 *     I8   Yb   dP  I8  dP  Yb   dP    - Include and image somewhere (saved to images file), with alt text
 *     I8    YbodP   I888P'   YbodP     - Format all paragraphs in a serifed font (titles remain in sans-serif)
 *                                      - Include link(s) to external site(s) somewhere
 *                                      - !Significantly less important! Properly format and sort styling in css files
 */

// Get modal and button
const graph_modal = document.getElementById('graph-modal');
const data_modal = document.getElementById('data-modal');

// Show the graph modal when the "Graph Display" button is clicked
document.getElementById('btn-graph-display').addEventListener('click', () => {
    graph_modal.style.display = 'block';
});

// Show the data modal when the "Data Display" button is clicked
document.getElementById('btn-data-display').addEventListener('click', () => {
    data_modal.style.display = 'block';
});

// Close the graph modal when the "X" button is clicked
document.getElementById('close-graph-modal').addEventListener('click', () => {
    graph_modal.style.display = 'none';
});

// Close the data modal when the "X" button is clicked
document.getElementById('close-data-modal').addEventListener('click', () => {
    data_modal.style.display = 'none';
});

// Close the graph or data modal if user clicks outside of it
window.onclick = function(event) {
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


// Show the hidden data dropdown if needed
const ddataSelect = document.getElementById('data-data-select');
const dtypeSelectGroup = document.getElementById('data-type-select-group');
function setDefaultDateRange(startId, endId, daysBack = 30) {
    const endDateInput = document.getElementById(endId);
    const startDateInput = document.getElementById(startId);

    const today = new Date();
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - daysBack);

    // Format to YYYY-MM-DD
    const format = (date) => date.toISOString().split('T')[0];

    endDateInput.value = format(today);
    startDateInput.value = format(priorDate);

    // Set min/max logic
    endDateInput.min = format(priorDate);
    startDateInput.max = format(today);
}

// Apply to both forms
setDefaultDateRange('graph-start-date', 'graph-end-date');
setDefaultDateRange('data-start-date', 'data-end-date');

// Prevent submission if dates invalid
function syncDatePickers(startInput, endInput) {
    const start = document.getElementById(startInput);
    const end = document.getElementById(endInput);

    start.addEventListener('change', () => {
        end.min = start.value;
    });

    end.addEventListener('change', () => {
        start.max = end.value;
    });
}

// Apply to both modals
syncDatePickers('graph-start-date', 'graph-end-date');
syncDatePickers('data-start-date', 'data-end-date');
const apiKey = 'J380G8OUFNIX2MUM';
function pull_graph_data() {
    let graph = document.getElementById('graph-type').value;
    let data = document.getElementById('graph-data-select').value; // Get the graph data selection type
    if (data == 'data-type') {
        data = document.getElementById('graph-entry-type').value; // Sets the actual graph data type 
    }
    let start_date = document.getElementById('graph-start-date').value;
    let end_date = document.getElementById('graph-end-date').value;
    return [graph, data, start_date, end_date]
}

function pull_data_data() {
    let seriesId = 'USA';
    let start_date = document.getElementById('data-start-date').value;
    let end_date = document.getElementById('data-end-date').value;
    return [seriesId, start_date, end_date]
}

// Load graph into preview display
document.getElementById('btn-graph-preview').addEventListener('click', () => {
    const start = document.getElementById('graph-start-date').value;
    const end = document.getElementById('graph-end-date').value;
    if ((start && end) && (start > end || end < start)) {
        document.getElementById('graph-preview').textContent = 'Invalid date range: Start date must precede end date.';
        return;
    }
    let info = pull_graph_data();
    document.getElementById('graph-preview').innerHTML = `Will be a Graph of:<br>Graph Type Selected: ${info[0]}<br>Data Type Selected: ${info[1]}<br>Over Time From ${info[2]} to ${info[3]}`;
});

// Load data into preview display
document.getElementById('btn-data-preview').addEventListener('click', async () => {
    // Get start and end dates from the input fields
    const [seriesId, startDate, endDate] = pull_data_data();

    // Validate date range
    if (startDate && endDate && (startDate > endDate || endDate < startDate)) {
        alert('Invalid date range: Start date must precede end date.');
        return;
    }

    // Set the Alpha Vantage API key
    const apiKey = 'your_alpha_vantage_api_key';
    
    // Example for pulling USD to EUR exchange rate
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=EUR&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if data is valid and available
        if (!data['Time Series FX (Daily)']) {
            document.getElementById('data-preview').innerHTML = `
                <div class="error">
                    <h3>Error: Data could not be retrieved.</h3>
                </div>`;
            return;
        }

        // Extract and filter the data based on the date range
        const timeSeries = data['Time Series FX (Daily)'];
        const filteredData = Object.entries(timeSeries)
            .filter(([date, value]) => {
                return date >= startDate && date <= endDate;
            })
            .map(([date, value]) => {
                return {
                    date: date,
                    value: value['4. close'] // Closing exchange rate value for USD to EUR
                };
            });

        // If no data found for the date range
        if (filteredData.length === 0) {
            document.getElementById('data-preview').innerHTML = `
                <div class="no-data">
                    <h3>No Data Found for the Selected Date Range.</h3>
                </div>`;
            return;
        }

        // Add reference to USD and the Metric (USD to EUR in this example)
        const metricName = 'USD to EUR Exchange Rate';
        const currencySymbol = 'EUR'; // Adjust to the target currency symbol

        // Display filtered data in a pretty format
        const dataContainer = document.createElement('div');
        dataContainer.classList.add('data-container');

        // Add a title and description
        const title = document.createElement('h3');
        title.innerHTML = `USD: ${metricName} Data (${startDate}-${endDate})`;
        dataContainer.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = `This data shows the daily exchange rate between USD and EUR for the specified date range.`;
        dataContainer.appendChild(description);

        // Display each data item
        filteredData.forEach(item => {
            const dataItem = document.createElement('div');
            dataItem.classList.add('data-item');
            dataItem.innerHTML = `
                <h4>Date: ${item.date}</h4>
                <p><strong>Value (${currencySymbol}):</strong> ${item.value}</p>
            `;
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

// Handle form submission (to generate a graph based on selected graph type, data type, and time)
document.getElementById('graph-form').onsubmit = function(event) {
    event.preventDefault();
    const start = document.getElementById('graph-start-date').value;
    const end = document.getElementById('graph-end-date').value;
    if ((start && end) && (start > end || end < start)) {
        alert('Invalid date range: Start date must precede end date.');
        return;
    }
    const info = pull_graph_data();
    document.getElementById('temp-content').innerHTML = `Will be a Graph of:<br>Graph Type Selected: ${info[0]}<br>Data Type Selected: ${info[1]}`;
    console.log(`Graph Type Selected: ${info[0]}`);
    console.log(`Data Type Selected: ${info[1]}`);
    console.log(`Start Date: ${info[2]}`);
    console.log(`End Date: ${info[3]}`);
    // TODO add functionality to dynamically generate a graph
    // Research using Chart.js or another graphing library
    graph_modal.style.display = 'none';
}

// Handle form submission (to generate a table based on selected data type and time)
document.getElementById('data-form').onsubmit = function(event) {
    event.preventDefault();
    const start = document.getElementById('data-start-date').value;
    const end = document.getElementById('data-end-date').value;
    if ((start && end) && (start > end || end < start)) {
        alert('Invalid date range: Start date must precede end date.');
        return;
    }
    const info = pull_data_data();
    document.getElementById('temp-content').innerHTML = `Will be the Data display of:<br>Data Type Selected: ${info[0]}<br>Over Time From ${info[1]} to ${info[2]}`;
    console.log(`Data Type Selected: ${info[0]}`);
    console.log(`Start Date: ${info[1]}`);
    console.log(`End Date: ${info[2]}`);
    data_modal.style.display = 'none';
}
///////////////////////////////
//////// Navigation Menu //////
//////////////////////////////
const homeData = document.getElementById('homeButton');
homeData.addEventListener('click', () => {
    window.location.href = "/src/index.html";
});
const gdpData = document.getElementById('gdpButton');
gdpData.addEventListener('click', () => {
    window.location.href = "/src/gdp.html";
});
const cpiData = document.getElementById('cpiButton');
cpiData.addEventListener('click', () => {
    window.location.href = "/src/cpi.html";
});
const pceData = document.getElementById('pceButton');
pceData.addEventListener('click', () => {
    window.location.href = "/src/pce.html";
});
const fedData = document.getElementById('fedButton');
fedData.addEventListener('click', () => {
    window.location.href = "/src/fed.html";
});
