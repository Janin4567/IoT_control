const laboratorios = [
  { id: 1, nombre: "Laboratorio IoT", ubicacion: "Modulo 1 – Planta Alta" },
  { id: 2, nombre: "Laboratorio 1", ubicacion: "" },
  { id: 3, nombre: "Laboratorio 2", ubicacion: "" }
];

const tbody = document.getElementById("laboratoriosBody");

laboratorios.forEach(lab => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${lab.id}</td>
    <td>${lab.nombre}</td>
    <td>${lab.ubicacion}</td>
    <td><a onclick="editarLaboratorio(${lab.id})">Editar</a></td>
  `;
  tbody.appendChild(fila);
});

function nuevoLaboratorio() {
  alert("Funcionalidad para añadir laboratorio no implementada aún.");
}

function editarLaboratorio(id) {
  alert(`Editar laboratorio con ID: ${id}`);
}

function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function nuevoLaboratorio() {
  const tbody = document.getElementById("laboratoriosBody");
  const newRow = document.createElement("tr");

  const id = tbody.rows.length + 1;

  newRow.innerHTML = `
    <td>${id}</td>
    <td contenteditable="true">Nuevo Laboratorio</td>
    <td contenteditable="true">Ubicación</td>
    <td><a href="#">Editar</a></td>
  `;
  tbody.appendChild(newRow);
}
