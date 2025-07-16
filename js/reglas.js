document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-regla");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nuevaRegla = {
        descripcion: form.descripcion.value,
        condicion: form.condicion.value,
        accion: form.accion.value,
        hora_inicio: form.hora_inicio.value || null,
        hora_fin: form.hora_fin.value || null,
        duracion_maxima: form.duracion_maxima.value || null,
        estado: form.estado.value
      };

      fetch("http://34.205.230.55:5000/api/reglas/nueva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaRegla)
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Regla agregada correctamente.");
            form.reset();
            cerrarModal();
            cargarReglas();
          } else {
            alert("Error al guardar la regla.");
          }
        })
        .catch(err => {
          console.error("Error:", err);
          alert("Error de conexión.");
        });
    });
  }
});
