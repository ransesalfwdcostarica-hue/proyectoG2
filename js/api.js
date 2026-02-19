import { BASE_URL } from './config.js';

export const API = {
    // Método privado para manejar peticiones centralizadas
    async _request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            // Si es DELETE, a veces no devuelve JSON, manejamos eso
            if (method === 'DELETE') return true;
            
            return await response.json();
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            throw error; // Re-lanzar para que el UI lo maneje
        }
    },

    // Obtener todos los datos de un módulo
    async get(endpoint) {
        return this._request(endpoint, 'GET');
    },

    // Crear un nuevo registro (POST)
    async post(endpoint, data) {
        return this._request(endpoint, 'POST', data);
    },

    // Eliminar un registro (DELETE)
    async delete(endpoint, id) {
        return this._request(`${endpoint}/${id}`, 'DELETE');
    },

    // Actualizar un registro (PUT)
    async put(endpoint, id, data) {
        return this._request(`${endpoint}/${id}`, 'PUT', data);
    }
};