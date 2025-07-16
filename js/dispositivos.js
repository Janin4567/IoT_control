document.addEventListener('DOMContentLoaded', () => {
  cargarDispositivos();

  // Manejo del formulario de agregar dispositivo
  document.getElementById("formAgregar").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());
    data.id = dispositivos.length + 1;

    // Enviar datos al backend para agregar el dispositivo
    fetch('http://34.205.230.55:5000/api/agregar_dispositivo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      this.reset();
      ocultarFormularioAgregar();
      mostrarMensaje("Dispositivo agregado correctamente");
      cargarDispositivos();
    })
    .catch(error => {
      console.error('Error al agregar dispositivo:', error);
    });
  });

  // Manejo del formulario de editar dispositivo
  document.getElementById("formEditar").addEventListener("submit", function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());

    // Enviar datos al backend para editar el dispositivo
    fetch('http://34.205.230.55:5000/api/editar_dispositivo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      cancelarEdicion();
      mostrarMensaje("Dispositivo actualizado correctamente");
      cargarDispositivos();
    })
    .catch(error => {
      console.error('Error al actualizar dispositivo:', error);
    });
  });
});

// Datos de dispositivos
let dispositivos = [
  { id: 1, nombre: 'Aire Principal', tipo: 'Clima', laboratorio: 'Laboratorio IoT', marca: 'Trane', modelo: 'X300', descripcion: 'Aire acondicionado inteligente' },
  { id: 2, nombre: 'Luz Principal', tipo: 'Luz', laboratorio: 'Laboratorio IoT', marca: 'Royer', modelo: 'Royer 100', descripcion: 'Luz inteligente principal' },
  { id: 3, nombre: 'Cámara Principal', tipo: 'Cámara', laboratorio: 'Laboratorio IoT', marca: 'ARLO', modelo: 'FB1001-100NAS', descripcion: 'Cámara de videovigilancia' },
];

// Cargar dispositivos en la tabla
function cargarDispositivos() {
  const tbody = document.getElementById("tabla-dispositivos-body");
  tbody.innerHTML = "";
  dispositivos.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.nombre}</td>
        <td>${d.tipo}</td>
        <td>${d.laboratorio}</td>
        <td>${d.marca}</td>
        <td>${d.modelo}</td>
        <td>${d.descripcion}</td>
        <td>
          <button onclick="abrirEditar(${d.id})">Editar</button>
          <button onclick="eliminar(${d.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// Mostrar formulario de agregar dispositivo
function mostrarFormularioAgregar() {
  document.getElementById("formAgregarSeccion").style.display = "block";
  document.getElementById("formEditarSeccion").style.display = "none";
  window.scrollTo({ top: document.getElementById("formAgregarSeccion").offsetTop, behavior: "smooth" });
}

// Ocultar formulario de agregar dispositivo
function ocultarFormularioAgregar() {
  document.getElementById("formAgregarSeccion").style.display = "none";
}

// Abrir formulario de editar dispositivo
function abrirEditar(id) {
  const dispositivo = dispositivos.find(d => d.id === id);
  const form = document.getElementById("formEditar");
  form.id.value = dispositivo.id;
  form.nombre.value = dispositivo.nombre;
  form.tipo.value = dispositivo.tipo;
  form.laboratorio.value = dispositivo.laboratorio;
  form.marca.value = dispositivo.marca;
  form.modelo.value = dispositivo.modelo;
  form.descripcion.value = dispositivo.descripcion;

  document.getElementById("formEditarSeccion").style.display = "block";
  document.getElementById("formAgregarSeccion").style.display = "none";
  window.scrollTo({ top: document.getElementById("formEditarSeccion").offsetTop, behavior: "smooth" });
}

// Cancelar la edición de un dispositivo
function cancelarEdicion() {
  document.getElementById("formEditarSeccion").style.display = "none";
}

// Eliminar dispositivo
function eliminar(id) {
  if (confirm("¿Deseas eliminar este dispositivo?")) {
    // Enviar solicitud al backend para eliminar un dispositivo
    fetch(`http://34.205.230.55:5000/api/eliminar_dispositivo/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      dispositivos = dispositivos.filter(d => d.id !== id);
      cargarDispositivos();
      mostrarMensaje("Dispositivo eliminado");
    })
    .catch(error => {
      console.error('Error al eliminar dispositivo:', error);
    });
  }
}

// Mostrar mensaje de éxito
function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensajeExito");
  mensaje.textContent = "✅ " + texto;
  mensaje.style.display = "block";
  setTimeout(() => mensaje.style.display = "none", 3000);
}
