// Módulo: Operación de actualización (UPDATE) - PUT de tareas

import { API_URL } from './config.js';
import { showErrorMessage } from './utils.js';

// Función asíncrona para actualizar una tarea existente (UPDATE)
// Parámetros: taskId - ID de la tarea a actualizar
//             taskData - Objeto con los nuevos datos de la tarea
// Retorna: Objeto con la tarea actualizada o null si falla
export async function updateTask(taskId, taskData) {
    try {
        // Construimos la URL incluyendo el ID de la tarea específica
        const url = `${API_URL}/tasks/${taskId}`;

        // Configuramos las opciones de la petición PUT
        const options = {
            method: 'PUT', // PUT actualiza el recurso completo
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData) // Convertimos los datos a JSON
        };

        // Realizamos la petición PUT
        const response = await fetch(url, options);

        // Verificamos si la actualización fue exitosa
        if (!response.ok) {
            throw new Error('Error al actualizar tarea');
        }

        // Obtenemos la tarea actualizada desde la respuesta
        const updatedTask = await response.json();
        return updatedTask;

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        showErrorMessage('Error al actualizar la tarea');
        return null;
    }
}