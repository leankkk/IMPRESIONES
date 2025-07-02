const librosConocidos = [
  { titulo: "Toldot 1(ByN)", precio: 8000 },
  { titulo: "Toldot 1 (Color)", precio:15500 },
  { titulo: "Toldot 2(Byn)", precio: 7300 },
  { titulo: "Toldot 2(Color)", precio: 13900 },
  { titulo: "Toldot 3(Byn)", precio: 9000 },
  { titulo: "Toldot 3(Color)", precio: 17000},
  { titulo: "Toldot 4(ByN)", precio: 15030 },
  { titulo: "Toldot 4(Color)", precio: 30000 },
  { titulo: "Toldot 4(Color)", precio: 30000 },
  { titulo: "Dr Jekyll y MR Hyde", precio: 5000 },
  { titulo: "Apunte biologia 1°(ByN)", precio: 9200 },
  { titulo: "Apunte biologia 1°(color)", precio: 17000 },
  { titulo: "Apunte biologia 2° 1ra parte(ByN)", precio: 4500 },
  { titulo: "Apunte biologia 2° 1ra parte(color)", precio: 6800 },
  { titulo: "Apunte biologia 2° 2ra parte(ByN)", precio: 7200 },
  { titulo: "Apunte biologia 2° 2ra parte(color)", precio: 13500 },
];

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
        cantidadInput.value = numeroDePaginas;
        cantidadInput.disabled = true;
        calcularPrecio();
      });
    };
    reader.readAsArrayBuffer(file);
  }
}

function permitirEdicion() {
  const cantidadInput = document.getElementById('cantidad');
  cantidadInput.disabled = false;
  cantidadInput.value = '';
}

function toggleLibroSinCantidad() {
  const checkbox = document.getElementById('sinCantidad');
  const inputLibro = document.getElementById('tituloLibro');

  if (checkbox.checked) {
    inputLibro.style.display = 'block';
  } else {
    inputLibro.style.display = 'none';
    inputLibro.value = '';
  }

  calcularPrecio();
}

document.getElementById("tituloLibro").addEventListener("input", function () {
  const entrada = this.value.toLowerCase();
  const lista = document.getElementById("sugerenciasLibros");
  lista.innerHTML = "";

  if (!entrada) return;

  const coincidencias = librosConocidos.filter(libro =>
    libro.titulo.toLowerCase().includes(entrada)
  );

  coincidencias.forEach(libro => {
    const item = document.createElement("li");
    item.textContent = `${libro.titulo} - $${libro.precio}`;
    item.classList.add("item-sugerencia");
    item.onclick = () => {
      document.getElementById("tituloLibro").value = libro.titulo;
      document.getElementById("cantidad").value = "";
      document.getElementById("cantidad").disabled = true;
      document.getElementById("pdfInput").value = "";
      document.getElementById("precio").textContent = `Precio del libro: $${libro.precio}`;
      lista.innerHTML = "";

      document.getElementById("tituloLibro").setAttribute("data-precio", libro.precio);
    };
    lista.appendChild(item);
  });
});

function calcularPrecio() {
  const tipo = document.getElementById('tipo').value;
  const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
  const anillado = document.getElementById('anillado').checked;
  const sinCantidad = document.getElementById('sinCantidad').checked;
  const tituloLibro = document.getElementById('tituloLibro').value.trim();

  if (sinCantidad && tituloLibro) {
    const precioManual = document.getElementById("tituloLibro").getAttribute("data-precio");
    if (precioManual) {
      document.getElementById('precio').textContent = `Libro solicitado: "${tituloLibro}" - $${precioManual}`;
    } else {
      document.getElementById('precio').textContent = `Libro solicitado: "${tituloLibro}"`;
    }
    return 0;
  }

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
  document.getElementById('aviso').textContent = "Este precio es aproximado. Si compra por cantidad, es posible que se le haga un descuento.";

  return total;
}

function enviarWhatsApp() {
  const tipo = document.getElementById('tipo').value;
  const tipoTexto = tipo === "color" ? "a color" : "blanco y negro";
  const cantidad = parseInt(document.getElementById('cantidad').value);
  const anillado = document.getElementById('anillado').checked;
  const sinCantidad = document.getElementById('sinCantidad').checked;
  const tituloLibro = document.getElementById('tituloLibro').value.trim();

  let mensaje = "";

  if (sinCantidad && tituloLibro) {
    const precioManual = document.getElementById("tituloLibro").getAttribute("data-precio");
    if (precioManual) {
      mensaje = `Hola, quiero el libro "${tituloLibro}". Precio fijo: $${precioManual}`;
    } else {
      mensaje = `Hola. Quiero pedir el siguiente libro :\n"${tituloLibro}"`;
    }
  } else {
    if (!cantidad || cantidad <= 0) {
      alert("Por favor ingresá una cantidad válida o completá el título del libro.");
      return;
    }

    const total = calcularPrecio();
    const anilladoTexto = anillado ? "Sí" : "No";

    mensaje = `Hola. Estoy interesado en las impresiones.\nQuiero ${cantidad} hoja(s) ${tipoTexto}.\nAnillado: ${anilladoTexto}.\nPrecio total: $${total}.`;
  }

  const numero = "5491165397417"; 
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}
