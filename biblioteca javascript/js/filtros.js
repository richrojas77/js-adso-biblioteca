// Seleccionar el buscador
const input = document.querySelector("#buscador");

// Seleccionar el contenedor de los libros
const contenedor = document.querySelector("#lista-libros");

// Obtener todos los libros
const tarjetas = document.querySelectorAll(".libro");

// Usar MAP para crear un arreglo con la información de los libros
const libros = Array.from(tarjetas).map(function (libro) {
    return {
        titulo: libro.dataset.titulo.toLowerCase(),
        autor: libro.dataset.autor.toLowerCase(),
        elemento: libro.parentElement
    };
});

// Función para buscar libros
function filtrarLibros() {

    // Obtener el texto que escribe el usuario
    const texto = input.value.toLowerCase().trim();

    // Usar FILTER para encontrar libros que coincidan
    const resultados = libros.filter(function (libro) {
        return libro.titulo.includes(texto) ||
               libro.autor.includes(texto);
    });

    // Ocultar todos los libros
    libros.map(function (libro) {
        libro.elemento.style.display = "none";
    });

    // Mostrar solamente los libros encontrados
    resultados.map(function (libro) {
        libro.elemento.style.display = "";
    });

    console.log("Libros encontrados:", resultados.length);
}

// Detectar cuando el usuario escribe
input.addEventListener("input", filtrarLibros);