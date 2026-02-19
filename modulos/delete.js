// Módulo: Operación de eliminación (DELETE) - DELETE de tareas

import { API_URL } from './config.js';
import { showErrorMessage } from './utils.js';

// Función asíncrona para eliminar una tarea (DELETE)
// Parámetro: taskId - ID de la tarea a eliminar
// Retorna: true si se eliminó correctamente, false si falló
export async function deleteTask(taskId) {
    try {
        // Construimos la URL incluyendo el ID de la tarea a eliminar
        const url = `${API_URL}/tasks/${taskId}`;

        // Configuramos las opciones de la petición DELETE
        const options = {
            method: 'DELETE' // DELETE elimina el recurso
        };

        // Realizamos la petición DELETE
        const response = await fetch(url, options);

        // Verificamos si la eliminación fue exitosa
        if (!response.ok) {
            throw new Error('Error al eliminar tarea');
        }

        // Retornamos true para indicar éxito
        return true;

    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        showErrorMessage('Error al eliminar la tarea');
        return false;
    }
}