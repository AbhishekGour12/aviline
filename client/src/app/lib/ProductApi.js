// lib/ProductApi.js
import api from "./api";

export const ProductApi = {
  // Product CRUD
  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/product?${queryParams}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      throw new Error(errorMessage);
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      throw new Error(errorMessage);
    }
  },

  createProduct: async (formData) => {
    try {
      const response = await api.post('/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      throw new Error(errorMessage);
    }
  },

  updateProduct: async (id, formData) => {
    try {
      const response = await api.put(`/product/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      throw new Error(errorMessage);
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/product/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      throw new Error(errorMessage);
    }
  },

  // Category Management
  getCategories: async () => {
    try {
      const response = await api.get('/product/categories');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
      throw new Error(errorMessage);
    }
  },

  updateCategories: async (categories) => {
    try {
      const response = await api.put('/product/categories', { categories });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update categories';
      throw new Error(errorMessage);
    }
  },

  addCategory: async (category, subcategories = []) => {
    try {
      const response = await api.post('/product/categories', { category, subcategories });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add category';
      throw new Error(errorMessage);
    }
  },

  deleteCategory: async (category) => {
    try {
      const response = await api.delete(`/product/categories/${category}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      throw new Error(errorMessage);
    }
  },

  addSubcategory: async (category, subcategory) => {
    try {
      const response = await api.post('/product/categories/subcategory', { category, subcategory });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add subcategory';
      throw new Error(errorMessage);
    }
  },

  deleteSubcategory: async (category, subcategory) => {
    try {
      const response = await api.delete(`/product/categories/${category}/subcategory/${subcategory}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete subcategory';
      throw new Error(errorMessage);
    }
  },

  // Color Management
  getColors: async () => {
    try {
      const response = await api.get('/product/colors');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch colors';
      throw new Error(errorMessage);
    }
  },

  updateColors: async (colors) => {
    try {
      const response = await api.put('/product/colors', { colors });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update colors';
      throw new Error(errorMessage);
    }
  },

  // Size Management
  getSizes: async () => {
    try {
      const response = await api.get('/product/sizes');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sizes';
      throw new Error(errorMessage);
    }
  },

  updateSizes: async (sizes) => {
    try {
      const response = await api.put('/product/sizes', { sizes });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update sizes';
      throw new Error(errorMessage);
    }
  },

  // Stock Management
  updateStock: async (id, stock) => {
    try {
      const response = await api.patch(`/product/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update stock';
      throw new Error(errorMessage);
    }
  },

  toggleFeatured: async (id, isFeatured) => {
    try {
      const response = await api.patch(`/product/${id}/featured`, { isFeatured });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle featured status';
      throw new Error(errorMessage);
    }
  },

  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await api.get(`/product/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch low stock products';
      throw new Error(errorMessage);
    }
  },

  // Bulk Operations
  bulkAddProducts: async (formData) => {
    try {
      const response = await api.post('/product/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to bulk add products';
      throw new Error(errorMessage);
    }
  },

  bulkExcelUpload: async (formData) => {
    try {
      const response = await api.post('/product/bulk-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload Excel';
      throw new Error(errorMessage);
    }
  }
};