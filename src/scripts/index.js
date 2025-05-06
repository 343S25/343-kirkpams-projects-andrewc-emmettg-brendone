/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, 
 */

// TODO Andrew will refactor the index.js once all funcitonality works.
//      - modals will have their own scripts.
//      - make the comments and formatting cleaner


// All data, memory persists in localStorage

function getData(){
    let all_data = [];
    const stored_data = localStorage.getItem('data-entries');
    if (stored_data) {
        all_data = JSON.parse(stored_data);
    }
    return all_data;
}

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

// Dynamically generate inner subtypes for list
document.addEventListener("DOMContentLoaded", () => {
    // Subtypes for each type, their values will be lowercase with '-' replacing ' '.
    const typeToSubtypes = {
        food: ["Groceries", "Dining Out", "Fast Food"],
        transport: ["Gas", "Public Transit", "Car Maintenance", "Ride Share"],
        living: ["Rent", "Mortgage", "Furnishings", "Home Supplies"],
        bills: ["Electric", "Water", "Internet", "Phone", "Insurance"],
        entertainment: ["Streaming", "Games", "Events", "Hobbies"],
        income: ["Salary", "Investments", "Other Income"],
        other: ["Miscellaneous", "One-time", "Uncategorized"]
    };

    const typeSelect = document.getElementById("entry-type");
    const subtypeSelect = document.getElementById("entry-subtype");

    function updateSubtypes(selectedType) {
        subtypeSelect.innerHTML = ""; // Clears existing options
        typeToSubtypes[selectedType].forEach(subtype => {
            const option = document.createElement("option");
            option.value = subtype.toLowerCase().replace(/ /g, "-");
            option.textContent = subtype;
            subtypeSelect.appendChild(option);
        });
    }

    updateSubtypes(typeSelect.value);

    // Update subtypes on type change
    typeSelect.addEventListener("change", () => {
        updateSubtypes(typeSelect.value);
    });

    // Clear Display Zone
    document.getElementById("clear-btn").addEventListener('click', () => { 
        document.getElementById('chart').innerHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><canvas id="myChart"></canvas>';
    });

    // Generate Graph
    document.getElementById("submit-graph-form").addEventListener('click', () => {
        document.getElementById("clear-btn").click(); // clears display
        const ctx = document.getElementById('myChart');

        let info = pull_graph_data();
        console.log(pull_graph_data());
        let filtered = [];
        let all_of_the_data = getData();
        all_of_the_data.forEach(entry => {
        if (entry.date <= info.end && entry.date >= info.start && (info.type == 'data-all' || info.type == entry.category.type)) {
            filtered.push(entry);
            }
        });
        all_of_the_data = filtered;

        let allLabels = [];
        let allNumData = [];
        let totalNumData = 0;

        all_of_the_data.forEach((data) => {
            allLabels.push(data['category']['type']);
             
            let temp = data['amount'].split(',');
            totalNumData += parseFloat(temp);
            allNumData.push(temp);
        })

        let numsOuttaHunnid = []
        allNumData.forEach((numdata) => {
            numsOuttaHunnid.push(numdata/totalNumData);
        })

        console.log(all_of_the_data);

        console.log(allLabels);
        console.log(allNumData);
        console.log(numsOuttaHunnid);

        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: allLabels,
            datasets: [{
              label: '# of Total Expendatures',
              data: numsOuttaHunnid,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }}}});
    })
});

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
if (ddataSelect.value == 'data-type') dtypeSelectGroup.style.display = 'flex';

