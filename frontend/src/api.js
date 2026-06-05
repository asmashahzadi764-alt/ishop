// This file provides two ways to call the backend:
// 1) existing fetch-based helpers (keeps repo compatibility)
// 2) a centralized axios client that works with Vite proxy (recommended)

// -----------------------------
// Fetch helpers (legacy - use only if other code imports these)
// -----------------------------
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/products`
  : '/api/products'; // when using Vite proxy this is proxied to backend

// 📜 Get all products
export const getProducts = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

// ➕ Add a product
export const addProduct = async (product) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return await res.json();
};

// ✏️ Update a product
export const updateProduct = async (id, product) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return await res.json();
};

// ❌ Delete a product
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};

// -----------------------------
// Recommended: axios client (works well with Vite proxy)
// -----------------------------
import axios from 'axios';

export const api = axios.create({
  baseURL: '/', // use relative path so Vite proxy forwards /api to backend
  withCredentials: true,
});

export default api;
