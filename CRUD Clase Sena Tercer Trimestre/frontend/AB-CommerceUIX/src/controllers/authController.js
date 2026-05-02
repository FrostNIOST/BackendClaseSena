import { apiFetch } from '../utils/authUtils'; // Importa el wrapper de fetch que agrega el JWT automáticamente en cada petición

const API_URL = 'http://localhost:3000/api/auth'; // URL base del backend para rutas de autenticación; puerto 3000 es el servidor Express

export const signin = async (credentials) => {
    const response = await apiFetch(`${API_URL}/signin`, {
        method: 'POST',
        body: credentials
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); // Guarda el token JWT en localStorage para futuras peticiones autenticadas
    } else {
        throw new Error(data.message || 'Error al iniciar sesión'); // Lanza un error con el mensaje del servidor o un mensaje genérico
    }
    return response;

};// Función exportada para iniciar sesión; recibe { username, password }

export const signup = async (user) => {
    const response = await apiFetch(`${API_URL}/signup`, {
        method: 'POST',
        body: user
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); // Guarda el token JWT en localStorage para futuras peticiones autenticadas
    } else {
        throw new Error(data.message || 'Error al registrar'); // Lanza un error con el mensaje del servidor o un mensaje genérico
    }
    return response;
}; // Fin de la función register

export const register = async (user) => {
    const response = await apiFetch(`${API_URL}/register`, {
        method: 'POST',
        body: user
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); // Guarda el token JWT en localStorage para futuras peticiones autenticadas
    } else {
        throw new Error(data.message || 'Error al registrar'); // Lanza un error con el mensaje del servidor o un mensaje genérico
    }
    return response;
}; // Fin de la función register