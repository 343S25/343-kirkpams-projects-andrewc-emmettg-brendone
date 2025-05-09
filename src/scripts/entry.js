/**
 * JavaScript code for handling entry button, entry modal, and data-entry parsing.
 * 
 * Author: Andrew Cramer
 */

// Show the entry modal when the "Add Entry" buton is clicked
document.getElementById('btn-add-entry').addEventListener('click', () => {
    entry_modal.style.display = 'block';
});

// Close the entry modal when the "X" button is clicked
document.getElementById('close-entry-modal').addEventListener('click', () => {
    entry_modal.style.display = 'none';
});

// Set entry date to today
const entryDateInput = document.getElementById('entry-date');
if (entryDateInput) {
    const today = new Date();
    today.setDate(today.getDate());
    entryDateInput.value = formatDate(today);
}

// Subtypes listed for each type, their values will be lowercase with '-' replacing ' '
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

// Dynamically generates inner-subtypes for lists
function updateSubtypes(selectedType) {
    subtypeSelect.innerHTML = ""; // Clears existing options
    typeToSubtypes[selectedType].forEach(subtype => {
        const option = document.createElement('option');
        option.value = subtype.toLowerCase().replace(/ /g, "-"); // Replacing spaces with -, making lowercase
        option.textContent = subtype;
        subtypeSelect.appendChild(option);
    });
}

// Update subtypes on type change
typeSelect.addEventListener("change", () => {
    updateSubtypes(typeSelect.value);
});
updateSubtypes(typeSelect.value);

// Formatting the amount within the entry modal
const amountInput = document.getElementById('entry-amount');
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
    entry_modal.style.display = 'none';
};
