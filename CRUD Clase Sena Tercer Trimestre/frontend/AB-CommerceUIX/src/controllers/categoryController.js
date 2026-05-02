import { apiFetch } from "../utils/authUtils";

const API_URL = "http://localhost:3000/api/categories";

export const createCategory = async (category) =>
  apiFetch(`${API_URL}/`, {
    method: "POST",
    body: category,
  });

export const getCategories = async () =>
  apiFetch(`${API_URL}/`, {
    method: "GET",
  });

export const getCategoriesById = async (id) =>
  apiFetch(`${API_URL}/${id}`, {
    method: "GET",
  });

export const updateCategory = async (id, category) =>
  apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: category,
  });

export const deleteCategory = async (id) =>
  apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
