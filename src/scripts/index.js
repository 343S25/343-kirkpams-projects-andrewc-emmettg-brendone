/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, 
 */

// Get modals
const graph_modal = document.getElementById('graph-modal');
const data_modal = document.getElementById('data-modal');
const entry_modal = document.getElementById('entry-modal');

// Show the graph modal when the "Graph Display" button is clicked
document.getElementById('btn-graph-display').addEventListener('click', () => {
    graph_modal.style.display = 'block';
});

// Show the data modal when the "Data Display" button is clicked
document.getElementById('btn-data-display').addEventListener('click', () => {
    data_modal.style.display = 'block';
});

// Show the entry modal when the "Add Entry" buton is clicked
document.getElementById('btn-add-entry').addEventListener('click', () => {
    entry_modal.style.display = 'block';
});

// Close the graph modal when the "X" button is clicked
document.getElementById('close-graph-modal').addEventListener('click', () => {
    graph_modal.style.display = 'none';
});

// Close the data modal when the "X" button is clicked
document.getElementById('close-data-modal').addEventListener('click', () => {
    data_modal.style.display = 'none';
});

// Close the entry modal when the "X" button is clicked
document.getElementById('close-entry-modal').addEventListener('click', () => {
    entry_modal.style.display = 'none';
});

// Close the graph or data modal if user clicks outside of it
window.onclick = function(event) {
    if (event.target == graph_modal) {
        graph_modal.style.display = 'none';
    }
    if (event.target == data_modal) {
        data_modal.style.display = 'none';
    }
    if (event.target == entry_modal) {
        entry_modal.style.display = 'none';
    }
}

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

// Show the hidden data dropdown if needed
const ddataSelect = document.getElementById('data-data-select');
const dtypeSelectGroup = document.getElementById('data-type-select-group');
ddataSelect.addEventListener('change', () => {
    if (ddataSelect.value == 'data-type') {
        dtypeSelectGroup.style.display = 'flex';
    } else {
        dtypeSelectGroup.style.display = 'none';
    }
});

// Dynamically generate subtype options from type
const typeSelect = document.getElementById('entry-type');
const subtypeSelect = document.getElementById('entry-subtype');
typeSelect.addEventListener('change', () => {
    switch (typeSelect.value){
        case 'food':
            subtypeSelect.innerHTML = 
                '<option value="groceries" selected>Groceries</option>' + 
                '<option value="dining-out">Dining Out</option>' +
                '<option value="fast-food">Fast Food</option>';
            break;
        case 'transport':
            subtypeSelect.innerHTML = 
                '<option value="gas" selected>Gas</option>' +
                '<option value="public-fare">Public Transit Fare</option>' +
                '<option value="private-fare">Ridshare/Taxi Fare</option>' +
                '<option value="air-fare">Air Fare</option>';
            break;
        case 'living': 
            subtypeSelect.innerHTML = 
                '<option value="rent" selected>Rent</option>' +
                '<option value="utilities">Utilities</option>' +
                '<option value="maintenance">Maintenance</option>';
            break;
        case 'bills':
            subtypeSelect.innerHTML = 
                '<option value="credit-card-bill" selected>Credit Card</option>' +
                '<option value="insurance-bill">Insurance</option>' +
                '<option value="loan-bill">Loan</option>' +
                '<option value="phone-bill">Phone</option>' +
                '<option value="internet-bill">Internet</option>';
            break;
        case 'entertainment':
            subtypeSelect.innerHTML =
                '<option value="events" selected>Events</option>' +
                '<option value="streaming">Streaming</option>' +
                '<option value="games">Games</option>' +
                '<option value="gifts">Gifts</option>' +
                '<option value="vacation">Vacation</option>';
            break;
        case 'income':
            subtypeSelect.innerHTML =
                '<option value="salary" selected>Salary</option>' +
                '<option value="investment">Investments</option>';
            break;
        case 'other': 
            subtypeSelect.innerHTML = '<option value="other" selected>Other</option>';
            break;
        default:
            console.log('ERROR - THIS SHOULD NEVER HAPPEN'); // TODO delete before final submission
            break;
    }
});

// Function to format date to YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// Set default range for dates
function setDefaultDateRange(startId, endId, daysBack = 30) {
    const endDateInput = document.getElementById(endId);
    const startDateInput = document.getElementById(startId);

    const today = new Date();
    today.setDate(today.getDate() - 1) // adjust today by 1
    const priorDate = new Date();
    priorDate.setDate(today.getDate() - daysBack);

    endDateInput.value = formatDate(today);
    startDateInput.value = formatDate(priorDate);

    // Set min/max logic
    endDateInput.min = formatDate(priorDate);
    startDateInput.max = formatDate(today);
}

// Apply to both graph and data forms
setDefaultDateRange('graph-start-date', 'graph-end-date');
setDefaultDateRange('data-start-date', 'data-end-date');

// Set default entry date to today
document.addEventListener('DOMContentLoaded', () => {
    const entryDateInput = document.getElementById('entry-date');
    if (entryDateInput) {
        const today = new Date();
        today.setDate(today.getDate() - 1) // adjust today by 1
        entryDateInput.value = formatDate(today);
    }
});

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

// Apply to both graph and data modals
syncDatePickers('graph-start-date', 'graph-end-date');
syncDatePickers('data-start-date', 'data-end-date');

// Pulls graph information as a list object
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

// Pulls data information as a list object
function pull_data_data() {
    let data = document.getElementById('data-data-select').value; // functions as above
    if (data == 'data-type') {
        data = document.getElementById('data-entry-type').value;
    }
    let start_date = document.getElementById('graph-start-date').value;
    let end_date = document.getElementById('graph-end-date').value;
    return [data, start_date, end_date]
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
document.getElementById('btn-data-preview').addEventListener('click', () => {
    const start = document.getElementById('data-start-date').value;
    const end = document.getElementById('data-end-date').value;
    if ((start && end) && (start > end || end < start)) {
        document.getElementById('data-preview').textContent = 'Invalid date range: Start date must precede end date.';
        return;
    }
    let info = pull_data_data();
    document.getElementById('data-preview').innerHTML = `Will be the Data display of:<br>Data Type Selected: ${info[0]}<br>Over Time From ${info[1]} to ${info[2]}`;
});

// Handle graph form submission (to generate a graph based on selected graph type, data type, and time)
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

// Handle data form submission (to generate a table based on selected data type and time)
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

// Handle entry form submission (to generate an entry based on input fields)
document.getElementById('entry-form').onsubmit = function(event) {
    event.preventDefault();
    console.log('Added some new data');
    entry_modal.style.display = 'none';
}

const amountInput = document.getElementById('entry-amount');
// Formatting the amount within the entry modal
if (amountInput) {
    // Allow only valid decimal numbers
    amountInput.addEventListener('input', () => {
        // Use a UNIX Regular Expressoion to remove any rejected characters
        amountInput.value = amountInput.value.replace(/[^0-9.]/g, '');      
        // Ensure there's only one decimal point
        const parts = amountInput.value.split('.');
        if (parts.length > 2) {
            amountInput.value = parts[0] + '.' + parts[1]; // Drops remaining decimal part
        }
    });
    // Format to 2 decimals with commas when in blur
    amountInput.addEventListener('blur', () => {
        let value = parseFloat(amountInput.value);
        if (!isNaN(value)) {
            amountInput.value = value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    });

    // Clean value before submit (remove commas)
    document.getElementById('entry-form').addEventListener('submit', function () {
        amountInput.value = amountInput.value.replace(/,/g, '');
    });
}
