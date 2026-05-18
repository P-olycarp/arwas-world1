import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://arwas-world.onrender.com/api';

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
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
};

// Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ================= PRODUCTS =================

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
};

export const getProductsByCategory = async (category) => {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${category}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Failed to create product`
    );
  }

  return data;
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Failed to update product`
    );
  }

  return data;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || `Failed to delete product`
    );
  }

  return data;
};

// ================= ORDERS =================

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(orderData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create order');
  }

  return data;
};

export const getOrder = async (id) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  return response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

export const trackOrder = async (orderNumber) => {
  const response = await fetch(
    `${API_BASE_URL}/orders/track/${orderNumber}`
  );

  if (!response.ok) {
    throw new Error('Failed to track order');
  }

  return response.json();
};

export const updateOrderStatus = async (id, statusData) => {
  const response = await fetch(
    `${API_BASE_URL}/orders/${id}/status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(statusData)
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update order');
  }

  return data;
};

export const updateOrder = async (id, orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(orderData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update order');
  }

  return data;
};

// ================= USERS =================

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to register');
  }

  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to login');
  }

  return data;
};

export const getUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
};

export const getUserOrders = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/orders`,
    {
      headers: {
        ...getAuthHeaders()
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user orders');
  }

  return response.json();
};

// ================= SETTINGS =================

export const getSettings = async () => {
  const response = await fetch(
    `${API_BASE_URL}/public/settings`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }

  return response.json();
};

export const updateSettings = async (settingsData) => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(settingsData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update settings');
  }

  return data;
};

export const updateSettingsSection = async (
  section,
  data
) => {
  const response = await fetch(
    `${API_BASE_URL}/settings/${section}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.error || 'Failed to update settings'
    );
  }

  return result;
};

export const resetSettings = async () => {
  const response = await fetch(
    `${API_BASE_URL}/settings/reset`,
    {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to reset settings');
  }

  return response.json();
};

// ================= IMAGE UPLOAD =================

export const uploadSettingsImage = async (
  file,
  section
) => {
  const formData = new FormData();

  formData.append('image', file);

  const endpoint = section
    ? `${API_BASE_URL}/settings/upload/${section}`
    : `${API_BASE_URL}/settings/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to upload image');
  }

  return data;
};
