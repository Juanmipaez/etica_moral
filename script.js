const frasesEtica = [
  "Actuar con justicia aunque nadie mire",
  "Defender los derechos humanos de cualquier persona",
  "Tomar decisiones pensando en el bien común",
  "Rechazar sobornos aunque sea común",
  "Respetar la dignidad humana siempre",
  "Tener principios sólidos más allá de las normas",
  "Obedecer la ley cuando es justa",
  "Denunciar una injusticia aunque no te afecte"
];

const frasesMoral = [
  "No comer cerdo por razones religiosas",
  "Usar ropa formal en eventos importantes",
  "Saludar con un beso en ciertas culturas",
  "Ir a misa los domingos",
  "Pedir permiso antes de entrar a una casa",
  "No decir groserías frente a mayores",
  "Ayunar en ciertas fechas religiosas",
  "Celebrar navidad con la familia"
];

let frasesActuales = [];
let respuestasCorrectas = {};

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const frase = document.getElementById(data);
  const destino = ev.target.closest(".caja");

  if (destino) {
    destino.appendChild(frase);
    frase.classList.add("compacta");
  } else {
    // Si no es una caja, vuelve a la caja principal
    document.getElementById("caja-principal").appendChild(frase);
  }
}

function iniciarPractica() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("practica").style.display = "block";

  // Limpiar todas las cajas
  ["caja-principal", "caja-etica", "caja-moral"].forEach(id => {
    const caja = document.getElementById(id);
    // Preservar solo el encabezado h3
    const h3 = caja.querySelector("h3")?.outerHTML || "";
    caja.innerHTML = h3;
  });

  frasesActuales = [];
  respuestasCorrectas = {};

  // Generar nuevas frases
  const frasesSelEtica = frasesEtica.sort(() => 0.5 - Math.random()).slice(0, 4);
  const frasesSelMoral = frasesMoral.sort(() => 0.5 - Math.random()).slice(0, 4);
  const todas = [...frasesSelEtica.map(f => ({ texto: f, tipo: 'etica' })), ...frasesSelMoral.map(f => ({ texto: f, tipo: 'moral' }))].sort(() => 0.5 - Math.random());

  todas.forEach((fraseObj, i) => {
    const span = document.createElement("span");
    span.textContent = fraseObj.texto;
    span.dataset.texto = fraseObj.texto;
    span.className = "frase";
    span.id = `frase-${i}`;
    span.draggable = true;
    span.ondragstart = drag;
    
    // Añadir evento de clic para mostrar el tooltip
    span.addEventListener("click", toggleTooltip);
    
    document.getElementById("caja-principal").appendChild(span);
    frasesActuales.push(span.id);
    respuestasCorrectas[span.id] = fraseObj.tipo;
  });
  
  // Asegurarnos de que el div de explicaciones esté oculto al inicio
  document.getElementById("explicaciones").style.display = "none";
  document.getElementById("explicacionBtn").style.display = "none";
}

function evaluarTodo() {
  frasesActuales.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return; // Protección contra elementos que no existen
    
    const parentId = el.parentElement?.id;
    if (parentId === "caja-etica" || parentId === "caja-moral") {
      const tipo = respuestasCorrectas[id];
      if ((tipo === 'etica' && parentId === "caja-etica") || (tipo === 'moral' && parentId === "caja-moral")) {
        el.className = "frase correcta";
      } else {
        el.className = "frase incorrecta";
      }
    } else {
      el.className = "frase no-ubicada";
    }
  });
  document.getElementById("explicacionBtn").style.display = "inline-block";
}

