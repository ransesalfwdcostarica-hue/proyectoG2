const BASE_URL = 'http://localhost:3005';

// ================================
// USUARIOS
// ================================

/**
 * Registra un nuevo usuario en el sistema.
 * @param {Object} usuario - Datos del usuario a registrar.
 */
export async function postUsuarios(usuario) {
    try {
        const respuesta = await fetch(`${BASE_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        if (!respuesta.ok) throw new Error(`Error al registrar usuario: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error('Error en postUsuarios:', error);
        throw error;
    }
}

/**
 * Obtiene la lista de todos los usuarios.
 */
export async function obtenerUsuarios() {
    try {
        const respuesta = await fetch(`${BASE_URL}/usuarios`);
        if (!respuesta.ok) throw new Error(`Error al obtener usuarios: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error('Error en obtenerUsuarios:', error);
        throw error;
    }
}

// ================================
// CRUD GENÉRICO
// ================================

/**
 * Realiza una petición GET genérica.
 * @param {string} ruta - El recurso a consultar (ej: 'productos').
 */
export async function getDatos(ruta) {
    try {
        const respuesta = await fetch(`${BASE_URL}/${ruta}`);
        if (!respuesta.ok) throw new Error(`Error en GET ${ruta}: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error(`Error en getDatos (${ruta}):`, error);
        throw error;
    }
}

/**
 * Realiza una petición POST genérica.
 * @param {string} ruta - El recurso donde se enviarán los datos.
 * @param {Object} data - Los datos a enviar.
 */
export async function postDatos(ruta, data) {
    try {
        const respuesta = await fetch(`${BASE_URL}/${ruta}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!respuesta.ok) throw new Error(`Error en POST ${ruta}: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error(`Error en postDatos (${ruta}):`, error);
        throw error;
    }
}

/**
 * Realiza una petición PUT genérica para actualizar un recurso.
 * @param {string} ruta - El recurso a actualizar.
 * @param {string|number} id - El ID del recurso.
 * @param {Object} data - Los nuevos datos.
 */
export async function putDatos(ruta, id, data) {
    try {
        const respuesta = await fetch(`${BASE_URL}/${ruta}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!respuesta.ok) throw new Error(`Error en PUT ${ruta}/${id}: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error(`Error en putDatos (${ruta}/${id}):`, error);
        throw error;
    }
}

/**
 * Realiza una petición DELETE genérica para eliminar un recurso.
 * @param {string} ruta - El recurso a eliminar.
 * @param {string|number} id - El ID del recurso.
 */
export async function deleteDatos(ruta, id) {
    try {
        const respuesta = await fetch(`${BASE_URL}/${ruta}/${id}`, {
            method: 'DELETE'
        });
        if (!respuesta.ok) throw new Error(`Error en DELETE ${ruta}/${id}: ${respuesta.status}`);
        return await respuesta.json();
    } catch (error) {
        console.error(`Error en deleteDatos (${ruta}/${id}):`, error);
        throw error;
    }
}
