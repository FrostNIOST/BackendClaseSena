import { apiFetch } from "../utils/authUtils";

const API_URL = "http://localhost:3000/api/products";

export const createProduct = async (product) =>
  apiFetch(`${API_URL}/`, {
    method: "POST",
    body: product,
  });

export const getProducts = async () =>
  apiFetch(`${API_URL}/`, {
    method: "GET",
  });

export const getProductById = async (id) =>
  apiFetch(`${API_URL}/${id}`, {
    method: "GET",
  });

export const updateProduct = async (id, product) =>
  apiFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: product,
  });

export const deleteProduct = async (id) =>
  apiFetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