function mostrarExplicaciones() {
  const contenedor = document.getElementById("explicaciones");
  contenedor.innerHTML = "<h3>Explicaciones:</h3>";
  frasesActuales.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return; // Protección contra elementos que no existen
    
    const tipo = respuestasCorrectas[id];
    const texto = el.textContent;
    const razon = tipo === 'etica'
      ? "Esta frase representa un principio universal, guiado por la razón y el bien común."
      : "Esta frase refleja una norma o costumbre cultural o social, aprendida o heredada.";
    contenedor.innerHTML += `<p><strong>\"${texto}\"</strong>: ${razon}</p>`;
  });
  contenedor.style.display = "block";
}

function volverATeoria() {
  document.getElementById("practica").style.display = "none";
  document.getElementById("inicio").style.display = "flex";
}

function generarNuevoSet() {
  iniciarPractica(); // simplemente vuelve a ejecutar todo desde cero
  document.getElementById("explicaciones").style.display = "none";
  document.getElementById("explicacionBtn").style.display = "none";
}

function toggleTooltip(event) {
  const frase = event.currentTarget;
  
  // Cierra cualquier tooltip abierto
  document.querySelectorAll('.tooltip').forEach(t => t.remove());
  
  // Elimina la clase 'active' de todas las frases
  document.querySelectorAll('.frase').forEach(f => f.classList.remove('active-tooltip'));

  // Verifica si ya tenía tooltip abierto (para permitir cerrar al hacer clic en el mismo)
  if (frase.dataset.tooltipVisible === "true") {
    frase.dataset.tooltipVisible = "false";
    return;
  }

  // Añade clase active para destacar la frase seleccionada
  frase.classList.add('active-tooltip');

  // Crea el tooltip
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.textContent = frase.dataset.texto || frase.textContent;

  // Posicionamiento mejorado del tooltip
  document.body.appendChild(tooltip);
  
  // Calcula la posición óptima para el tooltip
  const fraseRect = frase.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Posiciona el tooltip centrado bajo la frase
  let top = fraseRect.bottom + window.scrollY + 10; // 10px debajo de la frase
  let left = fraseRect.left + window.scrollX + (fraseRect.width / 2) - (tooltipRect.width / 2);
  
  // Evita que el tooltip salga de la pantalla
  if (left < 10) left = 10;
  if (left + tooltipRect.width > window.innerWidth - 10) {
    left = window.innerWidth - tooltipRect.width - 10;
  }
  
  tooltip.style.position = 'absolute';
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.zIndex = '1000';
  
  frase.dataset.tooltipVisible = "true";

  // Cierra si se hace clic fuera
  document.addEventListener("click", function clickOutside(e) {
    if (!frase.contains(e.target) && !tooltip.contains(e.target)) {
      tooltip.remove();
      frase.classList.remove('active-tooltip');
      frase.dataset.tooltipVisible = "false";
      document.removeEventListener("click", clickOutside);
    }
  });
}

// Asegurarse de que el botón comenzar tenga el evento de clic
document.addEventListener('DOMContentLoaded', function() {
  const comenzarBtn = document.getElementById('comenzar');
  if (comenzarBtn) {
    comenzarBtn.addEventListener('click', iniciarPractica);
  }
  
  // También asegurarse de que los otros botones tengan sus eventos
  const evaluarBtn = document.getElementById('evaluar');
  if (evaluarBtn) {
    evaluarBtn.addEventListener('click', evaluarTodo);
  }
  
  const explicacionBtn = document.getElementById('explicacionBtn');
  if (explicacionBtn) {
    explicacionBtn.addEventListener('click', mostrarExplicaciones);
  }
  
  const volverBtn = document.getElementById('volverTeoria');
  if (volverBtn) {
    volverBtn.addEventListener('click', volverATeoria);
  }
  
  const nuevoSetBtn = document.getElementById('nuevoSet');
  if (nuevoSetBtn) {
    nuevoSetBtn.addEventListener('click', generarNuevoSet);
  }
});

function mostrarPractica() {
  document.getElementById('inicio').style.display = 'none';
  document.getElementById('practica').style.display = 'block';
  iniciarPractica(); // Asegura que se ejecute iniciarPractica al mostrar la práctica
}