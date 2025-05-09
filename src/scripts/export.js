/**
 * JavaScript code for handling export button and downloading localStorage data.
 * 
 * Author: Andrew Cramer
 */

// When export clicked
document.getElementById('btn-export').addEventListener('click', () => {
    dataEntries = localStorage.getItem('data-entries');
    const metadata = {
        // Only export date stored in metadata
        export_date: new Date().toISOString()
    };
    
    const data = {
        metadata: metadata,
        entries: dataEntries
    }

    const jsonDataStr = JSON.stringify(data, null, 2); // nicer format than default JSON.stringify
    const blob = new Blob([jsonDataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pbv_entries_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    // Removing temporary element and link
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});