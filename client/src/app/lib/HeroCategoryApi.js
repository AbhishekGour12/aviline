// lib/HeroCategoryApi.js
import api from './api';

export const HeroCategoryApi = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/category/hero-categories');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch categories');
    }
  },

  // Get single category
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/category/hero-categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch category');
    }
  },

  // Add new category
  addCategory: async (formData) => {
    try {
      const response = await api.post('/category/hero-categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add category');
    }
  },

  // Update category
  updateCategory: async (id, formData) => {
    try {
      const response = await api.put(`/category/hero-categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update category');
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/category/hero-categories/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete category');
    }
  },

  // Update categories order
  updateCategoriesOrder: async (categories) => {
    try {
      const response = await api.put('/category/hero-categories/order/bulk', { categories });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update order');
    }
  }
};