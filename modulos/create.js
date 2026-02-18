// modulos/create.js
// SISTEMA DE GESTIÓN DE TAREAS - CRUD COMPLETO
// Autores: Karol Nicolle Torres Fuentes, Juan Sebastian Patiño Hernandez
// Fecha: 17-02-2026
// Institución: SENA - Técnico en Programación de Software
// Módulo: Operación de creación (CREATE) - POST de tareas

import { API_URL } from './config.js';
import { showErrorMessage } from './utils.js';

// Función asíncrona para crear una nueva tarea en la API (CREATE)
// Parámetro: taskData - Objeto con los datos de la tarea a crear
// Retorna: Objeto con la tarea creada (incluyendo su ID generado) o null si falla
export async function createTask(taskData) {
    try {
        // Construimos la URL para el endpoint de tareas
        const url = `${API_URL}/tasks`;

        // Configuramos las opciones de la petición POST
        const options = {
            method: 'POST', // Método HTTP para crear recursos
            headers: {
                'Content-Type': 'application/json' // Indicamos que enviamos JSON
            },
            body: JSON.stringify(taskData) // Convertimos el objeto a string JSON
        };

        // Realizamos la petición POST con las opciones configuradas
        const response = await fetch(url, options);

        // Verificamos si la creación fue exitosa
        if (!response.ok) {
            throw new Error('Error al crear tarea');
        }

        // Convertimos la respuesta a objeto JavaScript
        // El servidor retorna la tarea creada con su ID asignado
        const createdTask = await response.json();
        return createdTask;

    } catch (error) {
        console.error('Error al crear tarea:', error);
        showErrorMessage('Error al registrar la tarea');
        return null;
    }
}