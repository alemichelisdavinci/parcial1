'use strict';

let discos = [];
let discosCargados = false;

async function cargarDiscosDesdeJSON() {
  try {
    const respuesta = await fetch('discos.json');
    const data = await respuesta.json();

    discos = data.map(d => {
      const disco = new Disco(d.nombre, d.autor, d.portada, d.codigo);
      d.pistas.forEach(p => {
        disco.agregarPista(new Pista(p.nombre, p.duracion));
      });
      return disco;
    });

    discosCargados = true;
    console.log("Discos cargados desde JSON:", discos);
  } catch (error) {
    console.error("Error al cargar discos.json:", error);
    alert("No se pudo cargar el archivo discos.json");
  }
}

function cargar() {
  const nombre = prompt("Nombre del disco:").trim();
  if (!nombre) return alert("El nombre no puede estar vacío");

  const autor = prompt("Autor o banda:").trim();
  if (!autor) return alert("El autor no puede estar vacío");

  const portada = prompt("URL de la imagen de portada:").trim();
  if (!portada) return alert("La URL no puede estar vacía");

  let codigo;
  do {
    codigo = parseInt(prompt("Código numérico único (1 a 999):"), 10);
    if (isNaN(codigo) || codigo < 1 || codigo > 999 || discos.find(d => d.codigo === codigo)) {
      alert("Código inválido o ya usado. Intente nuevamente.");
      codigo = undefined;
    }
  } while (!codigo);

  const disco = new Disco(nombre, autor, portada, codigo);

  while (true) {
    const nombrePista = prompt("Nombre de la pista:").trim();
    if (!nombrePista) {
      alert("El nombre de la pista no puede estar vacío");
      continue;
    }

    const duracion = parseInt(prompt("Duración en segundos (0 a 7200):"), 10);
    if (isNaN(duracion) || duracion < 0 || duracion > 7200) {
      alert("Duración inválida. Debe estar entre 0 y 7200 segundos");
      continue;
    }

    disco.agregarPista(new Pista(nombrePista, duracion));

    const continuar = confirm("¿Desea agregar otra pista?");
    if (!continuar) break;
  }

  discos.push(disco);
  alert("Disco cargado con éxito");
}

async function mostrar() {
  if (!discosCargados) {
    await cargarDiscosDesdeJSON();
  }

  const contenedor = document.getElementById("discos");
  contenedor.innerHTML = "";
  document.getElementById("contador").innerText = `Discos cargados: ${discos.length}`;

  let mayorDuracion = 0;
  let discoMasLargo = null;

  discos.forEach(disco => {
    const duracion = disco.getDuracionTotal();
    if (duracion > mayorDuracion) {
      mayorDuracion = duracion;
      discoMasLargo = disco;
    }
  });

  discos.forEach(disco => {
    const div = document.createElement("div");
    div.className = "disco";
    div.innerHTML = `
      <h3>${disco.nombre}</h3>
      <p><strong>Autor:</strong> ${disco.autor}</p>
      <p><strong>Código:</strong> ${disco.codigo}</p>
      <img src="${disco.portada}" class="portada" alt="Portada de ${disco.nombre}">
      <p><strong>Cantidad de pistas:</strong> ${disco.pistas.length}</p>
      <p><strong>Duración total:</strong> ${disco.getDuracionFormateada()}</p>
      <p><strong>Promedio de duración:</strong> ${disco.getDuracionPromedioFormateada()}</p>
      <p><strong>Pista más larga:</strong> ${disco.getPistaMasLarga().nombre}</p>
    `;

    const ul = document.createElement("ul");
    disco.pistas.forEach(p => {
      const li = document.createElement("li");
      li.innerText = `${p.nombre} - ${p.getDuracionFormateada()}`;
      if (p.duracion > 180) li.classList.add("duracion-larga");
      ul.appendChild(li);
    });

    div.appendChild(ul);
    if (disco === discoMasLargo) div.style.border = "3px solid red";
    contenedor.appendChild(div);
  });
}

function buscarDisco() {
  const codigo = parseInt(prompt("Ingrese el código del disco a buscar:"), 10);
  const disco = discos.find(d => d.codigo === codigo);
  if (!disco) return alert("Disco no encontrado");
  alert(`Disco encontrado: ${disco.nombre} de ${disco.autor}`);
  mostrar();
}
