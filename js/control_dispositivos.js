const API_LIST = "http://34.205.230.55:5000/api/estatus_dispositivos";
const API_ONOFF = "http://34.205.230.55:5000/api/encender_apagar";
const API_TEMP = "http://34.205.230.55:5000/api/cambiar_temperatura";

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("lista-dispositivos");
  tbody.innerHTML = "";

  let dispositivos = [];
  let modoDemo = false;

  try {
    const res = await fetch(API_LIST);
    dispositivos = await res.json();
  } catch (err) {
    console.warn("No se pudo conectar con la API. Modo demo activado.");
    modoDemo = true;
    dispositivos = [
      { id_dispositivo: 1, nombre: "Luz Principal", tipo: "Luz", laboratorio: "Lab IoT", encendido: true, temperatura_actual: null },
      { id_dispositivo: 2, nombre: "Aire Principal", tipo: "Clima", laboratorio: "Lab IoT", encendido: false, temperatura_actual: 22.5 }
    ];
  }

  dispositivos.forEach(d => insertarFila(tbody, d, modoDemo));
});

function insertarFila(tbody, d, demo) {
  const row = document.createElement("tr");
  const encendido = d.encendido === true;

  row.innerHTML = `
    <td>${d.nombre}</td>
    <td>${d.tipo}</td>
    <td>${d.laboratorio}</td>
    <td>
      <div class="estado-botones">
        <button class="btn-on ${encendido ? "" : "inactive"}">On</button>
        <button class="btn-off ${encendido ? "inactive" : ""}">Off</button>
      </div>
      ${d.tipo === 'Clima' ? `
        <div class="temp-control">
          <input type="number" id="temp-${d.id_dispositivo}" value="${d.temperatura_actual ?? ''}" min="16" max="30" step="0.5">
          <button class="btn-temp">Cambiar</button>
        </div>
      ` : ''}
    </td>
  `;

  tbody.appendChild(row);

  const btnOn = row.querySelector(".btn-on");
  const btnOff = row.querySelector(".btn-off");
  const btnTemp = row.querySelector(".btn-temp");

  btnOn.onclick = () => cambiarEstado(d.id_dispositivo, true, btnOn, btnOff, demo);
  btnOff.onclick = () => cambiarEstado(d.id_dispositivo, false, btnOn, btnOff, demo);

  if (btnTemp) {
    btnTemp.onclick = () => cambiarTemperatura(d.id_dispositivo, demo);
  }
}

function cambiarEstado(id, encender, btnOn, btnOff, demo) {
  btnOn.classList.toggle("inactive", !encender);
  btnOff.classList.toggle("inactive", encender);

  if (demo) return;

  fetch(API_ONOFF, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_dispositivo: id, estado: encender })
  })
  .then(res => res.json())
  .then(data => console.log("Respuesta encendido/apagado:", data))
  .catch(err => {
    console.error("Error en encender/apagar:", err);
    alert("No se pudo actualizar el dispositivo.");
  });
}

function cambiarTemperatura(id, demo) {
  if (demo) return;

  const input = document.getElementById(`temp-${id}`);
  const temperatura = parseFloat(input.value);

  if (isNaN(temperatura) || temperatura < 16 || temperatura > 30) {
    alert("Por favor ingresa una temperatura válida entre 16 y 30 °C.");
    return;
  }

  fetch(API_TEMP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_dispositivo: id, temperatura: temperatura })
  })
  .then(res => res.json())
  .then(data => {
    alert("Temperatura actualizada correctamente.");
    console.log("Respuesta temperatura:", data);
  })
  .catch(err => {
    console.error("Error al cambiar temperatura:", err);
    alert("No se pudo cambiar la temperatura.");
  });
}
