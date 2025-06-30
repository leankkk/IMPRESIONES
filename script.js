function leerPDF() {
  const fileInput = document.getElementById('pdfInput');
  const file = fileInput.files[0];
  const cantidadInput = document.getElementById('cantidad');

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const typedarray = new Uint8Array(e.target.result);
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        const numeroDePaginas = pdf.numPages;

        // Establecer la cantidad de páginas en el campo de entrada
        cantidadInput.value = numeroDePaginas;

        // Deshabilitar el campo de cantidad para evitar que se edite manualmente
        cantidadInput.disabled = true;

        // Calcular el precio con la cantidad de páginas
        calcularPrecio();
      });
    };
    reader.readAsArrayBuffer(file);
  }
}

function permitirEdicion() {
  const cantidadInput = document.getElementById('cantidad');
  
  // Habilitar nuevamente el campo de cantidad si el usuario selecciona otro archivo
  cantidadInput.disabled = false;
  cantidadInput.value = ''; // Limpiar el campo
}

function calcularPrecio() {
  const tipo = document.getElementById('tipo').value;
  const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
  const anillado = document.getElementById('anillado').checked;

  let precioPorHoja = tipo === "color" ? 150 : 70;
  let total = cantidad * precioPorHoja;

  if (anillado && cantidad <= 220) {
    total += 1500;
  } else if (anillado && cantidad <= 400) {
    total += 1000;
  } else if (anillado && cantidad > 400) {
    alert("No se puede anillar más de 400 hojas.");
    document.getElementById('anillado').checked = false;
  }

  document.getElementById('precio').textContent = `El precio total es: $${total}`;

  // Mostrar aviso
  document.getElementById('aviso').textContent = "Este precio es aproximado. Si compra por cantidad, es posible que se le haga un descuento.";

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

  const numero = "5491165397417"; // Reemplazá por tu número real
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}
