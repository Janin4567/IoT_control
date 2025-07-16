/* -------- CONFIG -------- */
const API_BASE = "http://34.205.230.55:5000/api/monitoreo";
const REFRESH_MS = 60_000;
const contenedor = document.getElementById("graficas-container");
const selector = document.getElementById("tipo-select");

/* Cargar Google Charts */
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(inicializar);

function inicializar() {
  
  const graficas = [
    { id: "pastel", titulo: "Dispositivos Encendidos" },
    { id: "barras", titulo: "Encendidos por Hora" },
    { id: "linea", titulo: "Temperatura Promedio por Hora" }
  ];

  graficas.forEach(g => {
    const box = document.createElement("div");
    box.className = "grafica-box";
    box.innerHTML = `
      <h3>${g.titulo}</h3>
      <div id="grafica-${g.id}" style="width: 100%; height: 300px"></div>
    `;
    contenedor.appendChild(box);
  });

  actualizarGraficas();
  setInterval(actualizarGraficas, REFRESH_MS);
}

selector.addEventListener("change", () => actualizarGraficas());

async function actualizarGraficas() {
  const tipo = selector.value;
  try {
    const res = await fetch(`${API_BASE}/datos_dia?tipo=${tipo}`);
    if (!res.ok) throw new Error("API err");
    const data = await res.json();
    procesarDatos(data);
  } catch (err) {
    console.error("Graficas:", err);
  }
}

function procesarDatos(data) {
  const dispositivos = [...new Set(data.map(r => r.nombre))];
  const horas = [...new Set(data.map(r => r.hora))].sort();

  const encendidos = dispositivos.map(nombre => [nombre, data.filter(r => r.nombre === nombre && (r.estado === true || r.estado === "true")).length]);
  dibujarPastel("grafica-pastel", [["Dispositivo", "Encendidos"], ...encendidos], "Dispositivos Encendidos");

  const encendidosHora = horas.map(h => [h, data.filter(r => r.hora === h && (r.estado === true || r.estado === "true")).length]);
  dibujarBarras("grafica-barras", [["Hora", "Encendidos"], ...encendidosHora], "Encendidos por Hora");

  const tempHora = horas.map(hora => {
    const registros = data.filter(r => r.hora === hora && r.temperatura != null);
    const promedioTemp = registros.length ? promedio(registros.map(r => +r.temperatura)) : null;
    return [hora, promedioTemp];
  });
  dibujarLinea("grafica-linea", [["Hora", "Temp °C"], ...tempHora], "Temperatura Promedio por Hora");
}

function dibujarPastel(id, datos, titulo) {
  const data = google.visualization.arrayToDataTable(datos);
  const chart = new google.visualization.PieChart(document.getElementById(id));
  chart.draw(data, { title: titulo, height: 300 });
}

function dibujarBarras(id, datos, titulo) {
  const data = google.visualization.arrayToDataTable(datos);
  const chart = new google.visualization.ColumnChart(document.getElementById(id));
  chart.draw(data, { title: titulo, height: 300 });
}

function dibujarLinea(id, datos, titulo) {
  const data = google.visualization.arrayToDataTable(datos);
  const chart = new google.visualization.LineChart(document.getElementById(id));
  chart.draw(data, { title: titulo, height: 300, curveType: 'function' });
}

const promedio = arr => arr.reduce((sum, val) => sum + val, 0) / arr.length || 0;
