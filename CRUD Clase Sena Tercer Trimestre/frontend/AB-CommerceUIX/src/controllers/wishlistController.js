import { apiFetch } from "../utils/authUtils";

const API_URL = "http://localhost:3000/api/wishlist";

export const getWishlist = async () => {
  return apiFetch(`${API_URL}/`, {
    method: "GET",
  });
};

export const getWishlistById = async (id) => {
  return apiFetch(`${API_URL}/${id}`, {
    method: "GET",
  });
};

export const addWishlistItem = async (productId) => {
  return apiFetch(`${API_URL}/`, {
    method: "PUT",
    body: { productId },
  });
};

export const removeWishlistItem = async (productId) => {
  return apiFetch(`${API_URL}/`, {
    method: "PATCH",
    body: { productId },
  });
};
