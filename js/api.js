import { BASE_URL } from './config.js';

export const API = {
    // Obtener todos los datos de un módulo
    async get(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error(`Error cargando ${endpoint}:`, error);
        }
    },

    // Crear un nuevo registro (POST)
    async post(endpoint, data) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error guardando en ${endpoint}:`, error);
        }
    },

    // Eliminar un registro (DELETE)
    async delete(endpoint, id) {
        try {
            await fetch(`${BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' });
            return true;
        } catch (error) {
            console.error(`Error eliminando en ${endpoint}:`, error);
            return false;
        }
    },

    // Actualizar un registro (PUT)
    async put(endpoint, id, data) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error(`Error actualizando ${endpoint}:`, error);
        }
    }
};