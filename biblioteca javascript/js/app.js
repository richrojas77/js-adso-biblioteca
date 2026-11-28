
// Todo va dentro de una función para que las variables de este
// archivo no choquen con las de filtros.js o formularios.js
(function () {
  "use strict";


  const estado = {
    libros: [],              // lista completa de libros
    texto: "",               // lo que se escribe en el buscador
    genero: "todos",         // género elegido en el select
    orden: "titulo-asc",     // forma de ordenar
    soloDisponibles: false   // checkbox "Solo disponibles"
  };

  // Nombres bonitos para mostrar cada género
  const NOMBRES_GENERO = {
    narrativa: "Narrativa",
    ciencia: "Ciencia",
    historia: "Historia",
    infantil: "Infantil",
    poesia: "Poesía",
    tecnologia: "Tecnología"
  };

  // =======================================================
  // 2. FUNCIONES DE APOYO
  // =======================================================

  // Selecciona un elemento (abreviatura de document.querySelector)
  function $(selector) {
    return document.querySelector(selector);
  }

  // Quita tildes y pasa a minúsculas para comparar textos
  // Ej: "Poesía" → "poesia"
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .trim();
  }

  // Lee los libros que ya existen en el HTML (data-*)
  // y los convierte en un arreglo de objetos
  function leerLibrosDelHTML() {
    const tarjetas = document.querySelectorAll("#lista-libros .libro");

    return Array.from(tarjetas).map(function (tarjeta) {
      const d = tarjeta.dataset;
      return {
        id: Number(d.id),
        titulo: d.titulo,
        autor: d.autor,
        genero: d.genero,
        anio: Number(d.anio),
        paginas: Number(d.paginas),
        estado: d.estado // "disponible" o "prestado"
      };
    });
  }

  // Aplica el buscador, el género y el checkbox
  function filtrarLibros(libros) {
    const texto = normalizar(estado.texto);

    return libros.filter(function (libro) {
      const coincideTexto =
        texto === "" ||
        normalizar(libro.titulo).includes(texto) ||
        normalizar(libro.autor).includes(texto);

      const coincideGenero =
        estado.genero === "todos" || libro.genero === estado.genero;

      const coincideEstado =
        !estado.soloDisponibles || libro.estado === "disponible";

      return coincideTexto && coincideGenero && coincideEstado;
    });
  }

  // Ordena según la opción elegida en el select #orden
  function ordenarLibros(libros) {
    const copia = libros.slice(); // no modificamos el arreglo original

    switch (estado.orden) {
      case "titulo-desc":
        return copia.sort((a, b) => b.titulo.localeCompare(a.titulo, "es"));
      case "autor-asc":
        return copia.sort((a, b) => a.autor.localeCompare(b.autor, "es"));
      case "anio-desc":
        return copia.sort((a, b) => b.anio - a.anio);
      case "anio-asc":
        return copia.sort((a, b) => a.anio - b.anio);
      case "paginas-asc":
        return copia.sort((a, b) => a.paginas - b.paginas);
      default: // "titulo-asc"
        return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    }
  }

  // Crea la tarjeta HTML de un libro (mismas clases que styles.css)
  function crearTarjeta(libro) {
    const columna = document.createElement("div");
    columna.className = "col-6 col-md-4 col-lg-3";

    const articulo = document.createElement("article");
    articulo.className = "libro libro--" + libro.genero;

    // Guardamos los datos también en data-* (filtros.js los usa)
    articulo.dataset.id = libro.id;
    articulo.dataset.titulo = libro.titulo;
    articulo.dataset.autor = libro.autor;
    articulo.dataset.genero = libro.genero;
    articulo.dataset.anio = libro.anio;
    articulo.dataset.paginas = libro.paginas;
    articulo.dataset.estado = libro.estado;

    const textoEstado = libro.estado === "disponible" ? "Disponible" : "Prestado";

    articulo.innerHTML = `
      <div class="libro__portada" aria-hidden="true">
        <span class="libro__inicial">${libro.titulo.charAt(0)}</span>
      </div>
      <div class="libro__cuerpo">
        <span class="libro__genero">${NOMBRES_GENERO[libro.genero] || libro.genero}</span>
        <h3 class="libro__titulo">${libro.titulo}</h3>
        <p class="libro__autor">${libro.autor}</p>
        <p class="libro__meta">${libro.anio} · ${libro.paginas} págs.</p>
        <span class="libro__estado libro__estado--${libro.estado}">${textoEstado}</span>
      </div>
    `;

    columna.appendChild(articulo);
    return columna;
  }

  
  function render() {
    const contenedor = $("#lista-libros");

    // Si la página no tiene catálogo (ej: contacto.html), no hacemos nada
    if (!contenedor) return;

    // 1) Filtrar y ordenar según el estado actual
    const resultado = ordenarLibros(filtrarLibros(estado.libros));

    // 2) Limpiar lo que había antes
    contenedor.innerHTML = "";

    // 3) Si no hay resultados, mostrar un mensaje
    if (resultado.length === 0) {
      const vacio = document.createElement("div");
      vacio.className = "col-12 text-center py-5 text-secondary";
      vacio.innerHTML =
        '<i class="fa-solid fa-book-open fa-2x mb-3 d-block"></i>' +
        "No encontramos libros con esos filtros.";
      contenedor.appendChild(vacio);
    } else {
      // 4) Crear una tarjeta por cada libro
      resultado.forEach(function (libro) {
        contenedor.appendChild(crearTarjeta(libro));
      });
    }

   
    const total = $("#total-libros");
    if (total) {
      const palabra = resultado.length === 1 ? "libro" : "libros";
      total.innerHTML = "<strong>" + resultado.length + "</strong> " + palabra;
    }

    console.log("render() → libros mostrados:", resultado.length);
  }

  
   // EVENTOS GENERALES

  function registrarEventos() {
    const buscador = $("#buscador");
    const formBuscador = $(".buscador");
    const filtroGenero = $("#filtro-genero");
    const orden = $("#orden");
    const soloDisponibles = $("#solo-disponibles");
    const hayCatalogo = $("#lista-libros") !== null;

    // --- Buscador: filtra mientras el usuario escribe ---
    if (buscador && hayCatalogo) {
      buscador.addEventListener("input", function () {
        estado.texto = buscador.value;
        render();
      });
    }

    // --- Botón de la lupa / tecla Enter en el buscador ---
    if (formBuscador) {
      formBuscador.addEventListener("submit", function (e) {
        // En productos.html no recargamos: bajamos al catálogo.
        // En las otras páginas dejamos que vaya a productos.html?q=...
        if (hayCatalogo) {
          e.preventDefault();
          estado.texto = buscador.value;
          render();
          const seccion = $("#libros");
          if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // --- Select de género ---
    if (filtroGenero) {
      filtroGenero.addEventListener("change", function () {
        estado.genero = filtroGenero.value;
        render();
      });
    }

    // --- Select de orden ---
    if (orden) {
      orden.addEventListener("change", function () {
        estado.orden = orden.value;
        render();
      });
    }

    // --- Checkbox "Solo disponibles" ---
    if (soloDisponibles) {
      soloDisponibles.addEventListener("change", function () {
        estado.soloDisponibles = soloDisponibles.checked;
        render();
      });
    }

    // --- Tecla Escape: limpia el buscador ---
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && buscador && buscador.value !== "") {
        buscador.value = "";
        estado.texto = "";
        render();
      }
    });

    // --- Menú en celular: se cierra al tocar un enlace ---
    const menuCheck = $("#navToggle");
    document.querySelectorAll("#mainNav .nav-link").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        if (menuCheck) menuCheck.checked = false;
      });
    });

    // --- Si la pantalla se agranda, cerramos el menú del celular ---
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992 && menuCheck) menuCheck.checked = false;
    });
  }


  function iniciar() {
    // Cargar los libros desde el HTML
    estado.libros = leerLibrosDelHTML();

    // Si venimos de otra página con una búsqueda (productos.html?q=quijote)
    const busquedaURL = new URLSearchParams(window.location.search).get("q");
    const buscador = $("#buscador");
    if (busquedaURL && buscador) {
      buscador.value = busquedaURL;
      estado.texto = busquedaURL;
    }

    // Tomar los valores iniciales de los controles
    const filtroGenero = $("#filtro-genero");
    const orden = $("#orden");
    const soloDisponibles = $("#solo-disponibles");
    if (filtroGenero) estado.genero = filtroGenero.value;
    if (orden) estado.orden = orden.value;
    if (soloDisponibles) estado.soloDisponibles = soloDisponibles.checked;

    registrarEventos();
    render();
  }

  // Esperamos a que el HTML esté cargado para empezar
  document.addEventListener("DOMContentLoaded", iniciar);
})();