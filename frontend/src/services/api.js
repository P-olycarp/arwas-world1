import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ================= AUTH =================

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

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// ================= AXIOS INSTANCE =================

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ================= PRODUCTS =================

export const getProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const getProductsByCategory = async (category) => {
  const res = await fetch(
    `${API_BASE_URL}/products/category/${category}`
  );
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(result.error || 'Failed to create product');
  return result;
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(result.error || 'Failed to update product');
  return result;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(result.error || 'Failed to delete product');
  return result;
};

// ================= ORDERS =================

export const createOrder = async (data) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.error || 'Failed to create order');

  return result;
};

export const getOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: getAuthHeaders()
  });

  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const getOrder = async (id) => {
  const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: getAuthHeaders()
  });

  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
};

export const trackOrder = async (orderNumber) => {
  const res = await fetch(
    `${API_BASE_URL}/orders/track/${orderNumber}`
  );

  if (!res.ok) throw new Error('Failed to track order');
  return res.json();
};

export const updateOrderStatus = async (id, data) => {
  const res = await fetch(
    `${API_BASE_URL}/orders/${id}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    }
  );

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.error || 'Failed to update order');

  return result;
};

// ================= USERS =================

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.error || 'Failed to register');

  return result;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result.error || 'Failed to login');

  return result;
};

// ================= SETTINGS =================

export const getSettings = async () => {
  const res = await fetch(`${API_BASE_URL}/public/settings`);

  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};
