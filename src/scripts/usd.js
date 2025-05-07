/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, 
 */

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem("userSettings"));
    
    if (saved) {
        // Apply dark mode
        document.body.classList.toggle("dark-mode", saved.darkMode);

        // Apply base theme color
        const baseColor = saved.color || "#4e6c8b"; // Default blue if no color saved
        document.documentElement.style.setProperty('--theme-color', baseColor);
  
        // Generate and apply modified color variants
        const headerBg = darkenColor(baseColor, 20);  // Darken by 20%
        const sidebarBg = darkenColor(baseColor, 10); // Darken by 10%
        const hoverBg = lightenColor(baseColor, 25);  // Lighten by 25%
        const cardBg = lightenColor(baseColor, 90); // Lighten by 90%
  
        // Set the calculated colors
        document.documentElement.style.setProperty('--header-bg', headerBg);
        document.documentElement.style.setProperty('--sidebar-bg', sidebarBg);
        document.documentElement.style.setProperty('--hover-bg', hoverBg);
        document.documentElement.style.setProperty('--card-bg', cardBg)
    }
}
  
function darkenColor(hex, percent) {
    let color = hex.slice(1); // Remove the '#'
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
  
    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));
  
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
  
function lightenColor(hex, percent) {
    let color = hex.slice(1); // Remove the '#'
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
  
    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
  
function toHex(value) {
    let hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
  
window.onload = loadSettings;

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
