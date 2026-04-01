// lib/CarouselApi.js
import api from './api';

export const CarouselApi = {
  // Get active carousel slides (public)
  getCarouselSlides: async () => {
    try {
      const response = await api.get('/carousel');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch carousel slides');
    }
  },

  // Get all carousel slides (admin)
  getAllCarouselSlides: async () => {
    try {
      const response = await api.get('/carousel/admin');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch carousel slides');
    }
  },

  // Get single slide
  getCarouselSlideById: async (id) => {
    try {
      const response = await api.get(`/carousel/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch slide');
    }
  },

  // Add new slide
  addCarouselSlide: async (formData) => {
    try {
      const response = await api.post('/carousel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add slide');
    }
  },

  // Update slide
  updateCarouselSlide: async (id, formData) => {
    try {
      const response = await api.put(`/carousel/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update slide');
    }
  },

  // Delete slide
  deleteCarouselSlide: async (id) => {
    try {
      const response = await api.delete(`/carousel/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete slide');
    }
  },

  // Update slides order
  updateCarouselOrder: async (slides) => {
    try {
      const response = await api.put('/carousel/order/bulk', { slides });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update order');
    }
  }
};