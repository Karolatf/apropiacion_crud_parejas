// Autores: Karol Nicolle Torres Fuentes, Juan Sebastian Patiño Hernandez
// Fecha: 17-02-2026
// Descripción: Punto de entrada principal. Importa todos los módulos desde el barril.

// IMPORTACIONES (Modulos)

// 'import' es la palabra clave de ES Modules para traer funciones desde otro archivo.
import {
    // Función que muestra un mensaje verde de éxito en pantalla durante 3 segundos
    showSuccessMessage,

    // Función que muestra un mensaje rojo de error en pantalla durante 5 segundos
    showErrorMessage,

    // Función que consulta la API buscando un usuario por su número de documento
    searchUserByDocument,

    // Función que consulta la API y retorna todas las tareas de un usuario
    getUserTasks,

    // Función que hace POST a la API para crear una nueva tarea
    createTask,

    // Función que hace PUT a la API para actualizar una tarea existente
    updateTask,

    // Función que hace DELETE a la API para eliminar una tarea
    deleteTask
} from './modulos/barril.js';


// SECCIÓN 1: SELECCIÓN DE ELEMENTOS DEL DOM

// document.getElementById('id') busca en el HTML el elemento que tenga ese id="" y lo guarda en una constante para poder manipularlo después con JavaScript.
// Se usa 'const' porque estos elementos no cambian (siempre apuntan al mismo nodo del DOM).

// -Formulario de búsqueda de usuario 

// El formulario completo con el botón "Buscar usuario"
const searchUserForm = document.getElementById('searchUserForm');

// El campo <input> donde el usuario escribe el número de documento
const documentNumberInput = document.getElementById('documentNumber');

// -Sección de datos del usuario

// El <div> o <section> que contiene la tarjeta con los datos del usuario encontrado
const userDataSection = document.getElementById('userDataSection');

// <span> donde se muestra el documento (ID) del usuario
const userIdSpan = document.getElementById('userId');

// <span> donde se muestra el nombre del usuario
const userNameSpan = document.getElementById('userName');

// <span> donde se muestra el correo electrónico del usuario
const userEmailSpan = document.getElementById('userEmail');

// -Formulario de creación de tareas

// El <div> o <section> que envuelve todo el formulario de crear tarea
const createTaskSection = document.getElementById('createTaskSection');

// El <form> de creación de tareas (usado para hacer .reset() y escuchar 'submit')
const createTaskForm = document.getElementById('createTaskForm');

// <input type="text"> donde se escribe el título de la tarea
const taskTitleInput = document.getElementById('taskTitle');

// <textarea> donde se escribe la descripción de la tarea
const taskDescriptionInput = document.getElementById('taskDescription');

// <select> con las opciones de estado (ej: pendiente, en progreso, completada)
const taskStatusSelect = document.getElementById('taskStatus');

// -Formulario de edición de tareas

// El <div> o <section> que envuelve todo el formulario de editar tarea
const editTaskSection = document.getElementById('editTaskSection');

// El <form> de edición (escucha el evento 'submit' para guardar cambios)
const editTaskForm = document.getElementById('editTaskForm');

// <input type="hidden"> que guarda el ID de la tarea que se está editando.
// Es invisible para el usuario pero lo necesitamos para saber qué tarea actualizar.
const editTaskIdInput = document.getElementById('editTaskId');

// <input type="text"> para editar el título de la tarea
const editTaskTitleInput = document.getElementById('editTaskTitle');

// <textarea> para editar la descripción de la tarea
const editTaskDescriptionInput = document.getElementById('editTaskDescription');

// <select> para cambiar el estado de la tarea
const editTaskStatusSelect = document.getElementById('editTaskStatus');

// Botón "Cancelar" dentro del formulario de edición
const cancelEditBtn = document.getElementById('cancelEdit');

// -Sección de lista de tareas

// El <div> o <section> que contiene la tabla con todas las tareas
const tasksListSection = document.getElementById('tasksListSection');

// El <tbody> de la tabla donde se insertan dinámicamente las filas de tareas
const tasksTableBody = document.getElementById('tasksTableBody');


// SECCIÓN 2: VARIABLES GLOBALES DE ESTADO

// Se usa 'let' (no 'const') porque estos valores cambian durante el uso de la app.
// Son "globales" porque están fuera de cualquier función, lo que permite que todas las funciones del archivo las lean y modifiquen.

// Almacena el objeto del usuario que se está consultando en este momento.
// Empieza en null (ningún usuario seleccionado).
let currentUser  = null;

