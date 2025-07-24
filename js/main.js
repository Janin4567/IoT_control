// === main.js ===
function mostrarModal() {
  document.getElementById('modalUsuario').style.display = 'block';
}

function cerrarModal() {
  document.getElementById('modalUsuario').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('modalUsuario');
  if (event.target === modal) {
    cerrarModal();
  }
}

function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

window.addEventListener("click", function (e) {
  const dropdown = document.getElementById("dropdown-menu");
  const button = document.querySelector(".user-btn");

  if (!button.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

