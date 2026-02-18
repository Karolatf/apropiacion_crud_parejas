// script.js
// SISTEMA DE GESTIÓN DE TAREAS - CRUD COMPLETO
// Autores: Karol Nicolle Torres Fuentes, Juan Sebastian Patiño Hernandez
// Fecha: 17-02-2026
// Institución: SENA - Técnico en Programación de Software
// Descripción: Punto de entrada principal. Importa todos los módulos desde el barril.

// Importamos todo lo necesario desde el archivo barril (un solo import limpio)
import {
    showSuccessMessage,
    showErrorMessage,
    searchUserByDocument,
    getUserTasks,
    createTask,
    updateTask,
    deleteTask
} from './modulos/barril.js';

// ─────────────────────────────────────────────
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ─────────────────────────────────────────────
const searchUserForm           = document.getElementById('searchUserForm');
const documentNumberInput      = document.getElementById('documentNumber');

const userDataSection          = document.getElementById('userDataSection');
const userIdSpan               = document.getElementById('userId');
const userNameSpan             = document.getElementById('userName');
const userEmailSpan            = document.getElementById('userEmail');

const createTaskSection        = document.getElementById('createTaskSection');
const createTaskForm           = document.getElementById('createTaskForm');
const taskTitleInput           = document.getElementById('taskTitle');
const taskDescriptionInput     = document.getElementById('taskDescription');
const taskStatusSelect         = document.getElementById('taskStatus');

const editTaskSection          = document.getElementById('editTaskSection');
const editTaskForm             = document.getElementById('editTaskForm');
const editTaskIdInput          = document.getElementById('editTaskId');
const editTaskTitleInput       = document.getElementById('editTaskTitle');
const editTaskDescriptionInput = document.getElementById('editTaskDescription');
const editTaskStatusSelect     = document.getElementById('editTaskStatus');
const cancelEditBtn            = document.getElementById('cancelEdit');

const tasksListSection         = document.getElementById('tasksListSection');
const tasksTableBody           = document.getElementById('tasksTableBody');

// ─────────────────────────────────────────────
// 2. VARIABLES GLOBALES DE ESTADO
// ─────────────────────────────────────────────

// Usuario actualmente seleccionado
let currentUser  = null;
// Tareas del usuario actual
let currentTasks = [];
// Acumulado de tareas de todos los usuarios consultados (no se borra al cambiar usuario)
let allTasks     = [];

// ─────────────────────────────────────────────
// 3. FUNCIONES DE MANIPULACIÓN DEL DOM - USUARIO
// ─────────────────────────────────────────────

// Muestra los datos del usuario encontrado en la interfaz
function displayUserData(user) {
    userIdSpan.textContent    = user.documento;
    userNameSpan.textContent  = user.nombre;
    userEmailSpan.textContent = user.correo;

    userDataSection.style.display   = 'block';
    createTaskSection.style.display = 'block';
}

// Oculta los datos del usuario y resetea la interfaz
function hideUserData() {
    userDataSection.style.display   = 'none';
    createTaskSection.style.display = 'none';
    editTaskSection.style.display   = 'none';
    tasksListSection.style.display  = 'none';

    userIdSpan.textContent    = '';
    userNameSpan.textContent  = '';
    userEmailSpan.textContent = '';
}

// ─────────────────────────────────────────────
// 4. FUNCIONES DE MANIPULACIÓN DEL DOM - TAREAS
// ─────────────────────────────────────────────

// Renderiza el array de tareas recibido en la tabla del DOM
function displayTasks(tasks) {
    tasksTableBody.innerHTML = '';

    if (tasks.length === 0) {
        const emptyRow  = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan         = 6;
        emptyCell.style.textAlign = 'center';
        emptyCell.textContent     = 'No hay tareas registradas';
        emptyRow.appendChild(emptyCell);
        tasksTableBody.appendChild(emptyRow);
    } else {
        tasks.forEach((task, index) => {
            const row = document.createElement('tr');

            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = task.title;
            row.appendChild(titleCell);

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = task.description;
            row.appendChild(descriptionCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = task.status;
            row.appendChild(statusCell);

            const userCell = document.createElement('td');
            userCell.textContent = task.userName;
            row.appendChild(userCell);

            const actionsCell = document.createElement('td');

            const editBtn     = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className   = 'btn-edit';
            editBtn.onclick     = () => startEditTask(task.id);

            const deleteBtn     = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className   = 'btn-delete';
            deleteBtn.onclick     = () => confirmDeleteTask(task.id);

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);

            tasksTableBody.appendChild(row);
        });
    }

    tasksListSection.style.display = 'block';
}

// Prepara el formulario de edición con los datos de la tarea seleccionada
function startEditTask(taskId) {
    const task = allTasks.find(t => String(t.id) === String(taskId));

    if (!task) {
        showErrorMessage('Tarea no encontrada');
        return;
    }

    editTaskIdInput.value          = task.id;
    editTaskTitleInput.value       = task.title;
    editTaskDescriptionInput.value = task.description;
    editTaskStatusSelect.value     = task.status;

    createTaskSection.style.display = 'none';
    editTaskSection.style.display   = 'block';
    editTaskSection.scrollIntoView({ behavior: 'smooth' });
}

