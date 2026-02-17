import { API } from './api.js';

export const Auth = {
    // Iniciar sesión
    async login(correo, password) {
        const users = await API.get('users');
        const user = users.find(u => u.correo === correo && u.password === password);
        
        if (user) {
            localStorage.setItem('user_session', JSON.stringify(user));
            return user;
        }
        throw new Error("Credenciales inválidas");
    },

    // Cerrar sesión
    logout() {
        localStorage.removeItem('user_session');
        window.location.href = "login.html";
    },

    // Obtener usuario actual
    isLoggedIn() {
        return JSON.parse(localStorage.getItem('user_session'));
    }
};