/**
 * JavaScript code for handling button actions and display controls for settings page settings.html
 * 
 * Author(s): Andrew Cramer
 */

// Apply settings to the page
function applySettings(settings) {
    document.getElementById('themeColor').value = settings.color || '#3498db';
    document.getElementById('darkMode').checked = settings.darkMode || false;
  
    // Apply dark mode class to body
    document.body.classList.toggle('dark-mode', settings.darkMode);
  
    // Apply theme color as CSS variable (if needed in UI)
    document.documentElement.style.setProperty('--theme-color', settings.color);
}
  
// Save settings to localStorage and apply them
document.getElementById('btn-save-settings').addEventListener('click', () => {
    const color = document.getElementById('themeColor').value;
    const darkMode = document.getElementById('darkMode').checked;

    const settings = { color, darkMode };
    localStorage.setItem('userSettings', JSON.stringify(settings));
  
    applySettings(settings);
    alert('Settings saved!');
});
  
// Reset settings to default values
document.getElementById('btn-reset-settings').addEventListener('click', () => {
    localStorage.removeItem('userSettings');
  
    const defaultSettings = {
        color: '#3498db',
        darkMode: false
    };
  
    applySettings(defaultSettings);
    alert('All settings reset.');
});
  
// Load settings on page load
function loadSettings() {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
        applySettings(JSON.parse(saved));
    }
}
  
// Live toggle dark mode on checkbox change
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    document.getElementById('darkMode').addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', document.getElementById('darkMode').checked);
    });
});

// Home button
document.getElementById('btn-home').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Reset data button
document.getElementById('btn-reset-data').addEventListener('click', () => {
    const confirmation = confirm(`Confirm you wish to delete all data entries?\n`);
    if (!confirmation) return; // Stop submission if user cancels
    localStorage.removeItem('data-entries');
});
