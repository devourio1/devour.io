// Waits for the HTML to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const battleSelector = document.getElementById('battleSelector');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('resultsTableBody');

    let currentBattleData = [];

    async function loadBattle(fileName) {
        const filePath = `data/${fileName}`;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            currentBattleData = data;
            renderTable(data);
        } catch (error) {
            console.error(`Failed to load data from '${filePath}':`, error);
            tableBody.innerHTML = `<tr><td colspan="4">Error loading data. Check if file '${filePath}' exists.</td></tr>`;
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
            return;
        }
        data.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.rank}</td>
                <td>${player.name}</td>
                <td>${player.kills}</td>
                <td>${player.killed_by}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = currentBattleData.filter(player =>
            player.name.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData);
    }

    async function init() {
        try {
            // Step 1: Fetch the manifest file to discover available battles
            const response = await fetch('data/manifest.json');
            if (!response.ok) throw new Error('manifest.json not found. Please run the Python script to generate it.');
            
            const manifest = await response.json();
            const battleFiles = manifest.battles; // Get the list of files from the manifest

            if (!battleFiles || battleFiles.length === 0) {
                throw new Error("No battles found in manifest.json.");
            }

            // Step 2: Populate the <select> menu with the discovered battles
            battleFiles.forEach(fileName => {
                const option = document.createElement('option');
                option.value = fileName;
                const friendlyName = fileName.replace('.json', '');
                option.textContent = `Battle of ${friendlyName}`;
                battleSelector.appendChild(option);
            });

            // Step 3: Add event listeners for interactivity
            battleSelector.addEventListener('change', () => loadBattle(battleSelector.value));
            searchInput.addEventListener('input', filterTable);

            // Step 4: Load the first battle from the list (the most recent one) by default
            loadBattle(battleFiles[0]);

        } catch (error) {
            console.error("Error initializing the page:", error);
            const container = document.querySelector('.container');
            container.innerHTML = `<h1>Initialization Error</h1><p>${error.message}</p>`;
        }
    }

    // Start everything!
    init();
});
