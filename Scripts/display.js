// display.js
let display;
let operationDisplay;
let clearDeleteBtn;

function initializeDisplay() {
    display = document.querySelector('.numbers');
    operationDisplay = document.getElementById('operation-display');
    clearDeleteBtn = document.getElementById('clear-delete-btn');
}

function updateDisplay(value) {
    const formatted = formatNumber(value);
    display.value = formatted;

    clearDeleteBtn.innerHTML = (currentInput === '0' || resultDisplayed || currentInput === 'Error')
        ? 'AC'
        : '<i class="fa-solid fa-delete-left"></i>';
}

function formatNumber(numStr) {
    if (numStr === 'Error' || numStr === '') return 'Error';

    // Manejo de la coma y los ceros decimales inmediatos
    // Si la cadena de números contiene una coma
    if (numStr.includes(',')) {
        // Divide la cadena en parte entera y parte decimal
        let [integerPart, decimalPart] = numStr.split(',');

        // Formatea la parte entera con separadores de miles
        // Aseguramos que la parte entera no sea solo '-' si el número es negativo y aún no hay dígitos
        const formattedIntegerPart = Number(integerPart).toLocaleString('es-AR');

        // Combinamos la parte entera formateada con la parte decimal original (preservando ceros)
        // Si no hay parte decimal, simplemente devolvemos la parte entera con la coma (ej. "123,")
        return decimalPart !== undefined ? `${formattedIntegerPart},${decimalPart}` : `${formattedIntegerPart},`;
    }

    // Resto del código (para números enteros sin coma)
    // Si la cadena es "0" o empieza con "0" y es solo "0", se mantiene.
    // Esto es para el caso inicial o cuando se ingresa solo "0".
    if (numStr === '0' && numStr.length === 1) {
        return '0';
    }
    // Si la cadena empieza con 0 pero tiene más dígitos (ej. "012"), se formatea a "12".
    // Esto es para evitar los ceros iniciales no deseados en números enteros.
    if (numStr.startsWith('0') && numStr.length > 1 && !numStr.includes(',')) {
        numStr = Number(numStr).toString(); // Convierte "012" a "12"
    }

    // Formateo para números enteros sin coma (con separadores de miles)
    return Number(numStr.replace(',', '.')).toLocaleString('es-AR');
}