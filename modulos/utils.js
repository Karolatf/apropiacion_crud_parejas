// Módulo: Funciones de utilidad (mensajes de éxito y error)

// Seleccionamos el elemento div donde mostraremos mensajes de éxito o error
const messageDiv = document.getElementById('message');

// Función para mostrar mensajes de éxito al usuario
// Parámetro: text - El texto del mensaje a mostrar
export function showSuccessMessage(text) {
    messageDiv.textContent = text;
    // Removemos la clase 'error' si existiera
    messageDiv.classList.remove('error');
    // Agregamos la clase 'success' para aplicar estilos de éxito
    messageDiv.classList.add('success');
    messageDiv.style.display = 'block';
    // Ocultamos el mensaje después de 3 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Función para mostrar mensajes de error al usuario
// Parámetro: text - El texto del mensaje de error a mostrar
export function showErrorMessage(text) {
    messageDiv.textContent = text;
    // Removemos la clase 'success' si existiera
    messageDiv.classList.remove('success');
    // Agregamos la clase 'error' para aplicar estilos de error
    messageDiv.classList.add('error');
    messageDiv.style.display = 'block';
    // Más tiempo para errores (5 segundos)
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}