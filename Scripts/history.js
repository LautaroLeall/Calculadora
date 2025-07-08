// history.js
let historyList, emptyHistoryMessage, historyPanel, toggleHistoryBtn, clearHistoryBtn;

function initializeHistory() {
    historyList = document.getElementById('history-list');
    emptyHistoryMessage = document.getElementById('empty-history-message');
    historyPanel = document.getElementById('history-panel');
    toggleHistoryBtn = document.getElementById('toggle-history');
    clearHistoryBtn = document.getElementById('clear-history');

    loadHistory();
    toggleHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('active');
    });

    document.querySelector('.container').addEventListener('click', (e) => {
        if (!historyPanel.contains(e.target) && !toggleHistoryBtn.contains(e.target)) {
            historyPanel.classList.remove('active');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
        localStorage.removeItem('calc-history');
        checkHistoryEmpty();
    });
}

function checkHistoryEmpty() {
    if (historyList.children.length === 0) {
        emptyHistoryMessage.style.display = 'flex';
        historyList.style.display = 'none';
    } else {
        emptyHistoryMessage.style.display = 'none';
        historyList.style.display = 'block';
    }
}

function saveToHistory(operation, result) {
    const entry = document.createElement('li');
    entry.className = 'history-entry';
    entry.innerHTML = `
        <div class="history-operation">${operation}</div>
        <div class="history-result">${formatNumber(result)}</div>
    `;
    entry.addEventListener('click', () => {
        currentInput = result.toString().replace('.', ',');
        operationDisplay.textContent = operation;
        updateDisplay(currentInput);
        resultDisplayed = true;
        historyPanel.classList.remove('active');
    });
    historyList.prepend(entry);
    updateLocalStorage();
    checkHistoryEmpty();
}

function updateLocalStorage() {
    const items = Array.from(historyList.children).map(li => ({
        operation: li.querySelector('.history-operation').textContent,
        result: li.querySelector('.history-result').textContent.replace(/\./g, '').replace(',', '.')
    }));
    localStorage.setItem('calc-history', JSON.stringify(items));
}

function loadHistory() {
    const saved = JSON.parse(localStorage.getItem('calc-history') || '[]');
    saved.forEach(item => saveToHistory(item.operation, item.result));
    checkHistoryEmpty();
}
