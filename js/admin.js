import { API } from './api.js';

export const AdminModule = {
    // Renderiza cualquier tabla dinámicamente
    async renderTable(endpoint, containerId) {
        const data = await API.get(endpoint);
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = data.map(item => {
            // Generamos las celdas saltando el ID
            const cells = Object.keys(item)
                .filter(key => key !== 'id')
                .map(key => `<td>${item[key]}</td>`)
                .join('');

            return `
                <tr>
                    ${cells}
                    <td>
                        <button class="btn btn-danger" onclick="deleteItem('${endpoint}', '${item.id}')">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Inicializa formularios de creación (Proyectos/Servicios)
    setupForm(formId, endpoint) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form));
            await API.post(endpoint, formData);
            alert("Registro guardado");
            location.reload();
        };
    }
};

// Exponer deleteItem globalmente para los botones de la tabla
window.deleteItem = async (endpoint, id) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
        const success = await API.delete(endpoint, id);
        if (success) location.reload();
    }
};