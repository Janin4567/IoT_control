document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('loginForm');
  const resetForm = document.getElementById('resetForm');
  const API_URL = "http://34.205.230.55:5000/api/index";

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 👈 importante para sesiones
        body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('¡Inicio de sesión exitoso!');

          // Redirigir según el rol del usuario
          if (data.rol === 'admin') {
            window.location.href = "../usuarios/usuarios_admin.html";
          } else if (data.rol === 'docente') {
            window.location.href = "../dispositivos/dispositivos_admin.html";
          } else {
            window.location.href = "../dashboard.html";
          }

        } else {
          alert('Credenciales incorrectas');
        }
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        alert("Ocurrió un error en el servidor.");
      });
    });
  }

  // === RECUPERAR CONTRASEÑA ===
  if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const resetEmail = document.getElementById('resetEmail').value;

      if (!resetEmail) {
        alert("Por favor, ingresa tu correo.");
        return;
      }

      fetch('http://34.205.230.55:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 👈 también aquí si el backend necesita sesión
        body: JSON.stringify({ email: resetEmail })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Solicitud de recuperación enviada.');
      })
      .catch(error => {
        console.error('Error al enviar recuperación:', error);
        alert("Error al enviar solicitud.");
      });
    });
  }
});
