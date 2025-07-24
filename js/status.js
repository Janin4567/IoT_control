document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("lista-dispositivos");

  try {
    const res = await fetch("http://34.205.230.55:5000/api/control_dispositivos");
    const dispositivos = await res.json();

    dispositivos.forEach(d => {
      const div = document.createElement("div");
      div.className = "dispositivo";

      div.innerHTML = `
        <span>${d.nombre} (${d.tipo}) – ${d.laboratorio}</span>
        <button class="${d.estado === 'true' ? 'on' : 'off'}" onclick="cambiarEstado(${d.id}, true)">Encendido</button>
        <button class="${d.estado === 'off' ? 'off' : 'on'}" onclick="cambiarEstado(${d.id}, false)">Apagado</button>
      `;

      lista.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar dispositivos:", error);
  }
});

async function cambiarEstado(id, encender) {
  try {
    await fetch("http://34.205.230.55:5000/api/actualizar_estado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, estado: encender ? "true" : "off" })
    });
    location.reload();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
}