// Array con las tareas que pertenecen únicamente al usuario actual (currentUser).
// Se reemplaza cada vez que se carga un nuevo usuario.
let currentTasks = [];

// Array ACUMULADO con tareas de TODOS los usuarios consultados en la sesión.
// A diferencia de currentTasks, este nunca se vacía al cambiar de usuario; solo crece cuando se consulta un usuario nuevo, y se reduce cuando se elimina una tarea.
let allTasks = [];


// SECCIÓN 3: FUNCIONES DE MANIPULACIÓN DEL DOM - USUARIO

// Función que recibe un objeto 'user' y lo pinta en la interfaz
function displayUserData(user) {

    // Escribe el número de documento del usuario dentro del <span id="userId">
    userIdSpan.textContent = user.documento;

    // Escribe el nombre del usuario dentro del <span id="userName">
    userNameSpan.textContent = user.nombre;

    // Escribe el correo del usuario dentro del <span id="userEmail">
    userEmailSpan.textContent = user.correo;

    // Hace visible la tarjeta de datos del usuario (estaba oculta con display:none)
    userDataSection.style.display = 'block';

    // Hace visible el formulario de crear tareas para este usuario
    createTaskSection.style.display = 'block';
}

// Función que oculta la información del usuario y resetea la vista
function hideUserData() {

    // Oculta la tarjeta con los datos del usuario
    userDataSection.style.display = 'none';

    // Oculta el formulario de creación de tareas
    createTaskSection.style.display = 'none';

    // Oculta el formulario de edición de tareas
    editTaskSection.style.display = 'none';

    // Oculta la tabla con la lista de tareas
    tasksListSection.style.display = 'none';

    // Limpia el texto del <span> de documento (queda vacío)
    userIdSpan.textContent = '';

    // Limpia el texto del <span> de nombre
    userNameSpan.textContent = '';

    // Limpia el texto del <span> de correo
    userEmailSpan.textContent = '';
}


// SECCIÓN 4: FUNCIONES DE MANIPULACIÓN DEL DOM - TAREAS

// Función que recibe un array de tareas y construye la tabla HTML dinámicamente
function displayTasks(tasks) {

    // Borra todas las filas actuales del <tbody> para empezar desde cero.
    // innerHTML = '' es la forma más rápida de limpiar el contenido de un elemento.
    tasksTableBody.innerHTML = '';

    // Si el array llegó vacío, mostramos una fila con mensaje informativo
    if (tasks.length === 0) {

        // Creamos un elemento <tr> (fila de tabla) vacío
        const emptyRow  = document.createElement('tr');

        // Creamos un elemento <td> (celda) para el mensaje
        const emptyCell = document.createElement('td');

        // colSpan = 6 hace que la celda ocupe las 6 columnas de la tabla
        // para que el mensaje quede centrado a lo ancho
        emptyCell.colSpan = 6;

        // Centra el texto horizontalmente dentro de la celda
        emptyCell.style.textAlign = 'center';

        // Texto que verá el usuario cuando no hay tareas
        emptyCell.textContent = 'No hay tareas registradas';

        // Agrega la celda dentro de la fila
        emptyRow.appendChild(emptyCell);

        // Agrega la fila dentro del <tbody>
        tasksTableBody.appendChild(emptyRow);

    } else {

        // Si hay tareas, recorremos cada una con forEach.
        // 'task' es el objeto de la tarea actual, 'index' es su posición (0, 1, 2...)
        tasks.forEach((task, index) => {

            // Creamos la fila <tr> que contendrá todas las celdas de esta tarea
            const row = document.createElement('tr');

            // Celda: número de fila
            const numberCell = document.createElement('td');
            // index + 1 para que empiece en 1 en lugar de 0
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);

            // Celda: título de la tarea
            const titleCell = document.createElement('td');
            titleCell.textContent = task.title;
            row.appendChild(titleCell);

            // Celda: descripción de la tarea
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = task.description;
            row.appendChild(descriptionCell);

            // Celda: estado de la tarea
            const statusCell = document.createElement('td');
            statusCell.textContent = task.status;
            row.appendChild(statusCell);

            // Celda: nombre del usuario dueño de la tarea
            const userCell = document.createElement('td');
            userCell.textContent = task.userName;
            row.appendChild(userCell);

            // Celda: botones de acción (Editar / Eliminar)
            const actionsCell = document.createElement('td');

            // Botón "Editar"
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';           // Texto visible del botón
            editBtn.className = 'btn-edit';          // Clase CSS para estilos
            // Al hacer click llama a startEditTask pasando el id de esta tarea.
            // Se usa arrow function para capturar task.id en el momento correcto.
            editBtn.onclick = () => startEditTask(task.id);

            // Botón "Eliminar"
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';        // Texto visible del botón
            deleteBtn.className = 'btn-delete';      // Clase CSS para estilos
            // Al hacer click llama a confirmDeleteTask pasando el id de esta tarea
            deleteBtn.onclick = () => confirmDeleteTask(task.id);

            // Agrega ambos botones dentro de la celda de acciones
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);

            // Agrega la celda de acciones a la fila
            row.appendChild(actionsCell);

            // Agrega la fila completa al <tbody> de la tabla
            tasksTableBody.appendChild(row);
        });
    }

    // Hace visible la sección de la tabla (estaba oculta hasta que hay datos que mostrar)
    tasksListSection.style.display = 'block';
}

