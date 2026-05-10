import axios from 'axios';

const API_BASE_URL = '/api';

const getAuthToken = () => {
  try {
    const savedUser = localStorage.getItem('arwas_world_user');
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create and export axios instance for direct API calls
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Products
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const getProductsByCategory = async (category) => {
  const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create product: ${response.statusText}`);
  }
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update product: ${response.statusText}`);
  }
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to delete product: ${response.statusText}`);
  }
  return response.json();
};

// Orders
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
};

export const getOrder = async (id) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const trackOrder = async (orderNumber) => {
  const response = await fetch(`${API_BASE_URL}/orders/track/${orderNumber}`);
  if (!response.ok) throw new Error('Failed to track order');
  return response.json();
};

export const updateOrderStatus = async (id, statusData) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statusData)
  });
  if (!response.ok) throw new Error('Failed to update order');
  return response.json();
};

export const updateOrder = async (id, orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update order');
  }
  return response.json();
};

// Users
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Failed to register');
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
};

export const getUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

export const getUserOrders = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`);
  if (!response.ok) throw new Error('Failed to fetch user orders');
  return response.json();
};
// Settings (Admin)
export const getSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/public/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
};

export const updateSettings = async (settingsData) => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(settingsData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update settings');
  }
  return response.json();
};

export const updateSettingsSection = async (section, data) => {
  const response = await fetch(`${API_BASE_URL}/settings/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update settings');
  }
  return response.json();
};

export const resetSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/settings/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
  });
  if (!response.ok) throw new Error('Failed to reset settings');
  return response.json();
};

// Upload image for settings
export const uploadSettingsImage = async (file, section) => {
  const formData = new FormData();
  formData.append('image', file);

  const endpoint = section ? `${API_BASE_URL}/settings/upload/${section}` : `${API_BASE_URL}/settings/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { ...getAuthHeaders() },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload image');
  }
  return response.json();
};