/**
 * JavaScript code for handling import button and appending to localStorage.
 * 
 * Author: Andrew Cramer
 */

// When import clicked
document.getElementById('btn-import').addEventListener('click', async () => {
    // Create a file input element programmatically
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // Only allow .json files

    // Listen for file selection
    input.addEventListener('change', async () => {
        const file = input.files[0];
        
        if (file) {
            try {
                // Read the selected file
                const reader = new FileReader();
                
                // When the file is read, handle the data
                reader.onload = function(e) {
                    const fileContent = e.target.result; // The file content as a string
                    
                    try {
                        // Parse the JSON content
                        const parsedData = JSON.parse(fileContent);
                        
                        // Check if the file has the correct structure
                        if (parsedData.metadata && parsedData.entries) {
                            // Get existing data from localStorage
                            let existingData = JSON.parse(localStorage.getItem('data-entries') || '[]');

                            // Append new entries to existing data
                            JSON.parse(parsedData.entries).forEach(entry => { existingData = existingData.concat(entry) });

                            // Save back to localStorage
                            localStorage.setItem('data-entries', JSON.stringify(existingData));

                            alert("Data imported and appended successfully!");
                            console.log("Updated data:", existingData);
                        } else {
                            alert("Invalid data structure. Missing 'metadata' or 'entries'.");
                        }
                    } catch (err) {
                        alert("Error parsing JSON file. Please check the file format.");
                    }
                };
                
                // Start reading the file as text
                reader.readAsText(file);
            } catch (err) {
                alert("Error reading file.");
            }
        } else {
            alert("No file selected.");
        }
    });

    // Trigger the file input click to open the file picker dialog
    input.click();
});
