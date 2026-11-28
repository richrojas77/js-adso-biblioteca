// Seleccionar el formulario
const formulario = document.querySelector("#contactForm");
// Seleccionar los campos
const nombre = document.querySelector("#nombre");
const email = document.querySelector("#email");
const telefono = document.querySelector("#telefono");
const asunto = document.querySelector("#asunto");
const mensaje = document.querySelector("#mensaje");
const privacidad = document.querySelector("#privacidad");
// Seleccionar el mensaje de confirmación
const mensajeEnviado = document.querySelector("#enviado");

// Ocultar el mensaje de confirmación al iniciar
mensajeEnviado.style.display = "none";

//2. EVENTO PARA ENVIAR EL FORMULARIO
// Escuchamos cuando el usuario intenta enviar el formulario
formulario.addEventListener("submit", function(e) {
    // Evitamos que el navegador cambie de página
    e.preventDefault();
    // Variable que indica si los datos son válidos
    let valido = true;
    // Arreglo para guardar los errores
    let errores = [];



    //3. VALIDAR EL NOMBRE
    let nombreUsuario = nombre.value.trim();
    if (nombreUsuario === "") {
        errores.push("El nombre es obligatorio.");
        valido = false;
    } else if (nombreUsuario.length < 3) {
        errores.push("El nombre debe tener mínimo 3 caracteres.");
        valido = false;
    }

    //4. VALIDAR EL CORREO
    let correoUsuario = email.value.trim();
    // Expresión regular para validar el correo
    let validarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (correoUsuario === "") {
        errores.push("El correo electrónico es obligatorio.");
        valido = false;
    } else if (!validarCorreo.test(correoUsuario)) {
        errores.push("Ingresa un correo electrónico válido.");
        valido = false;
    }


    //5. VALIDAR EL TELÉFONO
    let telefonoUsuario = telefono.value.trim();
    // Contamos solamente los números ingresados
    let digitosTelefono = telefonoUsuario.replace(/\D/g, "");
    // El teléfono es opcional
    if (telefonoUsuario !== "") {
        // Permitimos números, espacios, guiones y + al principio
        let formatoTelefono = /^\+?[0-9\s-]+$/;
        if (
            !formatoTelefono.test(telefonoUsuario) ||
            digitosTelefono.length < 7 ||
            digitosTelefono.length > 15
        ) {
            errores.push(
                "El teléfono debe tener entre 7 y 15 números y no contener letras."
            );
            valido = false;
        }
    }

    //6. VALIDAR EL ASUNTO
    let asuntoUsuario = asunto.value;
    if (asuntoUsuario === "") {
        errores.push("Debes seleccionar un asunto.");
        valido = false;
    }
    
    //7. VALIDAR EL MENSAJE
    let mensajeUsuario = mensaje.value.trim();
    if (mensajeUsuario === "") {
        errores.push("El mensaje es obligatorio.");
        valido = false;
    } else if (mensajeUsuario.length < 10) {
        errores.push("El mensaje debe tener mínimo 10 caracteres.");
        valido = false;
    }

    //8. VALIDAR LA POLÍTICA DE PRIVACIDAD
    if (!privacidad.checked) {
        errores.push("Debes aceptar la política de privacidad.");
        valido = false;
    }

    //9. COMPROBAR SI HAY ERRORES
    if (!valido) {
        // Mostramos todos los errores encontrados
        alert(
            "Por favor, revisa los siguientes errores:\n\n" +
            errores.join("\n")
        );
        // Detenemos la función
        return;
    }

    //10. MOSTRAR MENSAJE DE ÉXITO
    // Mostramos el mensaje de confirmación
    mensajeEnviado.textContent =
        "¡Formulario validado correctamente! Gracias " +
        nombreUsuario +
        ", por contactar con Biblioteca Aurora.";

    // Hacemos visible el mensaje
    mensajeEnviado.style.display = "block";


    //11. LIMPIAR EL FORMULARIO
    // Limpiamos todos los campos
    formulario.reset();

});
