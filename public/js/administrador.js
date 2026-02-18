import { getDatos, postDatos, putDatos, deleteDatos, obtenerUsuarios } from "../services/fetch.js";

// ================================
// CONFIGURACIÓN Y ESTADO
// ================================
const ADMIN_PASSWORD = "MuniAdmin2026";
let currentModulo = 'dashboard';

// ================================
// SELECTORES PRINCIPALES
// ================================
const mainContent = document.querySelector('.main-content');
const sidebarLinks = document.querySelectorAll('#admin-sidebar-nav .nav-item');

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarSidebar();
    inicializarAuth();
    renderDashboard(); // Por defecto
});

// ================================
// NAVEGACIÓN (SIDEBAR)
// ================================
function inicializarSidebar() {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remover active de todos
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Agregar active al clickeado
            link.classList.add('active');

            const id = link.id;
            switch (id) {
                case 'menu-dashboard':
                    renderDashboard();
                    break;
                case 'menu-reportes':
                    renderModulo('reportes', 'Gestión de Reportes');
                    break;
                case 'menu-proyectos':
                    renderModulo('proyectos', 'Gestión de Proyectos Viales');
                    break;
                case 'menu-servicios':
                    renderModulo('servicios', 'Gestión de Servicios Públicos');
                    break;
            }
        });
    });
}

// ================================
// RENDERIZADO DINÁMICO
// ================================

async function renderDashboard() {
    currentModulo = 'dashboard';
    mainContent.innerHTML = `
        <header class="header-dashboard">
            <h1>Resumen General</h1>
            <div class="user-profile" style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: 600;">Admin_Ramses</span>
                <div style="width: 40px; height: 40px; background: var(--accent-yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--primary-blue);">R</div>
            </div>
        </header>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Usuarios</h3>
                <div id="stat-usuarios" class="value">...</div>
            </div>
            <div class="stat-card yellow">
                <h3>Reportes</h3>
                <div id="stat-reportes" class="value">...</div>
            </div>
            <div class="stat-card green">
                <h3>Proyectos</h3>
                <div id="stat-proyectos" class="value">...</div>
            </div>
        </div>
        <div class="section-title">
            <h2>🏠 Bienvenido al Panel</h2>
        </div>
        <p>Seleccione una opción del menú lateral para gestionar los recursos municipales.</p>
    `;
    actualizarStats();
}

async function actualizarStats() {
    try {
        const users = await obtenerUsuarios();
        const reports = await getDatos('reportes');
        const projects = await getDatos('proyectos');

        document.getElementById('stat-usuarios').textContent = users.length;
        document.getElementById('stat-reportes').textContent = reports.length;
        document.getElementById('stat-proyectos').textContent = projects.length;
    } catch (error) {
        console.error("Error al actualizar stats:", error);
    }
}

async function renderModulo(tipo, titulo) {
    currentModulo = tipo;
    mainContent.innerHTML = `
        <header class="header-dashboard">
            <h1>${titulo}</h1>
            <button id="btn-nuevo-item" class="btn-success" style="padding: 10px 20px; border-radius: 5px; cursor: pointer; border: none; font-weight: bold;">+ Nuevo Registro</button>
        </header>
        <div class="data-table-container">
            <table>
                <thead id="tabla-header"></thead>
                <tbody id="tabla-body"></tbody>
            </table>
        </div>
    `;

    document.getElementById('btn-nuevo-item').addEventListener('click', () => abrirModalCrear(tipo));
    cargarDatos(tipo);
}

// ================================
// LÓGICA DE DATOS (CRUD)
// ================================

