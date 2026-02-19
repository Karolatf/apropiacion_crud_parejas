// Módulo: Operaciones de lectura (READ) - GET de usuarios y tareas

import { API_URL } from './config.js';
import { showErrorMessage } from './utils.js';

// Función asíncrona para buscar un usuario por su documento en la API
// Parámetro: documento - Número de documento del usuario a buscar
// Retorna: Objeto con los datos del usuario o null si no se encuentra
export async function searchUserByDocument(documento) {
    try {
        // Construimos la URL completa para hacer la petición GET a /users
        const url = `${API_URL}/users`;
        // Realizamos la petición HTTP GET usando fetch
        const response = await fetch(url);

        // Verificamos si la respuesta fue exitosa (código 200-299)
        if (!response.ok) {
            throw new Error('Error al consultar usuarios');
        }

        // Convertimos la respuesta JSON a un array de JavaScript
        const users = await response.json();

        // Buscamos el usuario cuyo documento coincida con el buscado
        const user = users.find(u => u.documento.toString() === documento.toString());

        // Retornamos el usuario encontrado o null si no existe
        return user || null;

    } catch (error) {
        console.error('Error en búsqueda de usuario:', error);
        showErrorMessage('Error al buscar usuario. Verifica que el servidor esté corriendo.');
        return null;
    }
}

// Función asíncrona para obtener todas las tareas de un usuario específico (READ)
// Parámetro: userDocumento - Documento del usuario cuyas tareas queremos obtener
// Retorna: Array con las tareas del usuario
export async function getUserTasks(userDocumento) {
    try {
        // Construimos la URL para obtener todas las tareas con filtro por usuario
        const url = `${API_URL}/tasks?userDocumento=${userDocumento}`;
        // Realizamos la petición GET
        const response = await fetch(url);

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener tareas');
        }

        // Convertimos la respuesta JSON a un array de tareas
        const tasks = await response.json();
        return tasks;

    } catch (error) {
        console.error('Error al obtener tareas:', error);
        showErrorMessage('Error al cargar las tareas');
        // Retornamos array vacío en caso de error
        return [];
    }
}