const formatDate = (date) => date.toISOString().split('T')[0];
function setDefaultDateRange(startId, endId, daysBack = 30) {
    const endDateInput = document.getElementById(endId);
    const startDateInput = document.getElementById(startId);

    const today = new Date();
    today.setDate(today.getDate());
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
        today.setDate(today.getDate());
        entryDateInput.value = formatDate(today);
    }

    //Dynamically generates inner-subtypes for lists:
    const typeToSubtypes = {
        food: ["Groceries", "Dining Out", "Fast Food"],
        transport: ["Gas", "Public Transit", "Car Maintenance", "Ride Share"],
        living: ["Rent", "Mortgage", "Furnishings", "Home Supplies"],
        bills: ["Electric", "Water", "Internet", "Phone", "Insurance"],
        entertainment: ["Streaming", "Games", "Events", "Hobbies"],
        income: ["Salary", "Investments", "Other Income"],
        other: ["Miscellaneous", "One-time", "Uncategorized"]
    };
    // Subtypes above are listed for each type, their values will be lowercase with '-' replacing ' '.

    const typeSelect = document.getElementById("entry-type");
    const subtypeSelect = document.getElementById("entry-subtype");

    function updateSubtypes(selectedType) {
        subtypeSelect.innerHTML = ""; // Clears existing options
        typeToSubtypes[selectedType].forEach(subtype => {
            const option = document.createElement("option");
            option.value = subtype.toLowerCase().replace(/ /g, "-"); // Replacing spaces with -, making lowercase.
            option.textContent = subtype;
            subtypeSelect.appendChild(option);
        });
    }
    
    updateSubtypes(typeSelect.value);

    // Update subtypes on type change
    typeSelect.addEventListener("change", () => {
        updateSubtypes(typeSelect.value);
    });
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
    return {type: graph, data: data, start: start_date, end: end_date}
}

// Pulls data information as a list object
function pull_data_data() {
    let data = document.getElementById('data-data-select').value; // functions as above
    if (data == 'data-type') {
        data = document.getElementById('data-entry-type').value;
    }
    let start_date = document.getElementById('data-start-date').value;
    let end_date = document.getElementById('data-end-date').value;
    return {type: data, start: start_date, end: end_date}
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
    const data_preview = document.getElementById('data-preview');
    let info = pull_data_data();
    console.log(info);
    if ((info.start && info.end) && (info.start > info.end || info.end < info.start)) {
        data_preview.textContent = 'Invalid date range: Start date must precede end date.';
        return;
    }
    let filtered = [];
    all_data = getData();
    all_data.forEach(entry => {
        if (entry.date <= info.end && entry.date >= info.start && (info.type == 'data-all' || info.type == entry.category.type)) {
            filtered.push(entry);
        }
    });
    data_preview.textContent = ""; // Reset the display
    if (filtered.length < 1) data_preview.textContent = "No entries found.";
    filtered.forEach(entry => {
        data_preview.textContent += JSON.stringify(entry) + '\n';
    });
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
    // document.getElementById('temp-content').innerHTML = `Will be a Graph of:<br>Graph Type Selected: ${info[0]}<br>Data Type Selected: ${info[1]}`;
    console.log(`Graph Type Selected: ${info[0]}`);
    console.log(`Data Type Selected: ${info[1]}`);
    console.log(`Start Date: ${info[2]}`);
    console.log(`End Date: ${info[3]}`);
    // TODO add functionality to dynamically generate a graph
    // Research using Chart.js or another graphing library
    graph_modal.style.display = 'none';
}

function makeTableSortable(table) {
    if (!table) return;
    const headers = table.querySelectorAll('th');
    let sortDirection = {};
  
    headers.forEach((header, index) => {
      header.style.cursor = 'pointer'; // Pointer cursor to indicate clickable
      header.addEventListener('click', () => {
        const direction = sortDirection[index] === 'asc' ? 'desc' : 'asc'; // Switch ascend/descend sort
        sortDirection = {};
        sortDirection[index] = direction;
  
        headers.forEach(h => h.textContent = h.textContent.replace(/[\u25B2\u25BC]/g, '').trim()); // Unicodes for up and down arrows.
        header.textContent += direction === 'asc' ? ' ▲' : ' ▼'; // Arrows will be displayed
  
        sortTableByColumn(table, index, direction === 'asc'); // Start with ascending
      });
    });
  
    function sortTableByColumn(table, columnIndex, asc = true) {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
  
      rows.sort((a, b) => {
        const valA = a.children[columnIndex].textContent.trim();
        const valB = b.children[columnIndex].textContent.trim();
        // Evaluates non-numeric data
        const parsedA = isNaN(valA) ? valA.toLowerCase() : parseFloat(valA);
        const parsedB = isNaN(valB) ? valB.toLowerCase() : parseFloat(valB);
        return asc ? (parsedA > parsedB ? 1 : -1) : (parsedA < parsedB ? 1 : -1); // Ordering rows
      });
      rows.forEach(row => tbody.appendChild(row)); // Add rows in new order
    }
  }
  
  // Wait for table to be created, in the case of a very slow table-display time.
  function waitForTableAndMakeSortable(table, interval = 200, timeout = 5000) {
    const startTime = Date.now();
    const timer = setInterval(() => {
      if (table) {
        clearInterval(timer);
        makeTableSortable(table);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(timer);
        console.warn(`Table with ID "${table.id}" not found in time.`);
      }
    }, interval);
  }

