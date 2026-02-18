// modulos/barril.js
// SISTEMA DE GESTIÓN DE TAREAS - CRUD COMPLETO
// Autores: Karol Nicolle Torres Fuentes, Juan Sebastian Patiño Hernandez
// Fecha: 17-02-2026
// Institución: SENA - Técnico en Programación de Software
// Módulo: Archivo barril - punto de entrada único para todos los módulos
// Uso: import { createTask, updateTask, ... } from './modulos/barril.js'

export { API_URL }                              from './config.js';
export { showSuccessMessage, showErrorMessage } from './utils.js';
export { searchUserByDocument, getUserTasks }   from './read.js';
export { createTask }                           from './create.js';
export { updateTask }                           from './update.js';
export { deleteTask }                           from './delete.js';