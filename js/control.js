const API_BASE = "http://34.205.230.55:5000";

document.addEventListener("DOMContentLoaded", () => {
  cargarDispositivos();
});

function cargarDispositivos() {
  fetch(`${API_BASE}/api/estatus_dispositivos`)
    .then(res => res.json())
    .then(data => mostrarDispositivos(data))
    .catch(err => console.error("Error al cargar dispositivos:", err));
}

function mostrarDispositivos(dispositivos) {
  const contenedor = document.getElementById("dispositivos-container");
  contenedor.innerHTML = "";

  dispositivos.forEach(d => {
    const div = document.createElement("div");
    div.className = "dispositivo";

    div.innerHTML = `
      <span>${d.dispositivo} (${d.tipo}) - ${d.laboratorio}</span>
      <span class="estado">${d.encendido ? "Encendido" : "Apagado"}</span>
      <button class="${d.encendido ? "apagar" : "encender"}"
        onclick="cambiarEstado(${d.id_dispositivo}, ${!d.encendido})">
        ${d.encendido ? "Apagar" : "Encender"}
      </button>
    `;

    contenedor.appendChild(div);
  });
}

function cambiarEstado(id, nuevoEstado) {
  const temperatura = 22;
  const usuario_id = 1;

  fetch(`${API_BASE}/api/estado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      dispositivo_id: id,
      nuevo_estado: nuevoEstado,
      nueva_temp: temperatura,
      usuario_id: usuario_id
    })
  })
  .then(res => {
    if (res.ok) return res.json();
    throw new Error("Error al cambiar estado");
  })
  .then(data => {
    alert(data.mensaje || "Estado cambiado correctamente");
    cargarDispositivos(); // Recarga los estados
  })
  .catch(err => alert("Error: " + err.message));
}
