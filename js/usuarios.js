const usuariosBody = document.getElementById("usuariosBody");

// Cargar los usuarios desde el backend
function cargarUsuarios() {
  fetch('http://34.205.230.55:5000/api/usuarios') // Ruta del backend
    .then(response => response.json())
    .then(data => {
      renderUsuarios(data);
    })
    .catch(error => console.error('Error al cargar los usuarios:', error));
}

function renderUsuarios(usuarios) {
  usuariosBody.innerHTML = "";
  usuarios.forEach(usuario => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.fecha}</td>
      <td>
        <button class="edit-btn" onclick="abrirEditar(${usuario.id})">✏️</button>
        <button class="delete-btn" onclick="eliminarUsuario(${usuario.id})">🗑️</button>
      </td>
    `;
    usuariosBody.appendChild(fila);
  });
}

// Evento para agregar un nuevo usuario
document.getElementById("formUsuario").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const rol = document.getElementById("rol").value;
  const contrasena = document.getElementById("contrasena").value;

  const nuevoUsuario = {
    nombre, correo, rol, contrasena,
    fecha: new Date().toISOString().slice(0, 10)
  };

  // Enviar los datos al backend
  fetch('http://34.205.230.55:5000/api/agregar_usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nuevoUsuario)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      cargarUsuarios();
      document.getElementById("modalUsuario").style.display = "none";
    } else {
      alert("Error al agregar el usuario");
    }
  })
  .catch(error => console.error('Error al agregar el usuario:', error));

  e.target.reset();
});

// Abrir modal de editar usuario
function abrirEditar(id) {
  fetch(`http://34.205.230.55:5000/api/usuarios/${id}`) // Obtener usuario desde el backend
    .then(response => response.json())
    .then(usuario => {
      document.getElementById("edit-id").value = usuario.id;
      document.getElementById("edit-nombre").value = usuario.nombre;
      document.getElementById("modalEditar").style.display = "block";
    })
    .catch(error => console.error('Error al cargar el usuario para editar:', error));
}

// Evento para editar un usuario
document.getElementById("formEditar").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("edit-id").value);
  const nombre = document.getElementById("edit-nombre").value;
  const contrasena = document.getElementById("edit-contrasena").value;

  const usuarioEditado = { id, nombre, contrasena };

  // Enviar los datos actualizados al backend
  fetch('http://34.205.230.55:5000/api/editar_usuario', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuarioEditado)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      cargarUsuarios();
      document.getElementById("modalEditar").style.display = "none";
    } else {
      alert("Error al actualizar el usuario");
    }
  })
  .catch(error => console.error('Error al actualizar el usuario:', error));
});

// Eliminar usuario
function eliminarUsuario(id) {
  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    // Enviar solicitud al backend para eliminar el usuario
    fetch(`http://34.205.230.55:5000/api/eliminar_usuario/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        cargarUsuarios();
      } else {
        alert("Error al eliminar el usuario");
      }
    })
    .catch(error => console.error('Error al eliminar el usuario:', error));
  }
}

// Inicializar los usuarios al cargar la página
cargarUsuarios();
