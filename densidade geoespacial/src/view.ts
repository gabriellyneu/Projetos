export const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Densidade Geoespacial</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>
  :root {
    --bg: #121212;
    --card: #1e1e1e;
    --text: #ffffff;
    --accent: #999999;
  }
  body {
    font-family: 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--text);
    margin: 0;
    padding: 20px;
  }
  h1 {
    font-weight: 500;
    text-align: center;
    margin-bottom: 16px;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    background: var(--card);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  label {
    font-size: 14px;
    color: var(--accent);
    margin-top: 10px;
    display: block;
  }
  input, textarea, button {
    width: 100%;
    background: #2b2b2b;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px;
    margin-top: 6px;
    font-size: 14px;
  }
  button {
    background: #444;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
  }
  button:hover {
    background: #666;
  }
  #map {
    height: 360px;
    border-radius: 10px;
    margin-top: 16px;
  }
  .result {
    margin-top: 16px;
    background: #2a2a2a;
    border-radius: 8px;
    padding: 12px;
    line-height: 1.5;
    white-space: pre-line;
  }
</style>
</head>
<body>
  <h1>Calculadora de Densidade Populacional</h1>
  <div class="container">
    <label for="people">Número de pessoas:</label>
    <input id="people" type="number" placeholder="Digite o número de pessoas"/>

    <label for="coords">Coordenadas (latitude, longitude):</label>
    <textarea id="coords" placeholder="Ex: -23.211,-46.011\\n-23.211,-46.012\\n-23.212,-46.012\\n-23.212,-46.011"></textarea>

    <button id="calc">Calcular Densidade</button>

    <div id="map"></div>
    <div class="result" id="result"></div>
  </div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map').setView([-23.21, -46.011], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  let layer = null;

  document.getElementById('calc').addEventListener('click', async () => {
    const people = Number(document.getElementById('people').value);
    const lines = document.getElementById('coords').value.trim().split(/\\n+/);
    const coords = [];
    for (const line of lines) {
      const [lat, lon] = line.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lon)) coords.push([lon, lat]); // Turf usa [lon,lat]
    }

    if (coords.length < 3) {
      alert('Informe pelo menos 3 coordenadas válidas (latitude, longitude).');
      return;
    }

    const res = await fetch('/density', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ people, coordinates: coords })
    });
    const data = await res.json();

    document.getElementById('result').innerText =
      'Área: ' + data.area_m2.toFixed(2) + ' m²\\n' +
      'Densidade: ' + data.density_p_m2.toExponential(6) + ' (pessoas/m²)\\n';
      

    if (layer) map.removeLayer(layer);
    const latlngs = coords.map(p => [p[1], p[0]]);
    layer = L.polygon(latlngs, {color:'#7c69d1ff'}).addTo(map);
    map.fitBounds(layer.getBounds(), {padding:[20,20]});
  });
</script>
</body>
</html>`;
