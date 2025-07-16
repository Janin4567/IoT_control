document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tabla-estatus");
  const btnActualizar = document.getElementById("btn-actualizar");

  async function cargarDatos() {
    tabla.innerHTML = "";

    try {
      const res = await fetch("http://34.205.230.55:5000/api/status_dispositivos");
      const dispositivos = await res.json();

      dispositivos.forEach(d => {
        const fila = document.createElement("tr");

        const encendido = d.estado === "true";
        const temperatura = d.temperatura || "–";
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString();

        fila.innerHTML = `
          <td>${d.nombre}</td>
          <td>${d.tipo}</td>
          <td>${d.laboratorio}</td>
          <td><div class="switch ${encendido ? "on" : ""}"></div></td>
          <td>${temperatura}</td>
          <td>${fechaHora}</td>
        `;

        tabla.appendChild(fila);
      });

    } catch (err) {
      console.error("No se pudo obtener datos de la API:", err);

      const prueba = [
        { nombre: "Luz Principal", tipo: "Luz", laboratorio: "Lab IoT", estado: "true" },
        { nombre: "Aire Acondicionado", tipo: "Clima", laboratorio: "Lab 1", estado: "off", temperatura: "-" },
        { nombre: "Cámara 1", tipo: "Cámara", laboratorio: "Lab IoT", estado: "true" },
      ];

      prueba.forEach(d => {
        const fila = document.createElement("tr");
        const encendido = d.estado === "true";
        const ahora = new Date();
        const fechaHora = ahora.toLocaleString();

        fila.innerHTML = `
          <td>${d.nombre}</td>
          <td>${d.tipo}</td>
          <td>${d.laboratorio}</td>
          <td><div class="switch ${encendido ? "on" : ""}"></div></td>
          <td>${d.temperatura || "–"}</td>
          <td>${fechaHora}</td>
        `;

        tabla.appendChild(fila);
      });
    }
  }

  if (btnActualizar) {
    btnActualizar.addEventListener("click", cargarDatos);
  }

  cargarDatos(); // carga al iniciar
});
