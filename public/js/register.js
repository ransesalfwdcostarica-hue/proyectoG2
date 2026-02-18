import { postUsuarios } from '../services/fetch.js';

document.getElementById('formulario-registro').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Capturar campos del formulario
    const nombre = document.getElementById('nombre-completo').value.trim();
    const cedula = document.getElementById('numero-cedula').value.trim();
    const correo = document.getElementById('correo-electronico').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const distrito = document.getElementById('distrito').value;
    const direccion = document.getElementById('direccion').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
    const terminos = document.getElementById('terminos').checked;

    // 1. Validar campos obligatorios
    if (!nombre || !cedula || !correo || !telefono || !distrito || !direccion || !contrasena || !confirmarContrasena) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete todos los campos obligatorios.',
            confirmButtonColor: '#004794'
        });
        return;
    }

    // 2. Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseñas no coinciden',
            text: 'La contraseña y su confirmación deben ser iguales.',
            confirmButtonColor: '#004794'
        });
        return;
    }

    // 3. Validar términos y condiciones
    if (!terminos) {
        Swal.fire({
            icon: 'warning',
            title: 'Términos y condiciones',
            text: 'Debe aceptar los términos y condiciones de privacidad para continuar.',
            confirmButtonColor: '#004794'
        });
        return;
    }

    // Crear objeto usuario
    const usuario = {
        nombre,
        cedula,
        correo,
        telefono,
        distrito,
        direccion,
        contrasena
    };

    try {
        // 5. Guardar usuario usando postUsuarios
        const datos = await postUsuarios(usuario);

        if (datos) {
            // 6. Registro exitoso
            await Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Su cuenta ha sido creada correctamente.',
                confirmButtonColor: '#004794'
            });

            // Limpiar formulario y redirigir
            document.getElementById('formulario-registro').reset();
            window.location.href = 'login.html';
        }
    } catch (error) {
        // 7. Error en el registro
        console.error('Error en el registro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de registro',
            text: 'Hubo un problema al procesar su solicitud. Intente nuevamente más tarde.',
            confirmButtonColor: '#004794'
        });
    }
});
