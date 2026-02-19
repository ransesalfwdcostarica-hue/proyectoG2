import { API } from './api.js';

export const AdminModule = {
    // Renderiza cualquier tabla dinámicamente
    async renderTable(endpoint, containerId) {
        const data = await API.get(endpoint);
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Limpiar tabla

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.dataset.id = item.id; // Guardar ID en el elemento TR

            // Crear celdas dinámicamente (Seguro contra XSS)
            Object.keys(item).forEach(key => {
                if (key !== 'id') {
                    const td = document.createElement('td');
                    td.textContent = item[key]; // textContent escapa el HTML automáticamente
                    tr.appendChild(td);
                }
            });

            // Botón eliminar
            const tdAction = document.createElement('td');
            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn btn-danger delete-btn';
            btnDelete.textContent = 'Eliminar';
            btnDelete.dataset.endpoint = endpoint;
            btnDelete.dataset.id = item.id;
            
            tdAction.appendChild(btnDelete);
            tr.appendChild(tdAction);
            container.appendChild(tr);
        });

        // Configurar listener para eliminación (Delegación de eventos)
        // Solo agregamos el listener una vez si no existe
        if (!container.dataset.hasListener) {
            container.addEventListener('click', async (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    const { endpoint, id } = e.target.dataset;
                    if (confirm("¿Estás seguro de eliminar este registro?")) {
                        try {
                            await API.delete(endpoint, id);
                            // Eliminar fila del DOM sin recargar página
                            e.target.closest('tr').remove();
                        } catch (error) {
                            alert("Error al eliminar: " + error.message);
                        }
                    }
                }
            });
            container.dataset.hasListener = "true";
        }
    },

    // Inicializa formularios de creación (Proyectos/Servicios)
    setupForm(formId, endpoint) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form));
            try {
                await API.post(endpoint, formData);
                alert("Registro guardado");
                location.reload(); // Aquí sí recargamos para ver el nuevo item, o podrías agregarlo al DOM manualmente
            } catch (error) {
                alert("Error guardando: " + error.message);
            }
        });
    }
};