import { apiFetch } from '../utils/authUtils'; // Importa el wrapper de fetch que inyecta el JWT y centraliza el manejo de errores y sesiones expiradas
const API_URL = 'http://localhost:3000/api/subcategories'; // URL base del backend para el recurso categorias; el servidor Express escucha en puerto 3000

export const createSubategory = async (subcategory) => {
    const response = await apiFetch(`${API_URL}/`, {
        method: 'POST',
        body: subcategory
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al crear subcategoria');
    }
    return data;
}; // Fin de createSubategory

export const getSubcategories = async () => {
    const response = await apiFetch(`${API_URL}/`, {
        method: 'GET'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener subcategorias');
    }
    return data;
}; // Fin de getSubcategories

export const getSubcategoriesById = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'GET'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al obtener subcategoria');
    }
    return data;
}; // Fin de getSubcategoriesById

export const updateSubcategory = async (id, subcategory) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: subcategory
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar subcategoria');
    }
    return data;
}; // Fin de updateSubcategory

export const deleteSubcategory = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar subcategoria');
    }
    return data;
}; // Fin de deleteSubcategory