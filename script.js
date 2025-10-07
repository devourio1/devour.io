// Aguarda o HTML ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO MANUAL ---
    // Adicione manualmente o caminho para cada arquivo de batalha aqui.
    // A ordem que você adicionar não importa, o script vai organizar por data.
    const battleFiles = [
        "data/2025-10-06.json",
        "data/2025-10-07.json",
        "data/2025-10-05.json" 
        // Ex: "data/AAAA-MM-DD.json"
    ];
    // -------------------------

    const battleSelector = document.getElementById('battleSelector');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('resultsTableBody');

    let currentBattleData = [];

    async function loadBattle(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Erro ao carregar: ${response.statusText}`);
            const data = await response.json();
            currentBattleData = data;
            renderTable(data);
        } catch (error) {
            console.error(`Falha ao carregar dados de '${filePath}':`, error);
            tableBody.innerHTML = `<tr><td colspan="4">Erro ao carregar dados. Verifique se o arquivo '${filePath}' existe.</td></tr>`;
        }
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">Nenhum resultado encontrado.</td></tr>`;
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

    function init() {
        if (!battleFiles || battleFiles.length === 0) {
            console.warn("Nenhuma batalha configurada na lista 'battleFiles'.");
            return;
        }

        // NOVO: Organiza os arquivos pela data (do mais novo para o mais antigo)
        // Isso funciona porque o formato AAAA-MM-DD pode ser comparado como texto.
        battleFiles.sort((a, b) => b.localeCompare(a));

        // Preenche o menu <select> com a lista já organizada
        battleFiles.forEach(filePath => {
            const option = document.createElement('option');
            option.value = filePath;
            const friendlyName = filePath.replace('data/', '').replace('.json', '');
            option.textContent = `Batalha de ${friendlyName}`;
            battleSelector.appendChild(option);
        });

        battleSelector.addEventListener('change', () => loadBattle(battleSelector.value));
        searchInput.addEventListener('input', filterTable);

        // Carrega a primeira batalha da lista (que agora é a mais recente)
        loadBattle(battleFiles[0]);
    }

    init();
});
