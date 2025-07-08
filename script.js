const display = document.querySelector('.numbers');
const buttons = document.querySelectorAll('input[type="button"]');
const clearDeleteBtn = document.getElementById('clear-delete-btn');

let currentInput = '0';
let operator = '';
let previousInput = '';
let resultDisplayed = false;

// Función para formatear número con puntos y coma
function formatNumber(numStr) {
    if (numStr === 'Error') return numStr;

    // Convertimos coma a punto para el parseo
    numStr = numStr.replace(',', '.');

    // Separamos parte entera y decimal
    const [intPart, decimalPart] = numStr.split('.');

    // Formateamos la parte entera con separadores de miles según "es-AR"
    const formattedInt = Number(intPart).toLocaleString('es-AR');

    // Reconstruimos con coma decimal si tiene decimal
    return decimalPart !== undefined ? `${formattedInt},${decimalPart}` : formattedInt;
}

// Actualiza el display y el botón AC/⌫
function updateDisplay(value) {
    const rawValue = value.replace(/\./g, '').replace(',', '.');
    const formatted = formatNumber(value);

    // Ajustar tamaño de fuente dinámicamente según longitud sin contar separadores
    const length = formatted.replace(/\./g, '').replace(',', '').length;
    const baseSize = 45;
    let newSize = baseSize;

    if (length > 6) {
        newSize = baseSize - (length - 6) * 2;
        if (newSize < 20) newSize = 20;
    }

    display.style.fontSize = `${newSize}px`;
    display.value = formatted;

    // Cambiar entre AC y borrar (⌫)
    if (resultDisplayed || currentInput === '0') {
        clearDeleteBtn.textContent = 'AC';
    } else {
        clearDeleteBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
    }
}

// Manejo de botones
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;

        if (!isNaN(value) || value === '00' || value === ',') {
            if (resultDisplayed) {
                // Si resultado mostrado y presionan número o coma, reiniciamos
                if (value === ',') {
                    currentInput = '0,';
                } else {
                    currentInput = value;
                }
                resultDisplayed = false;
            } else {
                if (value === ',') {
                    // Si ya tiene coma, no agregar otra
                    if (!currentInput.includes(',')) {
                        currentInput = currentInput === '0' ? '0,' : currentInput + ',';
                    }
                } else {
                    // Evitar múltiples ceros al inicio
                    if (currentInput === '0') {
                        if (value === '00') {
                            // No agregamos "00" si hay un solo 0
                            return;
                        }
                        currentInput = value;
                    } else {
                        currentInput += value;
                    }
                }
            }
            updateDisplay(currentInput);
        } else if (value === '+/-') {
            if (currentInput !== '0' && currentInput !== 'Error') {
                // Invertir signo
                let normalized = currentInput.replace(',', '.');
                let num = parseFloat(normalized) * -1;

                // Para evitar "-0", ponemos "0"
                if (num === 0) num = 0;

                currentInput = num.toString().replace('.', ',');
                updateDisplay(currentInput);
            }
        } else if (value === '%') {
            if (currentInput !== 'Error') {
                let normalized = currentInput.replace(',', '.');
                let num = parseFloat(normalized) / 100;
                currentInput = num.toString().replace('.', ',');
                updateDisplay(currentInput);
            }
        } else if (['+', '-', 'x', '/'].includes(value)) {
            if (resultDisplayed) {
                resultDisplayed = false; // volvemos a edición
            }

            if (operator && previousInput && currentInput) {
                calculate();
            }

            operator = value;
            previousInput = currentInput;
            currentInput = '0';
            updateDisplay(currentInput);
        } else if (value === '=') {
            calculate();
        }
    });
});

// Botón AC o ⌫
clearDeleteBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (clearDeleteBtn.innerHTML.includes('fa-delete-left')) {
        // Borrar último carácter
        if (resultDisplayed || currentInput === 'Error') {
            // Si estamos en resultado o error, al borrar resetear
            currentInput = '0';
            resultDisplayed = false;
        } else {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '' || currentInput === '-') currentInput = '0';
        }
        updateDisplay(currentInput);
    } else {
        // AC: limpiar todo
        currentInput = '0';
        previousInput = '';
        operator = '';
        resultDisplayed = false;
        updateDisplay(currentInput);
    }
});

// Función calcular
function calculate() {
    if (operator === '' || previousInput === '' || currentInput === '') return;

    const prev = parseFloat(previousInput.replace(',', '.'));
    const curr = parseFloat(currentInput.replace(',', '.'));
    let result;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case 'x':
            result = prev * curr;
            break;
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
        default:
            return;
    }

    // Mostrar resultado con coma decimal
    currentInput = result.toString().replace('.', ',');
    operator = '';
    previousInput = '';
    resultDisplayed = true;
    updateDisplay(currentInput);
}

// Al iniciar la calculadora mostramos el 0 formateado
updateDisplay(currentInput);