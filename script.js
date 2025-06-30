function calcularPrecio() {
  const tipo = document.getElementById('tipo').value;
  const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
  const anillado = document.getElementById('anillado').checked;

  let precioPorHoja = tipo === "color" ? 150 : 70;
  let total = cantidad * precioPorHoja;

  if (anillado) {
    if (cantidad <= 220) {
      total += 1500;
    } else if (cantidad <= 400) {
      total += 1000;
    } else {
      alert("No se puede anillar más de 400 hojas.");
      document.getElementById('anillado').checked = false;
    }
  }

  document.getElementById('precio').textContent = `El precio total es: $${total}`;
  return total;
}

function enviarWhatsApp() {
  const tipo = document.getElementById('tipo').value;
  const tipoTexto = tipo === "color" ? "a color" : "blanco y negro";
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const anillado = document.getElementById('anillado').checked;

  if (!cantidad || cantidad <= 0) {
    alert("Por favor ingresá una cantidad válida.");
    return;
  }

  const total = calcularPrecio();
  const anilladoTexto = anillado ? "Sí" : "No";

  const mensaje = `Hola. Estoy interesado en las impresiones.\nQuiero ${cantidad} hoja(s) ${tipoTexto}.\nAnillado: ${anilladoTexto}.\nPrecio total: $${total}.`;

  const numero = "5491165397417"; // ← Reemplazá por tu número sin "+" ni espacios
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}
