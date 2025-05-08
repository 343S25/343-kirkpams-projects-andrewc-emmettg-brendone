/**
 * JavaScript code for handling data button, data modal, and data display.
 * 
 * Author: Andrew Cramer
 */

// Show the data modal when the "Data Display" button is clicked
document.getElementById('btn-data-display').addEventListener('click', () => {
    data_modal.style.display = 'block';
});

// Close the data modal when the "X" button is clicked
document.getElementById('close-data-modal').addEventListener('click', () => {
    data_modal.style.display = 'none';
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

// Set default dates for data form
setDefaultDateRange('data-start-date', 'data-end-date');
syncDatePickers('data-start-date', 'data-end-date');

// Pulls data information as a list object
function pull_data_data() {
    let data = document.getElementById('data-data-select').value; // Get the data selection type
    if (data == 'data-type') {
        data = document.getElementById('data-entry-type').value; // Sets the actual data type 
    }
    let start_date = document.getElementById('data-start-date').value;
    let end_date = document.getElementById('data-end-date').value;
    return {type: data, start: start_date, end: end_date}
}

// Data preview
document.getElementById('btn-data-preview').addEventListener('click', () => {
    const data_preview = document.getElementById('data-preview');
    let info = pull_data_data();
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
