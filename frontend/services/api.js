const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Helper function to set auth token
const setToken = (token) => localStorage.setItem('token', token);

// Helper function to remove auth token
const removeToken = () => localStorage.removeItem('token');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      removeToken();
      return null;
    }
  },
};

// Products API functions
export const productsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/products?${queryString}`);
  },

  getById: async (id) => {
    return await apiRequest(`/products/${id}`);
  },

  create: async (productData) => {
    return await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id, productData) => {
    return await apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getReviews: async (productId) => {
    return await apiRequest(`/products/${productId}/reviews`);
  },
  addReview: async (productId, review) => {
    return await apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },
};

// Orders API functions
export const ordersAPI = {
  create: async (orderData) => {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getUserOrders: async () => {
    return await apiRequest('/orders');
  },

  getOrderById: async (id) => {
    return await apiRequest(`/orders/${id}`);
  },

  getAll: async () => {
    return await apiRequest('/orders/all');
  },

  updateStatus: async (id, status) => {
    return await apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
}; 

export const stripeAPI = {
  createCheckoutSession: async (payload) => {
    return await apiRequest('/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
}; 

export const userAPI = {
  updateProfile: async (profile) => {
    return await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },
  updatePassword: async (payload) => {
    return await apiRequest('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getAll: async () => {
    return await apiRequest('/users');
  },
  updateRole: async (id, role) => {
    return await apiRequest(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
}; 

export const wishlistAPI = {
  get: async () => {
    return await apiRequest('/wishlist');
  },
  add: async (productId) => {
    return await apiRequest(`/wishlist/${productId}`, { method: 'POST' });
  },
  remove: async (productId) => {
    return await apiRequest(`/wishlist/${productId}`, { method: 'DELETE' });
  },
}; 

export const adminAPI = {
  getStats: async () => {
    return await apiRequest('/admin/stats');
  },
}; 