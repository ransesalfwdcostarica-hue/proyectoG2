import { Auth } from './auth.js';
import { API } from './api.js';
import { AdminModule } from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = Auth.isLoggedIn();
    const path = window.location.pathname;

    // --- LÓGICA DE LOGIN ---
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const session = await Auth.login(loginForm.correo.value, loginForm.password.value);
                window.location.href = (session.rol === 'admin') ? "admin.html" : "index.html";
            } catch (err) { alert(err.message); }
        });
    }

    // --- LÓGICA DE REGISTRO ---
    const regForm = document.getElementById('form-register');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUser = Object.fromEntries(new FormData(regForm));
            newUser.rol = "ciudadano"; // Por defecto siempre es ciudadano
            try {
                await API.post('users', newUser);
                alert("Registro exitoso, por favor inicia sesión.");
                window.location.href = "login.html";
            } catch (error) {
                alert("Error en el registro: " + error.message);
            }
        });
    }

    // --- LÓGICA DE REPORTES (HOME) ---
    const reportForm = document.getElementById('form-report');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!user) return alert("Debes iniciar sesión para reportar.");
            
            const reportData = Object.fromEntries(new FormData(reportForm));
            reportData.estado = "Pendiente";
            reportData.ciudadano = user.nombre;
            
            try {
                await API.post('reports', reportData);
                alert("Reporte enviado con éxito.");
                reportForm.reset();
            } catch (error) {
                alert("No se pudo enviar el reporte.");
            }
        });
    }

    // --- DASHBOARD ADMINISTRADOR ---
    if (path.includes('admin.html')) {
        // Bloqueo de seguridad: si no es admin, fuera
        if (!user || user.rol !== 'admin') {
            alert("Acceso denegado.");
            window.location.href = "login.html";
            return;
        }

        document.getElementById('admin-name').innerText = user.nombre;

        // Cargar los 3 CRUDs
        AdminModule.renderTable('reports', 'tbody-reports');
        AdminModule.renderTable('projects', 'tbody-projects');
        AdminModule.renderTable('services', 'tbody-services');

        // Configurar formularios de Admin
        AdminModule.setupForm('form-project', 'projects');
        AdminModule.setupForm('form-service', 'services');

        // Botón Logout
        document.getElementById('logout-btn').addEventListener('click', () => Auth.logout());
    }
});