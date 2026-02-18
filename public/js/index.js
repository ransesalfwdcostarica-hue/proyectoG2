import { postDatos } from '../services/fetch.js';

document.getElementById('btn-reportar').addEventListener('click', async () => {
    const { value: formValues } = await Swal.fire({
        title: 'Reportar Incidencia',
        html:
            '<input id="swal-nombre" class="swal2-input" placeholder="Nombre completo">' +
            '<input id="swal-correo" type="email" class="swal2-input" placeholder="Correo electrónico">' +
            '<input id="swal-asunto" class="swal2-input" placeholder="Asunto">' +
            '<input id="swal-fecha" type="date" class="swal2-input">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Enviar Reporte',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('swal-nombre').value;
            const correo = document.getElementById('swal-correo').value;
            const asunto = document.getElementById('swal-asunto').value;
            const fecha = document.getElementById('swal-fecha').value;

            if (!nombre || !correo || !asunto || !fecha) {
                Swal.showValidationMessage('Por favor, complete todos los campos');
                return false;
            }

            return { nombre, correo, asunto, fecha, estado: 'Pendiente' };
        }
    });

    if (formValues) {
        try {
            const respuesta = await postDatos('reportes', formValues);
            if (respuesta) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte Enviado',
                    text: 'Su reporte ha sido enviado correctamente a la municipalidad.'
                });
            }
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el reporte. Intente más tarde.'
            });
        }
    }
});
