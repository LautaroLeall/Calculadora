// sound.js
let clickSound;

function initializeSounds() {
    clickSound = new Audio('./Sound/mobile-button.mp3');
    
    const buttons = document.querySelectorAll('input[type="button"], #clear-delete-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            clickSound.currentTime = 0; // Reinicia el sonido al principio para que se pueda reproducir rápidamente
            
            // Usamos .play().catch() para capturar y manejar posibles errores de reproducción.
            // Esto es importante para depurar si el sonido no se reproduce (ej. políticas de autoplay del navegador).
            clickSound.play().catch(error => {
                console.error("Error al reproducir el sonido:", error);
                // Aquí podrías añadir lógica para informar al usuario o intentar una solución alternativa
            });
        });
    });
}