// Cancela la edición y vuelve al formulario de creación
function cancelEdit() {
    editTaskIdInput.value          = '';
    editTaskTitleInput.value       = '';
    editTaskDescriptionInput.value = '';
    editTaskStatusSelect.value     = '';

    editTaskSection.style.display   = 'none';
    createTaskSection.style.display = 'block';
}

// Carga las tareas del usuario actual y las acumula en allTasks
async function loadUserTasks() {
    if (!currentUser) return;

    const tasks  = await getUserTasks(currentUser.documento);
    currentTasks = tasks;

    // Agregamos solo las tareas que aún no están en el acumulado (evitar duplicados)
    tasks.forEach(task => {
        if (!allTasks.find(t => t.id === task.id)) {
            allTasks.push(task);
        }
    });

    displayTasks(allTasks);
}

// ─────────────────────────────────────────────
// 5. MANEJADORES DE EVENTOS
// ─────────────────────────────────────────────

async function handleSearchUser(e) {
    e.preventDefault();

    const documento = documentNumberInput.value.trim();
    if (!documento) {
        showErrorMessage('Por favor ingresa un número de documento');
        return;
    }

    const user = await searchUserByDocument(documento);

    if (user) {
        currentUser = user;
        displayUserData(user);
        await loadUserTasks();
        showSuccessMessage(`Usuario ${user.nombre} encontrado`);
        documentNumberInput.value = '';
    } else {
        showErrorMessage('Usuario no encontrado. Verifica el documento ingresado.');
        currentUser = null;
        hideUserData();
    }
}

async function handleCreateTask(e) {
    e.preventDefault();

    if (!currentUser) {
        showErrorMessage('Primero debes buscar un usuario');
        return;
    }

    const title       = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const status      = taskStatusSelect.value;

    if (!title || !description || !status) {
        showErrorMessage('Por favor completa todos los campos de la tarea');
        return;
    }

    const taskData = {
        title,
        description,
        status,
        userDocumento: currentUser.documento,
        userName:      currentUser.nombre
    };

    const createdTask = await createTask(taskData);

    if (createdTask) {
        allTasks.push(createdTask);
        currentTasks.push(createdTask);
        showSuccessMessage('Tarea registrada exitosamente');
        createTaskForm.reset();
        displayTasks(allTasks);
    }
}

async function handleEditTask(e) {
    e.preventDefault();

    const taskId = parseInt(editTaskIdInput.value);

    if (isNaN(taskId)) {
        showErrorMessage('No se pudo identificar la tarea a editar');
        return;
    }

    const title       = editTaskTitleInput.value.trim();
    const description = editTaskDescriptionInput.value.trim();
    const status      = editTaskStatusSelect.value;

    if (!title || !description || !status) {
        showErrorMessage('Por favor completa todos los campos de la tarea');
        return;
    }

    const taskData = {
        title,
        description,
        status,
        userDocumento: currentUser.documento,
        userName:      currentUser.nombre
    };

    const updatedTask = await updateTask(taskId, taskData);

    if (updatedTask) {
        const idx = allTasks.findIndex(t => String(t.id) === String(taskId));
        if (idx !== -1) allTasks[idx] = updatedTask;

        const idx2 = currentTasks.findIndex(t => String(t.id) === String(taskId));
        if (idx2 !== -1) currentTasks[idx2] = updatedTask;

        showSuccessMessage('Tarea actualizada exitosamente');
        cancelEdit();
        displayTasks(allTasks);
    }
}

async function confirmDeleteTask(taskId) {
    const task = allTasks.find(t => t.id === taskId);

    if (!task) {
        showErrorMessage('Tarea no encontrada');
        return;
    }

    const confirmed = confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`);

    if (confirmed) {
        const success = await deleteTask(taskId);

        if (success) {
            allTasks     = allTasks.filter(t => t.id !== taskId);
            currentTasks = currentTasks.filter(t => t.id !== taskId);
            showSuccessMessage('Tarea eliminada exitosamente');
            displayTasks(allTasks);
        }
    }
}

// ─────────────────────────────────────────────
// 6. INICIALIZACIÓN
// ─────────────────────────────────────────────
function initApp() {
    searchUserForm.addEventListener('submit', handleSearchUser);
    createTaskForm.addEventListener('submit', handleCreateTask);
    editTaskForm.addEventListener('submit', handleEditTask);
    cancelEditBtn.addEventListener('click', cancelEdit);

    console.log('✅ Sistema de Gestión de Tareas iniciado correctamente');
    console.log('📡 Servidor: http://localhost:3000');
    console.log('🔧 Asegúrate de que json-server esté corriendo en el puerto 3000');
}

document.addEventListener('DOMContentLoaded', initApp);