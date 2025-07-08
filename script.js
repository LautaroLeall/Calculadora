// script.js
// Modo estricto para evitar errores comunes
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const display = document.querySelector('.numbers');
    const operationDisplay = document.getElementById('operation-display');
    const buttons = document.querySelectorAll('input[type="button"]');
    const clearDeleteBtn = document.getElementById('clear-delete-btn');
    const toggleHistoryBtn = document.getElementById('toggle-history');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const emptyHistoryMessage = document.getElementById('empty-history-message');
    const historyHandle = document.getElementById('history-handle');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const container = document.querySelector('.container'); // para cerrar el historial al hacer clic fuera

    // Estado de la calculadora
    let currentInput = '0';
    let operator = '';
    let previousInput = '';
    let resultDisplayed = false;

    // Formateo argentino (coma decimal, punto de miles)
    function formatNumber(numStr) {
        if (numStr === 'Error' || !numStr) return 'Error';
        numStr = numStr.toString().replace(',', '.');
        const [intPart, decimalPart] = numStr.split('.');
        const formattedInt = Number(intPart).toLocaleString('es-AR');
        return decimalPart !== undefined ? `${formattedInt},${decimalPart}` : formattedInt;
    }

    // Mostrar AC o el ícono de borrar
    function updateDisplay(value) {
        const formatted = formatNumber(value);
        display.value = formatted;
        clearDeleteBtn.innerHTML = (currentInput === '0' || resultDisplayed || currentInput === 'Error')
            ? 'AC'
            : '<i class="fa-solid fa-delete-left"></i>';
    }

    // Mostrar/Ocultar mensaje de historial vacío
    function checkHistoryEmpty() {
        if (historyList.children.length === 0) {
            emptyHistoryMessage.style.display = 'flex';
            historyList.style.display = 'none';
        } else {
            emptyHistoryMessage.style.display = 'none';
            historyList.style.display = 'block';
        }
    }

    // Guardar entrada en el historial
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

    // Guardar historial en localStorage
    function updateLocalStorage() {
        const items = Array.from(historyList.children).map(li => ({
            operation: li.querySelector('.history-operation').textContent,
            result: li.querySelector('.history-result').textContent.replace(/\./g, '').replace(',', '.')
        }));
        localStorage.setItem('calc-history', JSON.stringify(items));
    }

    // Cargar historial desde localStorage
    function loadHistory() {
        const saved = JSON.parse(localStorage.getItem('calc-history') || '[]');
        saved.forEach(item => saveToHistory(item.operation, item.result));
        checkHistoryEmpty();
    }

    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
        localStorage.removeItem('calc-history');
        checkHistoryEmpty();
    });

    toggleHistoryBtn.addEventListener('click', () => {
        historyPanel.classList.toggle('active');
    });

    // Cierre del historial al hacer clic fuera
    container.addEventListener('click', (e) => {
        if (!historyPanel.contains(e.target) && !toggleHistoryBtn.contains(e.target)) {
            historyPanel.classList.remove('active');
        }
    });

    // Tema claro / oscuro
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        themeToggle.innerHTML = body.classList.contains('dark-mode')
            ? '<i class="fa-solid fa-moon"></i>'
            : '<i class="fa-solid fa-sun"></i>';
    });

    // Panel de historial arrastrable
    let isDragging = false;
    historyHandle.addEventListener('mousedown', () => {
        isDragging = true;
        historyPanel.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const panelTop = historyPanel.parentElement.getBoundingClientRect().top;
        let newHeight = window.innerHeight - e.clientY - panelTop;
        const maxHeight = historyPanel.parentElement.clientHeight * 0.85;
        if (newHeight > maxHeight) newHeight = maxHeight;
        historyPanel.style.height = `${newHeight}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        historyPanel.style.transition = 'height 0.4s ease';
        if (historyPanel.clientHeight < 100) {
            historyPanel.style.height = '0px';
            historyPanel.classList.remove('active');
        }
    });

    // Operación matemática principal
    function calculate() {
        if (!operator || previousInput === '' || resultDisplayed) return;
        const prev = parseFloat(previousInput.replace(/\./g, '').replace(',', '.'));
        const curr = parseFloat(currentInput.replace(/\./g, '').replace(',', '.'));
        let result;

        switch (operator) {
            case '+': result = prev + curr; break;
            case '-': result = prev - curr; break;
            case 'x': result = prev * curr; break;
            case '/':
                if (curr === 0) {
                    currentInput = 'Error';
                    updateDisplay(currentInput);
                    operator = '';
                    previousInput = '';
                    resultDisplayed = true;
                    return;
                }
                result = prev / curr;
                break;
            default: return;
        }

        const operationString = `${formatNumber(previousInput)} ${operator} ${formatNumber(currentInput)}`;
        saveToHistory(operationString, result.toString());
        operationDisplay.textContent = operationString;
        currentInput = result.toString().replace('.', ',');
        operator = '';
        previousInput = '';
        resultDisplayed = true;
        updateDisplay(currentInput);
    }

    // Botones numéricos y operadores
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.value;
            if (!isNaN(value) || value === ',') {
                if (resultDisplayed) {
                    currentInput = '0';
                    resultDisplayed = false;
                }
                if (value === ',') {
                    if (!currentInput.includes(',')) currentInput += ',';
                } else {
                    currentInput = currentInput === '0' ? value : currentInput + value;
                }
                updateDisplay(currentInput);

            } else if (["+", "-", "x", "/"].includes(value)) {
                if (currentInput === 'Error') return;
                if (operator && !resultDisplayed) calculate();
                operator = value;
                previousInput = currentInput;
                resultDisplayed = false;
                operationDisplay.textContent = `${formatNumber(previousInput)} ${operator}`;
                currentInput = '0';

            } else if (value === '=') {
                calculate();

            } else if (value === '+/-') {
                if (currentInput !== '0' && currentInput !== 'Error') {
                    currentInput = (parseFloat(currentInput.replace(',', '.')) * -1).toString().replace('.', ',');
                    updateDisplay(currentInput);
                }

            } else if (value === '%') {
                if (currentInput !== 'Error') {
                    currentInput = (parseFloat(currentInput.replace(',', '.')) / 100).toString().replace('.', ',');
                    updateDisplay(currentInput);
                }
            }
        });
    });

    // Botón borrar / AC
    clearDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentInput === '0' || resultDisplayed || currentInput === 'Error') {
            currentInput = '0';
            previousInput = '';
            operator = '';
            resultDisplayed = false;
            operationDisplay.textContent = '';
        } else {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '' || currentInput === '-') currentInput = '0';
        }
        updateDisplay(currentInput);
    });

    // Iniciar estado inicial
    updateDisplay(currentInput);
    loadHistory();
});
