/**
 * JavaScript code for defined helper functions.
 * 
 * Author(s): Andrew Cramer, 
 */

function getData() {
    let all_data = [];
    const stored_data = localStorage.getItem('data-entries');
    if (stored_data) {
        all_data = JSON.parse(stored_data);
    }
    return all_data;
}

function loadSettings() {
    const saved = JSON.parse(localStorage.getItem('userSettings'));
    
    if (saved) {
        // Apply dark mode
        document.body.classList.toggle('dark-mode', saved.darkMode);

        // Apply base theme color
        const baseColor = saved.color || '#4e6c8b'; // Default blue if no color saved
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

// This is an awesome date comparing method.
function dateComparison(start, end, culprit) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const culpritDate = new Date(culprit);

    if (culpritDate >= startDate && culpritDate <= endDate) {
        return true;
    } else {
        return false;
    }
}

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

// Helper function to sort tables by columns
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

// Makes table sortable by columns
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
  
            headers.forEach(h => h.textContent = h.textContent.replace(/[\u25B2\u25BC]/g, '').trim()); // Unicodes for up and down arrows
            header.textContent += direction === 'asc' ? ' ▲' : ' ▼'; // Arrows will be displayed
  
            sortTableByColumn(table, index, direction === 'asc'); // Start with ascending
        });
    });
}

// Wait for table to be created, in the case of a very slow table-display time
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
