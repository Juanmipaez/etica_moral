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
      caja.innerHTML = `<h3>${caja.querySelector("h3")?.textContent}</h3>`; // Deja solo el título
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
      span.addEventListener("click", toggleTooltip);

      span.className = "frase";
      span.id = `frase-${i}`;
      span.draggable = true;
      span.ondragstart = drag;
      document.getElementById("caja-principal").appendChild(span);
      frasesActuales.push(span.id);
      respuestasCorrectas[span.id] = fraseObj.tipo;
    });
  }
  
  
  document.getElementById("comenzar").addEventListener("click", iniciarPractica);
  
  function evaluarTodo() {
    frasesActuales.forEach(id => {
      const el = document.getElementById(id);
      const parentId = el.parentElement.id;
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
      const tipo = respuestasCorrectas[id];
      const texto = document.getElementById(id).textContent;
      const razon = tipo === 'etica'
        ? "Esta frase representa un principio universal, guiado por la razón y el bien común."
        : "Esta frase refleja una norma o costumbre cultural o social, aprendida o heredada.";
    contenedor.innerHTML += `<p><strong>\"${texto}\"</strong>: ${razon}</p>`;
    });
    contenedor.style.display = "block";
}

function volverATeoria() {
    document.getElementById("practica").style.display = "none";
    document.getElementById("inicio").style.display = "block";
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

  // Verifica si ya tenía tooltip abierto (para permitir cerrar al hacer clic en el mismo)
  if (frase.dataset.tooltipVisible === "true") {
    frase.dataset.tooltipVisible = "false";
    return;
  }

  // Crea el tooltip
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.textContent = frase.dataset.texto || frase.textContent;

  frase.appendChild(tooltip);
  frase.dataset.tooltipVisible = "true";

  // Cierra si se hace clic fuera
  document.addEventListener("click", function clickOutside(e) {
    if (!frase.contains(e.target)) {
      tooltip.remove();
      frase.dataset.tooltipVisible = "false";
      document.removeEventListener("click", clickOutside);
    }
  });
}
