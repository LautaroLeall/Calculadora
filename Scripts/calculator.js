// calculator.js
let currentInput = '0';
let previousInput = '';
let operator = '';
let resultDisplayed = false;

function initializeCalculator() {
    const buttons = document.querySelectorAll('input[type="button"]');
    const clearDeleteBtn = document.getElementById('clear-delete-btn');

    buttons.forEach(button => {
        const value = button.value;

        button.addEventListener('click', () => {
            if (!isNaN(value) || value === ',') {
                // Número o coma
                if (resultDisplayed) {
                    currentInput = '0';
                    resultDisplayed = false;
                }

                if (value === ',') {
                    if (!currentInput.includes(',')) {
                        currentInput += ',';
                        // Actualizamos el display inmediatamente al agregar la coma
                        updateDisplay(currentInput);
                    }
                } else {
                    currentInput = currentInput === '0' ? value : currentInput + value;
                    updateDisplay(currentInput);
                }
            }

            else if (['+', '-', 'x', '/'].includes(value)) {
                if (currentInput === 'Error') return;
                // Si ya hay un operador y no se ha mostrado el resultado, calcula antes de asignar el nuevo operador.
                // Esto permite encadenar operaciones como 5 + 3 + 2
                if (operator && !resultDisplayed) {
                    calculate();
                    // Después de calcular, el resultado pasa a ser el previousInput para la siguiente operación
                    previousInput = currentInput;
                } else {
                    previousInput = currentInput;
                }
                operator = value;
                currentInput = '0'; // Reiniciamos currentInput para la siguiente entrada de número
                resultDisplayed = false; // Aseguramos que no se reinicie la entrada al escribir el siguiente número
                operationDisplay.textContent = `${formatNumber(previousInput)} ${operator}`;
            }

            else if (value === '=') {
                calculate();
            }

            else if (value === '+/-') {
                if (currentInput !== '0' && currentInput !== 'Error') {
                    const num = parseFloat(currentInput.replace(',', '.'));
                    if (!isNaN(num)) {
                        currentInput = (num * -1).toString().replace('.', ',');
                        updateDisplay(currentInput);
                    }
                }
            }

            else if (value === '%') {
                // Manejo de porcentaje. Si hay un operador, calcula el porcentaje del resultado de la operación.
                // Si no hay operador, calcula el porcentaje del número actual.
                let numToOperate = parseFloat(currentInput.replace(',', '.'));

                if (operator && previousInput !== '') {
                    // Si hay una operación pendiente (ej: "50 + 10"), el porcentaje es del 10% de 50.
                    const prev = parseFloat(previousInput.replace(/\./g, '').replace(',', '.'));
                    // Para el porcentaje, asumimos que se aplica al 'previousInput' como en la calculadora de iPhone
                    // Ej: 50 + 10% -> 50 + (50 * 0.10)
                    // Para hacer 10% de 50 -> 50 * 0.10
                    // Si el usuario presiona 10% sin operador, es 10 / 100
                    switch (operator) {
                        case '+':
                        case '-':
                        case 'x':
                        case '/':
                            // En el iPhone, al presionar % después de un número y un operador, aplica el porcentaje al número previo.
                            // Ejemplo: 100 + 50 % -> 100 + 50 (se ve el 50%) -> 100 + 50
                            // En este caso, el porcentaje se aplica al 'currentInput' y luego se realiza la operación.
                            // Para replicar el comportamiento del iPhone: 100 + 50 % = 150
                            // Si es 100 + 50 y aprietas %, el 50 se convierte en 0.5 y se suma.
                            numToOperate = (prev * (numToOperate / 100));
                            break;
                        default:
                            numToOperate = numToOperate / 100;
                            break;
                    }
                    currentInput = numToOperate.toString().replace('.', ',');
                    // Actualizamos la operación en pantalla para reflejar el porcentaje aplicado
                    operationDisplay.textContent = `${formatNumber(previousInput)} ${operator} ${formatNumber(currentInput)}`;

                } else {
                    // Si no hay operador, es simplemente el número actual dividido por 100
                    numToOperate = parseFloat(currentInput.replace(',', '.'));
                    if (!isNaN(numToOperate)) {
                        currentInput = (numToOperate / 100).toString().replace('.', ',');
                    }
                }
                updateDisplay(currentInput);
            }
        });
    });

    // Event listener para el botón AC/delete
    clearDeleteBtn.addEventListener('click', () => {
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
}

function calculate() {
    // Si no hay operador o no hay un segundo número, no hacemos nada (a menos que solo se presione '=' después de un número)
    if (!operator || previousInput === '') {
        // Si el usuario presiona '=' después de ingresar un número sin un operador previo,
        // simplemente mostramos ese número como resultado final.
        if (currentInput !== '0' && !resultDisplayed) {
            saveToHistory(currentInput, currentInput); // Guarda el número actual como una "operación"
            operationDisplay.textContent = ''; // Limpiamos la operación
            resultDisplayed = true;
            updateDisplay(currentInput);
        }
        return;
    }

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
        default: return; // No hay operador válido
    }

    const operationString = `${formatNumber(previousInput)} ${operator} ${formatNumber(currentInput)}`;
    saveToHistory(operationString, result.toString());
    operationDisplay.textContent = operationString; // Muestra la operación completa en la pantalla superior
    currentInput = result.toString().replace('.', ','); // El resultado se convierte en el nuevo currentInput
    operator = ''; // Reseteamos el operador
    previousInput = ''; // Reseteamos el previousInput
    resultDisplayed = true; // Indicamos que un resultado ha sido mostrado
    updateDisplay(currentInput); // Actualizamos la pantalla principal con el resultado
}