// Función que llena el formulario de edición con los datos de la tarea seleccionada
function startEditTask(taskId) {

    // Busca la tarea dentro del acumulado global.
    // String(t.id) === String(taskId) convierte ambos a texto antes de comparar, evitando el bug donde un ID número (1) no iguala a un ID string ("1").
    const task = allTasks.find(t => String(t.id) === String(taskId));

    // Si por algún motivo no encontró la tarea, muestra error y sale de la función
    if (!task) {
        showErrorMessage('Tarea no encontrada');
        return; // 'return' sin valor detiene la ejecución de la función aquí
    }

    // Pone el ID de la tarea en el campo oculto del formulario.
    // Lo necesitamos guardado para saber qué tarea actualizar cuando se haga submit.
    editTaskIdInput.value = task.id;

    // Carga el título actual en el input de edición para que el usuario lo vea y pueda cambiarlo
    editTaskTitleInput.value = task.title;

    // Carga la descripción actual en el textarea de edición
    editTaskDescriptionInput.value = task.description;

    // Selecciona la opción del <select> que coincide con el estado actual de la tarea
    editTaskStatusSelect.value = task.status;

    // Oculta el formulario de creación para no tener dos formularios visibles a la vez
    createTaskSection.style.display = 'none';

    // Muestra el formulario de edición
    editTaskSection.style.display = 'block';

    // Hace scroll suave hasta el formulario de edición para que el usuario lo vea.
    // 'smooth' es una animación de desplazamiento fluida (vs 'auto' que salta directo).
    editTaskSection.scrollIntoView({ behavior: 'smooth' });
}

// Función que cancela la edición y devuelve la vista al estado normal
function cancelEdit() {

    // Limpia el campo oculto del ID (para que no quede un ID "sucio" de una edición anterior)
    editTaskIdInput.value = '';

    // Limpia el input de título
    editTaskTitleInput.value = '';

    // Limpia el textarea de descripción
    editTaskDescriptionInput.value = '';

    // Reinicia el <select> de estado a su valor vacío/por defecto
    editTaskStatusSelect.value = '';

    // Oculta el formulario de edición
    editTaskSection.style.display = 'none';

    // Vuelve a mostrar el formulario de creación
    createTaskSection.style.display = 'block';
}

// Función asíncrona que carga las tareas del usuario actual desde la API y las acumula en allTasks sin borrar las de otros usuarios
async function loadUserTasks() {

    // Si no hay usuario activo no hacemos nada. 'return' sale de la función.
    if (!currentUser) return;

    // Llama a la función importada getUserTasks (del módulo read.js via barril.js).
    // 'await' pausa aquí hasta que la promesa resuelva y devuelva el array de tareas.
    const tasks  = await getUserTasks(currentUser.documento);

    // Reemplaza el array de tareas del usuario actual con el resultado fresco de la API
    currentTasks = tasks;

    // Recorre cada tarea recién obtenida de la API
    tasks.forEach(task => {

        // Solo agrega la tarea al acumulado si su ID no existe ya en allTasks.
        // allTasks.find(...) retorna el objeto si lo encuentra, o undefined si no.
        // El ! invierte el resultado: entra al if solo si NO lo encontró (es undefined).
        if (!allTasks.find(t => t.id === task.id)) {
            allTasks.push(task); // push agrega el elemento al final del array
        }
    });

    // Renderiza la tabla con TODAS las tareas acumuladas (no solo las del usuario actual)
    displayTasks(allTasks);
}


// SECCIÓN 5: MANEJADORES DE EVENTOS

// Son funciones 'async' porque dentro hacen llamadas a la API con 'await'.