async function cargarDatos(tipo) {
    try {
        const datos = await getDatos(tipo);
        const header = document.getElementById('tabla-header');
        const body = document.getElementById('tabla-body');

        if (tipo === 'reportes') {
            header.innerHTML = `<tr><th>Nombre</th><th>Asunto</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr>`;
            body.innerHTML = datos.map(item => `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.asunto}</td>
                    <td>${item.fecha}</td>
                    <td><span class="badge ${item.estado === 'Pendiente' ? 'badge-pending' : 'badge-resolved'}">${item.estado}</span></td>
                    <td>
                        <button onclick="window.editarItem('${tipo}', '${item.id}')" style="cursor:pointer; background:none; border:none;">✏️</button>
                        <button onclick="window.eliminarItem('${tipo}', '${item.id}')" style="cursor:pointer; background:none; border:none;">🗑️</button>
                    </td>
                </tr>
            `).join('');
        } else if (tipo === 'proyectos') {
            header.innerHTML = `<tr><th>Proyecto</th><th>Presupuesto</th><th>Estado</th><th>Acciones</th></tr>`;
            body.innerHTML = datos.map(item => `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.presupuesto}</td>
                    <td><span class="badge badge-resolved">${item.estado}</span></td>
                    <td>
                        <button onclick="window.editarItem('${tipo}', '${item.id}')" style="cursor:pointer; background:none; border:none;">✏️</button>
                        <button onclick="window.eliminarItem('${tipo}', '${item.id}')" style="cursor:pointer; background:none; border:none;">🗑️</button>
                    </td>
                </tr>
            `).join('');
        } else if (tipo === 'servicios') {
            header.innerHTML = `<tr><th>Servicio</th><th>Horario</th><th>Encargado</th><th>Acciones</th></tr>`;
            body.innerHTML = datos.map(item => `
                <tr>
                    <td>${item.nombre}</td>
                    <td>${item.horario}</td>
                    <td>${item.encargado}</td>
                    <td>
                        <button onclick="window.editarItem('${tipo}', '${item.id}')" style="cursor:pointer; background:none; border:none;">✏️</button>
                        <button onclick="window.eliminarItem('${tipo}', '${item.id}')" style="cursor:pointer; background:none; border:none;">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error(`Error al cargar ${tipo}:`, error);
    }
}

// ================================
// MODALES (CREAR / EDITAR)
// ================================

async function abrirModalCrear(tipo) {
    let htmlForm = '';
    let campos = {};

    if (tipo === 'reportes') {
        htmlForm = `
            <input id="swal-nombre" class="swal2-input" placeholder="Nombre">
            <input id="swal-correo" class="swal2-input" placeholder="Correo">
            <input id="swal-asunto" class="swal2-input" placeholder="Asunto">
            <input id="swal-fecha" type="date" class="swal2-input">
        `;
    } else if (tipo === 'proyectos') {
        htmlForm = `
            <input id="swal-nombre" class="swal2-input" placeholder="Nombre del Proyecto">
            <input id="swal-presupuesto" class="swal2-input" placeholder="Presupuesto">
            <select id="swal-estado" class="swal2-input">
                <option value="Planificación">Planificación</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
            </select>
        `;
    } else if (tipo === 'servicios') {
        htmlForm = `
            <input id="swal-nombre" class="swal2-input" placeholder="Nombre del Servicio">
            <input id="swal-horario" class="swal2-input" placeholder="Horario">
            <input id="swal-encargado" class="swal2-input" placeholder="Encargado/Departamento">
        `;
    }

    const { value: formValues } = await Swal.fire({
        title: `Nuevo Registro - ${tipo.toUpperCase()}`,
        html: htmlForm,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        preConfirm: () => {
            const data = {
                nombre: document.getElementById('swal-nombre').value,
            };
            if (tipo === 'reportes') {
                data.correo = document.getElementById('swal-correo').value;
                data.asunto = document.getElementById('swal-asunto').value;
                data.fecha = document.getElementById('swal-fecha').value;
                data.estado = 'Pendiente';
            } else if (tipo === 'proyectos') {
                data.presupuesto = document.getElementById('swal-presupuesto').value;
                data.estado = document.getElementById('swal-estado').value;
            } else if (tipo === 'servicios') {
                data.horario = document.getElementById('swal-horario').value;
                data.encargado = document.getElementById('swal-encargado').value;
            }
            return data;
        }
    });

    if (formValues) {
        try {
            await postDatos(tipo, formValues);
            Swal.fire('Éxito', 'Registro creado correctamente', 'success');
            cargarDatos(tipo);
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el registro', 'error');
        }
    }
}

window.editarItem = async (tipo, id) => {
    try {
        const datos = await getDatos(tipo);
        const item = datos.find(i => i.id == id);

        let htmlForm = '';
        if (tipo === 'reportes') {
            htmlForm = `
                <input id="swal-nombre" class="swal2-input" value="${item.nombre}" placeholder="Nombre">
                <input id="swal-asunto" class="swal2-input" value="${item.asunto}" placeholder="Asunto">
                <select id="swal-estado" class="swal2-input">
                    <option value="Pendiente" ${item.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="Resuelto" ${item.estado === 'Resuelto' ? 'selected' : ''}>Resuelto</option>
                </select>
            `;
        } else if (tipo === 'proyectos') {
            htmlForm = `
                <input id="swal-nombre" class="swal2-input" value="${item.nombre}" placeholder="Proyecto">
                <input id="swal-presupuesto" class="swal2-input" value="${item.presupuesto}" placeholder="Presupuesto">
            `;
        } else if (tipo === 'servicios') {
            htmlForm = `
                <input id="swal-nombre" class="swal2-input" value="${item.nombre}" placeholder="Servicio">
                <input id="swal-horario" class="swal2-input" value="${item.horario}" placeholder="Horario">
            `;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Editar Registro',
            html: htmlForm,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            preConfirm: () => {
                const data = { ...item, nombre: document.getElementById('swal-nombre').value };
                if (tipo === 'reportes') {
                    data.asunto = document.getElementById('swal-asunto').value;
                    data.estado = document.getElementById('swal-estado').value;
                } else if (tipo === 'proyectos') {
                    data.presupuesto = document.getElementById('swal-presupuesto').value;
                } else if (tipo === 'servicios') {
                    data.horario = document.getElementById('swal-horario').value;
                }
                return data;
            }
        });

        if (formValues) {
            await putDatos(tipo, id, formValues);
            Swal.fire('Éxito', 'Registro actualizado', 'success');
            cargarDatos(tipo);
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar', 'error');
    }
};

window.eliminarItem = async (tipo, id) => {
    const confirm = await Swal.fire({
        title: '¿Confirmar eliminación?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    });

    if (confirm.isConfirmed) {
        try {
            await deleteDatos(tipo, id);
            Swal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
            cargarDatos(tipo);
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
        }
    }
};

// ================================
// AUTENTICACIÓN
// ================================
function inicializarAuth() {
    const btnLogin = document.getElementById('btn-login-admin');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            const claveIngresada = document.getElementById('clave').value;
            const interruptor = document.getElementById('interruptor-autenticacion');

            if (claveIngresada === ADMIN_PASSWORD) {
                interruptor.checked = true;
                Swal.fire({ icon: 'success', title: 'Acceso concedido', timer: 1500, showConfirmButton: false });
            } else {
                Swal.fire({ icon: 'error', title: 'Acceso denegado', text: 'Contraseña incorrecta' });
            }
        });
    }
}