// Handle data form submission (to generate a table based on selected data type and time)
document.getElementById('data-form').onsubmit = function(event) {
    event.preventDefault();
    const info = pull_data_data();
    if ((info.start && info.end) && (info.start > info.end || info.end < info.start)) {
        alert('Invalid date range: Start date must precede end date.');
        return;
    }
    let filtered = [];
    all_data = getData();
    all_data.forEach(entry => {
        if (entry.date <= info.end && entry.date >= info.start && (info.type == 'data-all' || info.type == entry.category.type)) {
            filtered.push(entry);
        }
    });

    // document.getElementById('temp-content').innerHTML = `Will be the Data display of:<br>Data Type Selected: ${info.type}<br>Over Time From ${info.start} to ${info.end}`;
    console.log(`Data Type Selected: ${info.type}`);
    console.log(`Start Date: ${info.start}`);
    console.log(`End Date: ${info.end}`);
    data_modal.style.display = 'none';

    // Dynamically create the data display table in the display area
    const table = document.createElement('table');
    table.classList.add('styled-table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    const headerRow = document.createElement('tr');
    const th1 = document.createElement('th');
    th1.textContent = 'Type';
    headerRow.appendChild(th1);
    const th2 = document.createElement('th');
    th2.textContent = 'Subtype';
    headerRow.appendChild(th2);
    const th3 = document.createElement('th');
    th3.textContent = 'Amount';
    headerRow.appendChild(th3);
    const th4 = document.createElement('th');
    th4.textContent = 'Date';
    headerRow.appendChild(th4);
    const th5 = document.createElement('th');
    th5.textContent = "Notes"
    headerRow.appendChild(th5);
    thead.appendChild(headerRow);

    filtered.forEach (entry => {
        const row = document.createElement('tr');

        const tdType = document.createElement('td');
        tdType.textContent = entry.category.type;
        row.appendChild(tdType);

        const tdSubtype = document.createElement('td');
        tdSubtype.textContent = entry.category.subtype;
        row.appendChild(tdSubtype);

        const tdAmount = document.createElement('td');
        tdAmount.textContent = entry.amount;
        row.appendChild(tdAmount);

        const tdDate = document.createElement('td');
        tdDate.textContent = entry.date;
        row.appendChild(tdDate);

        const tdNotes = document.createElement('td');
        tdNotes.textContent = entry.notes;
        row.appendChild(tdNotes);

        tbody.appendChild(row);
    });

    if (filtered.length < 1) {
        const row = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = "No entries found."
        td.colSpan = 5;
        row.appendChild(td);
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    document.getElementById('chart').innerHTML = ""; // clears display
    document.getElementById('chart').appendChild(table);
    waitForTableAndMakeSortable(table);
}
///////////////////////////////
// Show the current GDP Data//
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

document.getElementById('btn-settings').addEventListener('click', () => {
    window.location.href = "settings.html";
});


// Handle entry form submission (to generate an entry based on input fields)
document.getElementById('entry-form').onsubmit = function(event) {
    event.preventDefault();

    const type = document.getElementById('entry-type').value;
    const subtype = document.getElementById('entry-subtype').value;
    const amount = document.getElementById('entry-amount').value;
    const date = document.getElementById('entry-date').value;
    const notes = document.getElementById('notes').value || "No notes.";

    const confirmation = confirm(`Confirm adding the following entry?\n\nType: ${type}\nSubtype: ${subtype}\nAmount: ${amount}\nDate: ${date}\nNotes: ${notes}`);

    if (!confirmation) return; // Stop submission if user cancels

    const new_data = {
        category: { type: type, subtype: subtype },
        amount: amount.replace(/,/g, ''), // Ensure clean amount
        date: date,
        notes: notes
    };

    let all_data = getData();
    all_data.push(new_data);
    localStorage.setItem('data-entries', JSON.stringify(all_data));
    console.log('Added some new data:');
    console.log(new_data);
    entry_modal.style.display = 'none';
};

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
