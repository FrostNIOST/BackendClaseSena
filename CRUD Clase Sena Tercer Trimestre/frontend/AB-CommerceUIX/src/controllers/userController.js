
import { apiFetch } from '../utils/authUtils'; // Importa el wrapper de fetch que inyecta el JWT y centraliza el manejo de errores y sesiones expiradas

const API_URL = 'http://localhost:3000/api/users'; // URL base del backend para el recurso usuarios; el servidor Express escucha en puerto 3000

export const createUser = async (user) => {
    const response = await apiFetch(`${API_URL}/`, {
        method: 'POST',
        body: user
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al crear usuario');
    }
    return data;
}; // Fin de createUser

export const getAllUsers = async () => {
    const response = await apiFetch(`${API_URL}/`, {
        method: 'GET'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuarios');
    }
    return data;
}; // Fin de getAllUsers

export const getUserById = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'GET'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuario');
    }
    return data;
}; // Fin de getUserById

export const updateUser = async (id, user) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: user
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar usuario');
    }
    return data;
}; // Fin de updateUser

export const deleteUser = async () => {
    const response = await apiFetch(`${API_URL}/`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar usuario');
    }
    return data;
}; // Fin de deleteUser

export const deleteUserById = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar usuario');
    }
    return data;
}; // Fin de deleteUserById