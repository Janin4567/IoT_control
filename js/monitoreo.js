const API_URL = "http://34.205.230.55:5000/api/monitoreo";

const tbodyLuz = document.getElementById("tbody-luz");
const tbodyTemp = document.getElementById("tbody-temperatura");
const tbodyCam = document.getElementById("tbody-camara");

document.addEventListener("DOMContentLoaded", () => {
  cargarTabla("luz", tbodyLuz);
  cargarTabla("temperatura", tbodyTemp);
  cargarTabla("camara", tbodyCam);
});


async function cargarTabla(tipo, tbody) {
  try {
    const res = await fetch(`${API_URL}/ultimos_registros?tipo=${tipo}&limit=5`);
    const datos = await res.json();
    tbody.innerHTML = "";

    datos.forEach(reg => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${reg.nombre}</td>
        <td>${reg.tipo}</td>
        <td>${reg.laboratorio}</td>
        <td>${reg.estado === true || reg.estado === "true" ? "Encendido" : "Apagado"}</td>
        <td>${reg.temperatura ?? "–"}</td>
        <td>${formatearFecha(reg.fecha_hora)}</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error(`Error al cargar ${tipo}:`, err);
    tbody.innerHTML = `<tr><td colspan="6">No disponible.</td></tr>`;
  }
}

function formatearFecha(fechaIso) {
  const d = new Date(fechaIso);
  if (isNaN(d)) return fechaIso;
  return d.toLocaleString("es-MX", { hour12: false });
}

document.getElementById("btn-graficas").addEventListener("click", () => {
  window.location.href = "graficas_monitoreo.html";
});