// Se ejecuta cuando el usuario envía el formulario de búsqueda de usuario
async function handleSearchUser(e) {

    // e.preventDefault() evita que el formulario recargue la página al hacer submit, que es el comportamiento por defecto del navegador con los <form>.
    e.preventDefault();

    // .trim() elimina espacios en blanco al inicio y al final del texto escrito
    const documento = documentNumberInput.value.trim();

    // Si el campo quedó vacío después del trim(), pedimos que lo llene y salimos
    if (!documento) {
        showErrorMessage('Por favor ingresa un número de documento');
        return;
    }

    // Llama a la API para buscar el usuario. 'await' espera el resultado.
    // Retorna un objeto usuario o null si no existe.
    const user = await searchUserByDocument(documento);

    // Si encontró al usuario (user no es null ni undefined)
    if (user) {

        // Guarda el usuario en la variable global para que otras funciones lo usen
        currentUser = user;

        // Pinta los datos del usuario en la interfaz (documento, nombre, correo)
        displayUserData(user);

        // Carga y muestra las tareas de este usuario
        await loadUserTasks();

        // Muestra mensaje verde de confirmación con el nombre del usuario.
        // Las backticks `` y ${} son template literals: permiten insertar variables en strings.
        showSuccessMessage(`Usuario ${user.nombre} encontrado`);

        // Limpia el input de búsqueda para que quede vacío después de la consulta
        documentNumberInput.value = '';

    } else {
        // Si user es null (no se encontró), muestra mensaje de error
        showErrorMessage('Usuario no encontrado. Verifica el documento ingresado.');

        // Limpia la variable global de usuario
        currentUser = null;

        // Oculta toda la información que pudiera estar visible de una búsqueda anterior
        hideUserData();
    }
}

// Se ejecuta cuando el usuario envía el formulario de creación de tarea
async function handleCreateTask(e) {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Si no hay usuario activo no podemos asociar la tarea a nadie
    if (!currentUser) {
        showErrorMessage('Primero debes buscar un usuario');
        return;
    }

    // Lee y limpia cada campo del formulario de creación
    const title = taskTitleInput.value.trim();                  // Título de la tarea
    const description = taskDescriptionInput.value.trim();      // Descripción de la tarea
    const status = taskStatusSelect.value;                      // Estado seleccionado en el <select>

    // Valida que ningún campo esté vacío. El operador ! convierte string vacío a true.
    if (!title || !description || !status) {
        showErrorMessage('Por favor completa todos los campos de la tarea');
        return;
    }

    // Construye el objeto que se enviará al servidor.
    // La notación { title } es shorthand de { title: title } cuando variable y clave tienen el mismo nombre.
    const taskData = {
        title,                                // Título de la tarea
        description,                          // Descripción de la tarea
        status,                               // Estado de la tarea
        userDocumento: currentUser.documento, // Documento del usuario dueño de la tarea
        userName: currentUser.nombre          // Nombre del usuario (para mostrarlo en la tabla)
    };

    // Envía la tarea a la API vía POST. 'await' espera la respuesta.
    // Retorna el objeto de la tarea creada (con su ID asignado por el servidor) o null si falló.
    const createdTask = await createTask(taskData);

    // Si la creación fue exitosa (createdTask no es null)
    if (createdTask) {

        // Agrega la nueva tarea al final del acumulado global
        allTasks.push(createdTask);

        // También la agrega al array del usuario actual
        currentTasks.push(createdTask);

        // Muestra mensaje verde de confirmación
        showSuccessMessage('Tarea registrada exitosamente');

        // .reset() limpia todos los campos del formulario de creación de golpe
        createTaskForm.reset();

        // Actualiza la tabla para mostrar la nueva tarea
        displayTasks(allTasks);
    }
}

