/**
 * SISTEMA INTEGRADO DE GESTIÓN MUNICIPAL - ESCAZÚ 2026
 * Arquitectura: Modular Async Service
 */

const CONFIG = {
    BASE_URL: 'http://localhost:3000',
    ENDPOINTS: {
        users: 'users',
        reports: 'reports',
        projects: 'projects',
        services: 'services'
    }
};

// --- SERVICIO DE API ---
const ApiService = {
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/${endpoint}`, options);
            if (!response.ok) throw new Error('Error en la petición');
            return await response.json();
        } catch (err) {
            console.error("API Error:", err);
            return null;
        }
    }
};

// --- SISTEMA DE AUTENTICACIÓN ---
const Auth = {
    async login(correo, password) {
        const users = await ApiService.request(CONFIG.ENDPOINTS.users);
        const user = users.find(u => u.correo === correo && u.password === password);

        if (user) {
            localStorage.setItem('municipal_session', JSON.stringify(user));
            return user;
        }
        return null;
    },

    checkAccess(requiredRol) {
        const session = JSON.parse(localStorage.getItem('municipal_session'));
        if (!session) return false;
        if (requiredRol && session.rol !== requiredRol) return false;
        return session;
    },

    logout() {
        localStorage.removeItem('municipal_session');
        window.location.href = 'login.html';
    }
};

// --- MÓDULO ADMINISTRATIVO (CRUD) ---
const AdminModule = {
    async renderReports() {
        const reports = await ApiService.request(CONFIG.ENDPOINTS.reports);
        const container = document.getElementById('tbody-reports');
        if (!container) return;

        container.innerHTML = reports.map(r => `
            <tr>
                <td><strong>#${r.id.slice(0,5)}</strong></td>
                <td>${r.tipo}</td>
                <td>${r.ubicacion}</td>
                <td><span class="badge badge-${r.estado === 'Resuelto' ? 'done' : 'pending'}">${r.estado}</span></td>
                <td>
                    <button class="btn btn-accent" onclick="AdminModule.updateStatus('${r.id}', 'En Proceso')">Procesar</button>
                    <button class="btn btn-danger" onclick="AdminModule.deleteItem('reports', '${r.id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
    },

    async renderProjects() {
        const projects = await ApiService.request(CONFIG.ENDPOINTS.projects);
        const container = document.getElementById('tbody-projects');
        if (!container) return;

        container.innerHTML = projects.map(p => `
            <tr>
                <td>${p.nombre}</td>
                <td>₡${Number(p.presupuesto).toLocaleString()}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="btn btn-danger" onclick="AdminModule.deleteItem('projects', '${p.id}')">Eliminar</button>
                </td>
            </tr>
        `).join('');
    },

    async deleteItem(endpoint, id) {
        if (confirm('¿Desea eliminar este registro permanentemente?')) {
            await ApiService.request(`${endpoint}/${id}`, 'DELETE');
            location.reload();
        }
    },

    async updateStatus(id, newStatus) {
        const reports = await ApiService.request(CONFIG.ENDPOINTS.reports);
        const report = reports.find(r => r.id === id);
        report.estado = newStatus;
        await ApiService.request(`${CONFIG.ENDPOINTS.reports}/${id}`, 'PUT', report);
        location.reload();
    }
};

// --- INICIALIZADOR DE PÁGINAS ---
document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;

    // 1. Lógica de Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const user = await Auth.login(loginForm.correo.value, loginForm.password.value);
            if (user) {
                window.location.href = user.rol === 'admin' ? 'admin-dashboard.html' : 'index.html';
            } else {
                alert("Credenciales inválidas");
            }
        };
    }

    // 2. Lógica de Registro
    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.onsubmit = async (e) => {
            e.preventDefault();
            const newUser = {
                id: crypto.randomUUID(),
                nombre: regForm.nombre.value,
                correo: regForm.correo.value,
                password: regForm.password.value,
                telefono: regForm.telefono.value,
                rol: 'ciudadano'
            };
            await ApiService.request(CONFIG.ENDPOINTS.users, 'POST', newUser);
            alert("Cuenta creada con éxito");
            window.location.href = 'login.html';
        };
    }

    // 3. Lógica de Reportes Ciudadanos
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        const session = Auth.checkAccess();
        if (!session) {
            document.getElementById('report-section').innerHTML = "<h3>Inicie sesión para reportar.</h3>";
        }

        reportForm.onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                id: crypto.randomUUID(),
                tipo: reportForm.tipo.value,
                ubicacion: reportForm.ubicacion.value,
                descripcion: reportForm.descripcion.value,
                estado: 'Pendiente',
                userId: session.id
            };
            await ApiService.request(CONFIG.ENDPOINTS.reports, 'POST', data);
            alert("Reporte enviado a la municipalidad");
            reportForm.reset();
        };
    }

    // 4. Lógica Dashboard (PROTEGIDA)
    if (path.includes('admin-dashboard.html')) {
        const adminSession = Auth.checkAccess('admin');
        if (!adminSession) {
            alert("Acceso Restringido");
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('admin-name').innerText = adminSession.nombre;
        AdminModule.renderReports();
        AdminModule.renderProjects();

        // Formulario de Proyectos
        const projectForm = document.getElementById('project-form');
        projectForm.onsubmit = async (e) => {
            e.preventDefault();
            const pData = {
                id: crypto.randomUUID(),
                nombre: projectForm.nombre.value,
                presupuesto: projectForm.presupuesto.value,
                estado: 'Planificación'
            };
            await ApiService.request(CONFIG.ENDPOINTS.projects, 'POST', pData);
            location.reload();
        };

        document.getElementById('logout-btn').onclick = () => Auth.logout();
    }
});

// Exponer a nivel global para botones HTML
window.AdminModule = AdminModule;