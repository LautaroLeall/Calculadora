// theme.js
let themeToggle;
let body;

function initializeTheme() {
    body = document.body;
    themeToggle = document.getElementById('theme-toggle');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        themeToggle.innerHTML = body.classList.contains('dark-mode')
            ? '<i class="fa-solid fa-moon"></i>'
            : '<i class="fa-solid fa-sun"></i>';
    });
}
