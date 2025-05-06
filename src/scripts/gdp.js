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
function loadSettings() {
    const saved = JSON.parse(localStorage.getItem("userSettings"));
    
    if (saved) {
        // Apply dark mode
        document.body.classList.toggle("dark-mode", saved.darkMode);

        // Apply base theme color
        const baseColor = saved.color || "#3498db"; // Default blue if no color saved
        document.documentElement.style.setProperty('--theme-color', baseColor);
  
        // Generate and apply modified color variants
        const headerBg = darkenColor(baseColor, 20);  // Darken by 20%
        const sidebarBg = darkenColor(baseColor, 10); // Darken by 10%
        const cardBg = lightenColor(baseColor, 25);  // Lighten by 25%
  
        // Set the calculated colors
        document.documentElement.style.setProperty('--header-bg', headerBg);
        document.documentElement.style.setProperty('--sidebar-bg', sidebarBg);
        document.documentElement.style.setProperty('--card-bg', cardBg);
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
    let start_date = document.getElementById('data-start-date').value;
    let end_date = document.getElementById('data-end-date').value;
    return [start_date, end_date]
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

    // Example for pulling USD to EUR exchange rate
    const url = `https://www.alphavantage.co/query?function=REAL_GDP&interval=quarterly&apikey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data['data']) {
            document.getElementById('data-preview').innerHTML = `
        <div class="error">
            <h3>Error: GDP data could not be retrieved.</h3>
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
        const dataContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.innerHTML = `US GDP Data (${startDate} to ${endDate})`;
        dataContainer.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = `This data shows quarterly real GDP in billions of chained 2012 dollars.`;
        dataContainer.appendChild(description);

        timeSeries.forEach(item => {
            const dataItem = document.createElement('div');
            dataItem.classList.add('data-item');
            dataItem.innerHTML = `
        <h4>Date: ${item.date}</h4>
        <p><strong>GDP (Billions USD):</strong> ${item.value}</p>`;
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
document.getElementById('graph-form').onsubmit = function (event) {
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
document.getElementById('data-form').onsubmit = function (event) {
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
    window.location.href = "index.html";
});

const gdpData = document.getElementById('gdpButton');
gdpData.addEventListener('click', () => {
    window.location.href = "gdp.html";
});

const cpiData = document.getElementById('cpiButton');
cpiData.addEventListener('click', () => {
    window.location.href = "cpi.html";
});

const pceData = document.getElementById('pceButton');
pceData.addEventListener('click', () => {
    window.location.href = "usd.html";
});

const fedData = document.getElementById('fedButton');
fedData.addEventListener('click', () => {
    window.location.href = "fed.html";
});