// Se ejecuta cuando el usuario envía el formulario de edición de tarea
async function handleEditTask(e) {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Lee el ID del campo oculto como texto plano (string).
    // .trim() elimina espacios en blanco accidentales al inicio o al final.
    // No usamos parseInt() porque json-server genera IDs alfanuméricos como "be1b",
    // y parseInt("be1b") devuelve NaN, lo que causaba el error al editar.
    const taskId = editTaskIdInput.value.trim();

    // Si el campo oculto está vacío, significa que ninguna tarea fue seleccionada
    // para editar, por lo que mostramos error y detenemos la ejecución con return.
    if (!taskId) {
        showErrorMessage('No se pudo identificar la tarea a editar');
        return;
    }

    // Lee y limpia cada campo del formulario de edición
    const title = editTaskTitleInput.value.trim();
    const description = editTaskDescriptionInput.value.trim();
    const status = editTaskStatusSelect.value;

    // Valida que ningún campo esté vacío
    if (!title || !description || !status) {
        showErrorMessage('Por favor completa todos los campos de la tarea');
        return;
    }

    // Construye el objeto con los datos actualizados de la tarea
    const taskData = {
        title,
        description,
        status,
        userDocumento: currentUser.documento,
        userName: currentUser.nombre
    };

    // Envía la actualización a la API vía PUT con el ID de la tarea.
    // Retorna el objeto de la tarea actualizada o null si falló.
    const updatedTask = await updateTask(taskId, taskData);

    // Si la actualización fue exitosa
    if (updatedTask) {

        // findIndex busca el índice (posición) en el array, retorna -1 si no lo encuentra.
        // Usamos String() en ambos lados para evitar problemas de tipo number vs string.
        const idx = allTasks.findIndex(t => String(t.id) === String(taskId));

        // Si encontró la tarea en el acumulado (idx no es -1), la reemplaza con la versión actualizada
        if (idx !== -1) allTasks[idx] = updatedTask;

        // Hace lo mismo en el array del usuario actual
        const idx2 = currentTasks.findIndex(t => String(t.id) === String(taskId));
        if (idx2 !== -1) currentTasks[idx2] = updatedTask;

        // Muestra mensaje verde de confirmación
        showSuccessMessage('Tarea actualizada exitosamente');

        // Limpia y oculta el formulario de edición, vuelve a mostrar el de creación
        cancelEdit();

        // Actualiza la tabla con los datos nuevos
        displayTasks(allTasks);
    }
}

// Se ejecuta cuando el usuario hace click en el botón "Eliminar" de una tarea
async function confirmDeleteTask(taskId) {

    // Busca la tarea en el acumulado global para mostrar su título en el mensaje de confirmación
    const task = allTasks.find(t => t.id === taskId);

    // Si no encontró la tarea (no debería pasar, pero es una buena práctica verificar)
    if (!task) {
        showErrorMessage('Tarea no encontrada');
        return;
    }

    // confirm() muestra un diálogo nativo del navegador con botones "Aceptar" y "Cancelar".
    // Retorna true si el usuario hizo click en "Aceptar", false si hizo click en "Cancelar".
    // Las backteas `` insertan el título de la tarea en el mensaje.
    const confirmed = confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`);

    // Solo procede si el usuario confirmó con "Aceptar"
    if (confirmed) {

        // Envía la petición DELETE a la API. Retorna true si fue exitosa, false si falló.
        const success = await deleteTask(taskId);

        // Si la API confirmó que se eliminó correctamente
        if (success) {

            // .filter() crea un NUEVO array excluyendo la tarea eliminada.
            // Solo conserva las tareas cuyo ID sea distinto al taskId eliminado.
            allTasks = allTasks.filter(t => t.id !== taskId);

            // Hace lo mismo con el array del usuario actual
            currentTasks = currentTasks.filter(t => t.id !== taskId);

            // Muestra mensaje verde de confirmación
            showSuccessMessage('Tarea eliminada exitosamente');

            // Actualiza la tabla para que desaparezca la fila eliminada
            displayTasks(allTasks);
        }
    }
}


// SECCIÓN 6: INICIALIZACIÓN DE LA APLICACIÓN

// Función que registra todos los eventos y arranca la app
function initApp() {

    // .addEventListener(evento, función) "escucha" el evento en el elemento y ejecuta la función cada vez que ocurre.

    // Escucha el evento 'submit' en el formulario de búsqueda (cuando se presiona el botón Buscar)
    searchUserForm.addEventListener('submit', handleSearchUser);

    // Escucha el evento 'submit' en el formulario de crear tarea
    createTaskForm.addEventListener('submit', handleCreateTask);

    // Escucha el evento 'submit' en el formulario de editar tarea
    editTaskForm.addEventListener('submit', handleEditTask);

    // Escucha el evento 'click' en el botón Cancelar del formulario de edición
    cancelEditBtn.addEventListener('click', cancelEdit);

    // Mensajes en consola del navegador para verificar que todo cargó bien
    console.log(' Sistema de Gestión de Tareas iniciado correctamente');
    console.log(' Servidor: http://localhost:3000');
    console.log(' Asegúrate de que json-server esté corriendo en el puerto 3000');
}

// 'DOMContentLoaded' se inicia cuando el navegador terminó de leer y construir todo el HTML.
// Le decimos que CUANDO ese evento ocurra, ejecute initApp().
// Esto garantiza que todos los elementos del DOM (getElementById) ya existen antes de intentar seleccionarlos, evitando errores de "null".
document.addEventListener('DOMContentLoaded', initApp);