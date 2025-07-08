# 📱 Calculadora estilo iPhone

Una **calculadora web inspirada en el diseño de iOS**, desarrollada con HTML, CSS y JavaScript moderno, con un enfoque modular y profesional.  
Cuenta con una interfaz clara, responsiva y personalizable, ideal para escritorio y móviles.

---

## ⚙️ Funcionalidades

- **Operaciones básicas**: suma, resta, multiplicación y división.
- **Botones especiales**:
  - `AC` / `⌫` para limpiar todo o borrar dígito por dígito.
  - `+/-` para cambiar el signo (con ícono Font Awesome).
  - `%` para cálculo de porcentaje inteligente.
  - `,` para ingresar números decimales al estilo latino (internamente convertidos a punto `.`).
- **Historial interactivo**:
  - Guarda automáticamente cada operación.
  - Se puede acceder y reutilizar tocando en la lista.
  - Persistencia en `localStorage` incluso si recargás la página.
- **Tema claro / oscuro** con solo un clic.
- **Sonido en botones** (MP3 local optimizado).
- Interfaz 100% responsive: se adapta a móviles, tablets y escritorio.
- Estética iOS: colores, espaciado y fuente al estilo nativo.
- Accesibilidad básica (`aria-label`, input readonly, etc).

---

## 🗂️ Estructura del proyecto

```
CALCULADORA
├── index.html            
├── Assets/
│   └── logo-calculadora.png
├── Scripts/ 
│   ├── main.js           
│   ├── calculator.js       
│   ├── display.js           
│   ├── history.js          
│   ├── theme.js              
│   └── sound.js          
├── Sound/
│   └── mobile-button.mp3     
├── Styles/
│   ├── main.css            
│   ├── var.css            
│   ├── themes.css             
│   ├── btn-rows.css          
│   ├── display.css           
│   ├── history.css          
│   └── panelHis.css
└── README.md
```

---

## 🛠️ Tecnologías usadas

- **HTML5** semántico.
- **CSS3** con Flexbox, media queries y dark mode.
- **JavaScript ES6+** con módulos separados y buena organización.
- Font Awesome 6.4 para íconos visuales (⌫, +/-, historial, etc.).
- LocalStorage para persistencia de historial.
- MP3 embebido para feedback sonoro.

---

## 🚀 Probar la calculadora

[![Probar Calculadora iPhone](https://img.shields.io/badge/Probar%20Calculadora%20iPhone-%23D32F2F?style=for-the-badge&logo=netlify&logoColor=white)](https://cal-iphone.netlify.app/)

---

## ⚙️ Uso / Cómo correrla

```bash
# Clonar el repositorio
git clone <https://github.com/LautaroLeall/Calculadoral>

# Ingresar al directorio
cd Calculadora

# Abrir el archivo `index.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).

# Usar la calculadora directamente, funciona offline sin necesidad de servidor.
```

---

## 💡 Mejoras futuras (ideas)

- ✳️ Calculadora científica con funciones avanzadas:

  - Potencias, raíces, trigonometría, paréntesis, etc.

- 🖐️ Soporte para teclado físico.