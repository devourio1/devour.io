document.addEventListener('DOMContentLoaded', () => {
    const daySelector = document.getElementById('daySelector');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('resultsTableBody');

    // IMPORTANTE: Liste aqui os nomes dos seus arquivos JSON
    // Conforme você gera novos resultados, adicione o nome do arquivo a esta lista.
    const resultFiles = [
        "resultados_20251007_163000.json",
        "resultados_20251006_110000.json" // Exemplo de um arquivo mais antigo
        // "outro_arquivo.json",
    ];

    let currentData = []; // Armazena os dados da batalha selecionada

    // Função para carregar e exibir os dados de um arquivo JSON
    async function loadResults(fileName) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) {
                throw new Error('Não foi possível carregar o arquivo de resultados.');
            }
            const data = await response.json();
            currentData = data;
            displayResults(data);
        } catch (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="4">Erro ao carregar dados. Verifique se o arquivo '${fileName}' existe.</td></tr>`;
        }
    }

    // Função para preencher a tabela com os dados
    function displayResults(data) {
        tableBody.innerHTML = ''; // Limpa a tabela antes de preencher
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

    // Função para filtrar a tabela com base na pesquisa
    function filterResults() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = currentData.filter(player => 
            player.name.toLowerCase().includes(searchTerm)
        );
        displayResults(filteredData);
    }
    
    // Preenche o seletor de dias e carrega o primeiro resultado
    function initialize() {
        resultFiles.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            // Formata o nome do arquivo para algo mais legível
            option.textContent = `Batalha: ${file.replace('resultados_', '').replace('.json', '')}`;
            daySelector.appendChild(option);
        });

        // Adiciona os "escutadores de eventos"
        daySelector.addEventListener('change', (e) => loadResults(e.target.value));
        searchInput.addEventListener('input', filterResults);

        // Carrega os resultados do primeiro arquivo da lista ao iniciar
        if (resultFiles.length > 0) {
            loadResults(resultFiles[0]);
        }
    }

    initialize();
});