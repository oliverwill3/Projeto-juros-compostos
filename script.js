document.addEventListener('DOMContentLoaded', () => {
    const initialBalanceInput = document.getElementById('initial-balance');
    const numDaysInput = document.getElementById('num-days');
    const gainRateInput = document.getElementById('gain-rate');
    const lossRateInput = document.getElementById('loss-rate');
    const tableBody = document.querySelector('#simulation-table tbody');
    const finalBalanceDisplay = document.getElementById('final-balance-display');
    const finalMetaDisplay = document.getElementById('final-meta-display');
    const performanceDisplay = document.getElementById('performance-display');

    // Função para formatar números como moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Função que recalcula e atualiza toda a tabela
    const updateAllCalculations = () => {
        const rows = tableBody.querySelectorAll('tr');
        let currentBalance = parseFloat(initialBalanceInput.value) || 0;
        let currentMetaBalance = parseFloat(initialBalanceInput.value) || 0;
        let diferencaAcumulada = 0;
        
        // Obtém as taxas de ganho e perda dos novos inputs
        const dailyGainRate = (parseFloat(gainRateInput.value) || 0) / 100;

        rows.forEach(row => {
            const saldoInicialReal = currentBalance;
            const saldoInicialMeta = currentMetaBalance;
            
            const dailyResultInput = row.querySelector('.daily-result-input');
            const resultadoDoDia = parseFloat(dailyResultInput.value);
            
            // Calcula o ganho de meta do dia com base na nova taxa
            const ganhoMetaDoDia = saldoInicialMeta * dailyGainRate;
            
            let diferencaDaMeta = 0;
            let status = '';

            // Só calcula a diferença e o status se um valor foi inserido
            if (!isNaN(resultadoDoDia)) {
                diferencaDaMeta = resultadoDoDia - ganhoMetaDoDia;
                diferencaAcumulada += diferencaDaMeta;

                if (diferencaDaMeta >= 0) {
                    status = 'OK';
                } else {
                    status = 'Déficit';
                }
            } else {
                status = '-';
            }
            
            // Calcula os saldos finais
            const saldoFinalReal = saldoInicialReal + (isNaN(resultadoDoDia) ? 0 : resultadoDoDia);
            const saldoFinalMeta = saldoInicialMeta + ganhoMetaDoDia;

            // Atualiza os valores na linha da tabela
            row.querySelector('.initial-balance-cell').textContent = formatCurrency(saldoInicialReal);
            row.querySelector('.meta-gain-cell').textContent = formatCurrency(ganhoMetaDoDia);
            row.querySelector('.daily-diff-cell').textContent = isNaN(resultadoDoDia) ? '-' : formatCurrency(diferencaDaMeta);
            row.querySelector('.status-cell').textContent = status;
            
            // Altera a cor do texto do status
            const statusCell = row.querySelector('.status-cell');
            if (status === 'OK') {
                statusCell.style.color = '#008000'; // Verde
            } else if (status === 'Déficit') {
                statusCell.style.color = '#dc3545'; // Vermelho
            } else {
                statusCell.style.color = '#333';
            }
            
            row.querySelector('.final-balance-cell').textContent = formatCurrency(saldoFinalReal);

            // Atualiza os saldos para o próximo dia
            currentBalance = saldoFinalReal;
            currentMetaBalance = saldoFinalMeta;
        });

        // Atualiza os painéis de resumo
        finalBalanceDisplay.textContent = formatCurrency(currentBalance);
        finalMetaDisplay.textContent = formatCurrency(currentMetaBalance);
        performanceDisplay.textContent = formatCurrency(diferencaAcumulada);
        
        // Altera a cor do painel de performance
        if (diferencaAcumulada >= 0) {
            performanceDisplay.style.color = '#008000'; // Verde
        } else {
            performanceDisplay.style.color = '#dc3545'; // Vermelho
        }
    };

    // Função principal que gera a tabela
    const generateTable = () => {
        const numDays = parseInt(numDaysInput.value) || 0;
        tableBody.innerHTML = '';
        if (numDays <= 0) return;

        for (let i = 1; i <= numDays; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${i}</td>
                <td class="initial-balance-cell"></td>
                <td class="meta-gain-cell"></td>
                <td><input type="number" class="daily-result-input" placeholder="Ganho ou Perda"></td>
                <td class="daily-diff-cell"></td>
                <td class="status-cell"></td>
                <td class="final-balance-cell"></td>
            `;
            tableBody.appendChild(row);

            const dailyResultInput = row.querySelector('.daily-result-input');
            dailyResultInput.addEventListener('input', updateAllCalculations);
        }
        updateAllCalculations();
    };

    initialBalanceInput.addEventListener('input', generateTable);
    numDaysInput.addEventListener('input', generateTable);
    gainRateInput.addEventListener('input', generateTable);
    lossRateInput.addEventListener('input', generateTable);
    
    generateTable();
});