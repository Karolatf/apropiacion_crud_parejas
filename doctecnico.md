# Documento Técnico — Sistema de Gestión de Tareas CRUD

**Autores:** Karol Nicolle Torres Fuentes · Juan Sebastian Patiño Hernandez  
**Sena:** Ficha 3233198 – Técnico en Programación de Software  
**Fecha:** 17-02-2026

---

## 1. Descripción General

- Aplicación web SPA que gestiona tareas de usuarios a través de una API REST local con json-server. 
- Implementa CRUD completo: crear, leer, actualizar y eliminar tareas asociadas a usuarios identificados por número de documento.

---

## 2. index.html

- Define la estructura visual en 5 secciones tipo tarjeta: búsqueda de usuario, datos del usuario, registro de tarea, edición de tarea y lista de tareas. 
- Las secciones 2 a 5 inician ocultas (`display:none`) y se revelan dinámicamente desde JavaScript. 
- El script se carga con `type="module"` para soportar ES Modules.

---

## 3. style.css

- Aplica un reset global con `box-sizing: border-box`. 
- El fondo es un degradado verde-amarillo-salmón. 
- Las tarjetas (`.card`) son blancas con sombra y bordes redondeados. 
- Los botones tienen tres variantes: primario azul, editar verde claro y eliminar salmón, todos con efecto `hover` de elevación. - Los mensajes de notificación (`.message`) están ocultos por defecto y se colorean en verde para éxito y rojo para error.

---

## 4. script.js

- Es el punto de entrada principal. 
- Importa todas las funciones desde `./modulos/barril.js` y selecciona los elementos del DOM con `getElementById`. 
- Mantiene tres variables globales: `currentUser` (usuario activo), `currentTasks` (tareas del usuario actual) y `allTasks` (acumulado de todos los usuarios consultados, que nunca se vacía al cambiar de usuario).

- Las funciones del DOM construyen y actualizan la interfaz: `displayUserData` pinta los datos del usuario, `displayTasks` genera las filas de la tabla dinámicamente, `startEditTask` carga el formulario de edición y `cancelEdit` lo limpia. 
- Los manejadores de eventos (`handleSearchUser`, `handleCreateTask`, `handleEditTask`, `confirmDeleteTask`) validan los campos, llaman al módulo correspondiente y actualizan `allTasks` directamente sin recargar desde la API. La app arranca con `DOMContentLoaded` para garantizar que el DOM esté listo.

---

## 5. Módulos

- El proyecto usa ES Modules divididos por responsabilidad. 
- `config.js` exporta la constante `API_URL`. 
- `utils.js` exporta las funciones de mensajes de éxito y error. 
- `read.js` hace GET para buscar usuarios y obtener tareas. 
- `create.js` hace POST para crear tareas. 
- `update.js` hace PUT para actualizarlas. 
- `delete.js` hace DELETE para eliminarlas. 
- Todos los módulos CRUD usan `try/catch` y retornan `null` o `false` ante fallos. 
- `barril.js` re-exporta todo lo anterior como punto de entrada único.

---

## 6. Tecnologías

HTML, CSS, JavaScript con `fetch` y `async/await`, y json-server como API REST local en el puerto 3000.