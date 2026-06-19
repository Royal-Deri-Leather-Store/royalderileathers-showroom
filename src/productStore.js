// src/productStore.js
// Client data layer backed by products.json and Netlify Functions

import staticProducts from './products.json';

let activeCatalog = [...staticProducts];

export const seedProducts = () => {
  // Seeding is handled at build-time. This is a no-op for backward compatibility.
};

export const getProducts = () => {
  return activeCatalog;
};

export const saveProducts = (products) => {
  activeCatalog = products;
};

export const addProductLocally = (product) => {
  const exists = activeCatalog.some(p => p.id === product.id);
  if (!exists) {
    activeCatalog.push(product);
  }
};

export const deleteProductLocally = (productId) => {
  activeCatalog = activeCatalog.filter(p => p.id !== productId);
};

export const editProductLocally = (product) => {
  const idx = activeCatalog.findIndex(p => p.id === product.id);
  if (idx > -1) {
    activeCatalog[idx] = product;
  }
};

// Netlify Functions API Communications

/**
 * Verify admin password against Netlify serverless endpoint
 * @param {string} password 
 * @returns {Promise<{authenticated: boolean}>}
 */
export const verifyAdminPassword = async (password) => {
  const res = await fetch('/.netlify/functions/verify-admin', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${password}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Authentication failed');
  }

  return await res.json();
};

/**
 * Persist catalog changes to GitHub repository via Netlify Function
 * @param {'add'|'edit'|'delete'} action 
 * @param {object|string} payload - Product object (for add/edit) or productId string (for delete)
 * @param {string} password - Admin authorization password
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateCatalogOnGit = async (action, payload, password) => {
  const body = { action };
  
  if (action === 'add' || action === 'edit') {
    body.product = payload;
  } else if (action === 'delete') {
    body.productId = payload;
  }

  const res = await fetch('/.netlify/functions/update-catalog', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${password}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to persist changes to GitHub');
  }

  return await res.json();
};

// Cart state persists inside localStorage per user
export const saveCart = (cart) => {
  localStorage.setItem('royalderi_cart', JSON.stringify(cart));
};

export const loadCart = () => {
  const data = localStorage.getItem('royalderi_cart');
  return data ? JSON.parse(data) : [];
};
