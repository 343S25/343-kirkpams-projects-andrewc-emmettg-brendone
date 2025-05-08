/**
 * JavaScript code for handling button actions and display controls for main page index.html
 * 
 * Author(s): Andrew Cramer, 
 */
  
window.onload = loadSettings;

const graph_modal = document.getElementById('graph-modal');
const data_modal = document.getElementById('data-modal');
const entry_modal = document.getElementById('entry-modal');

// Close the graph, data, or entry modals if user clicks out of scope
window.onclick = function(event) {
    if (event.target == graph_modal) {
        graph_modal.style.display = 'none';
    } else if (event.target == data_modal) {
        data_modal.style.display = 'none';
    } else if (event.target == entry_modal) {
        entry_modal.style.display = 'none';
    }
}

// Clear display zone
document.getElementById("clear-btn").addEventListener('click', () => { 
    document.getElementById('chart').innerHTML = '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><canvas id="myChart"></canvas>';
});

// Page linking buttons
document.getElementById('btn-gdp').addEventListener('click', () => { window.location.href = "gdp.html" });
document.getElementById('btn-cpi').addEventListener('click', () => { window.location.href = "cpi.html" });
document.getElementById('btn-pce').addEventListener('click', () => { window.location.href = "usd.html" });
document.getElementById('btn-fed').addEventListener('click', () => { window.location.href = "fed.html" });
document.getElementById('btn-settings').addEventListener('click', () => { window.location.href = "settings.html" });
