import { obtenerUsuarios } from '../services/fetch.js';

document.getElementById('formulario-login').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const correo = document.getElementById('correo-electronico').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    try {
        // 3. Obtener usuarios usando obtenerUsuarios()
        const usuarios = await obtenerUsuarios();

        // 4. Buscar coincidencia
        const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

        if (usuarioEncontrado) {
            // 5. Si las credenciales son correctas
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));

            await Swal.fire({
                icon: 'success',
                title: '¡Bienvenido(a)!',
                text: `Hola ${usuarioEncontrado.nombre}, has iniciado sesión correctamente.`,
                confirmButtonColor: '#004794'
            });

            // Redirigir a index.html
            window.location.href = 'index.html';
        } else {
            // 6. Si son incorrectas
            Swal.fire({
                icon: 'error',
                title: 'Credenciales inválidas',
                text: 'El correo o la contraseña son incorrectos.',
                confirmButtonColor: '#004794'
            });
        }
    } catch (error) {
        // 7. Manejar errores con try/catch
        console.error('Error en el inicio de sesión:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Hubo un problema al conectar con el servidor. Intente más tarde.',
            confirmButtonColor: '#004794'
        });
    }
});
