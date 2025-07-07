const display = document.querySelector('.numbers');
const buttons = document.querySelectorAll('input[type="button"]');

let currentInput = '0';
let operator = '';
let previousInput = '';
let resultDisplayed = false;
const clearDeleteBtn = document.getElementById('clear-delete-btn');

function updateDisplay(value) {
    // Ajuste de tamaño de fuente según la longitud del número
    const length = value.length;
    const baseSize = 45;

    let newSize = baseSize;

    if (length > 8) {
        newSize = baseSize - (length - 6) * 2;
        if (newSize < 20) newSize = 20; // límite mínimo para que no desaparezca
    }

    display.style.fontSize = `${newSize}px`;
    display.value = value;

    // Cambiar AC ↔ ⌫
    if (value !== '0') {
        clearDeleteBtn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
    } else {
        clearDeleteBtn.textContent = 'AC';
    }
}


buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;

        if (!isNaN(value) || value === '00' || value === ',') {
            if (resultDisplayed) {
                currentInput = (value === ',') ? '0.' : value;
                resultDisplayed = false;
            } else {
                if (value === ',') {
                    if (!currentInput.includes('.')) {
                        currentInput += '.';
                    }
                } else {
                    currentInput = (currentInput === '0') ? value : currentInput + value;
                }
            }
            updateDisplay(currentInput);
        }

        else if (value === '+/-') {
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay(currentInput);
        }

        else if (value === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay(currentInput);
        }

        else if (value === '+' || value === '-' || value === 'x' || value === '/') {
            if (operator && previousInput && currentInput) {
                // Si ya había una operación previa, resolverla primero
                calculate();
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '0';
        }

        else if (value === '=') {
            calculate();
        }
    });
});

clearDeleteBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Evita que se recargue el formulario por ser un botón

    if (display.value !== '0' && clearDeleteBtn.innerHTML.includes('fa-delete-left')) {
        // Borrar un dígito
        currentInput = currentInput.slice(0, -1) || '0';
        updateDisplay(currentInput);
    } else {
        // Reset completo
        currentInput = '0';
        previousInput = '';
        operator = '';
        updateDisplay(currentInput);
    }
});


function calculate() {
    let result = 0;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case 'x':
            result = prev * current;
            break;
        case '/':
            result = current === 0 ? 'Error' : prev / current;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    operator = '';
    previousInput = '';
    resultDisplayed = true;
    updateDisplay(currentInput);
}
