// lib/ProductApi.js
import api from "./api";
const API_URL = process.env.NEXT_PUBLIC_API
export const ProductApi = {
  
  // Product CRUD
  getProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });
      const response = await api.get(`product/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      throw new Error(errorMessage);
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`product/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      throw new Error(errorMessage);
    }
  },

  createProduct: async (formData) => {
    try {
      const response = await api.post('product/products', formData, {
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
      const response = await api.put(`product/products/${id}`, formData, {
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
      const response = await api.delete(`product/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      throw new Error(errorMessage);
    }
  },

  // ============== Category Management (Main Categories) ==============
  getCategories: async () => {
    try {
      const response = await api.get('product/categories');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
      throw new Error(errorMessage);
    }
  },

  addCategory: async (data) => {
    try {
      const response = await api.post('product/categories', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add category';
      throw new Error(errorMessage);
    }
  },

  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`product/categories/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      throw new Error(errorMessage);
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`product/categories/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      throw new Error(errorMessage);
    }
  },

  // ============== Subcategory Management ==============
  getSubcategories: async (categoryId) => {
    try {
      console.log(categoryId)
      const url = `product/subcategories/${categoryId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subcategories';
      throw new Error(errorMessage);
    }
  },

  getAllSubcategories: async () => {
    try {
      const response = await api.get('product/subcategories');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subcategories';
      throw new Error(errorMessage);
    }
  },

  addSubcategory: async (data) => {
    try {
      const response = await api.post('product/subcategories', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add subcategory';
      throw new Error(errorMessage);
    }
  },

  updateSubcategory: async (id, data) => {
    try {
      const response = await api.put(`product/subcategories/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update subcategory';
      throw new Error(errorMessage);
    }
  },

  deleteSubcategory: async (id) => {
    try {
      const response = await api.delete(`product/subcategories/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete subcategory';
      throw new Error(errorMessage);
    }
  },

  // ============== Product Type Management ==============
  getProductTypes: async (subcategoryId) => {
    try {
      const url = subcategoryId ? `product/product-types/${subcategoryId}` : 'product/product-types';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product types';
      throw new Error(errorMessage);
    }
  },

  getAllProductTypes: async () => {
    try {
      const response = await api.get('product/product-types');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product types';
      throw new Error(errorMessage);
    }
  },

  addProductType: async (data) => {
    try {
      const response = await api.post('product/product-types', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add product type';
      throw new Error(errorMessage);
    }
  },

  updateProductType: async (id, data) => {
    try {
      const response = await api.put(`product/product-types/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product type';
      throw new Error(errorMessage);
    }
  },

  deleteProductType: async (id) => {
    try {
      const response = await api.delete(`product/product-types/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product type';
      throw new Error(errorMessage);
    }
  },

  // ============== Fabric Type Management ==============
  getFabricTypes: async () => {
    try {
      const response = await api.get('product/fabric-types');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch fabric types';
      throw new Error(errorMessage);
    }
  },

  addFabricType: async (data) => {
    try {
      const response = await api.post('product/fabric-types', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add fabric type';
      throw new Error(errorMessage);
    }
  },

  updateFabricType: async (id, data) => {
    try {
      const response = await api.put(`product/fabric-types/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update fabric type';
      throw new Error(errorMessage);
    }
  },

  deleteFabricType: async (id) => {
    try {
      const response = await api.delete(`product/fabric-types/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete fabric type';
      throw new Error(errorMessage);
    }
  },

  // ============== Color Management ==============
  getColors: async () => {
    try {
      const response = await api.get('product/colors');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch colors';
      throw new Error(errorMessage);
    }
  },

  updateColors: async (colors) => {
    try {
      const response = await api.put('product/colors', { colors });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update colors';
      throw new Error(errorMessage);
    }
  },

  addColor: async (color) => {
    try {
      const response = await api.post('product/colors', { color });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add color';
      throw new Error(errorMessage);
    }
  },

  deleteColor: async (color) => {
    try {
      const response = await api.delete(`product/colors/${encodeURIComponent(color)}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete color';
      throw new Error(errorMessage);
    }
  },

  // ============== Size Management ==============
  getSizes: async () => {
    try {
      const response = await api.get('product/sizes');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sizes';
      throw new Error(errorMessage);
    }
  },

  updateSizes: async (sizes) => {
    try {
      const response = await api.put('product/sizes', { sizes });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update sizes';
      throw new Error(errorMessage);
    }
  },

  addSize: async (size) => {
    try {
      const response = await api.post('product/sizes', { size });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add size';
      throw new Error(errorMessage);
    }
  },

  deleteSize: async (size) => {
    try {
      const response = await api.delete(`product/sizes/${encodeURIComponent(size)}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete size';
      throw new Error(errorMessage);
    }
  },

  // ============== Stock Management ==============
  updateStock: async (id, stock) => {
    try {
      const response = await api.patch(`product/products/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update stock';
      throw new Error(errorMessage);
    }
  },

  toggleFeatured: async (id, isFeatured) => {
    try {
      const response = await api.patch(`product/products/${id}/featured`, { isFeatured });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle featured status';
      throw new Error(errorMessage);
    }
  },

  getLowStockProducts: async (threshold = 10) => {
    try {
      const response = await api.get(`product/products/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch low stock products';
      throw new Error(errorMessage);
    }
  },

  // ============== Bulk Operations ==============
  bulkAddProducts: async (formData) => {
    try {
      const response = await api.post('product/products/bulk', formData, {
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
      const response = await fetch(`${API_URL}/api/product/products/bulk-excel`, {
        method: 'POST',
        body: formData, // Don't set Content-Type, let browser set it with boundary
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Excel upload error:', error);
      throw error;
    }
  },

  // ============== Dashboard/Statistics ==============
  getProductStats: async () => {
    try {
      const response = await api.get('product/products/stats');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product statistics';
      throw new Error(errorMessage);
    }
  },

  getCategoryStats: async () => {
    try {
      const response = await api.get('product/categories/stats');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch category statistics';
      throw new Error(errorMessage);
    }
  },

  // ============== Search & Filters ==============
  searchProducts: async (query) => {
    try {
      const response = await api.get(`product/products/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to search products';
      throw new Error(errorMessage);
    }
  },

  getProductsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`product/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products by category';
      throw new Error(errorMessage);
    }
  },

  getProductsBySubcategory: async (subcategoryId) => {
    try {
      const response = await api.get(`product/products/subcategory/${subcategoryId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products by subcategory';
      throw new Error(errorMessage);
    }
  },

  getProductsByProductType: async (productTypeId) => {
    try {
      const response = await api.get(`product/products/product-type/${productTypeId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products by product type';
      throw new Error(errorMessage);
    }
  },

  getProductsByFabricType: async (fabricTypeId) => {
    try {
      const response = await api.get(`product/products/fabric-type/${fabricTypeId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products by fabric type';
      throw new Error(errorMessage);
    }
  },

  // ============== Export Functions ==============
  exportProducts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });
      const response = await api.get(`product/products/export?${queryParams.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to export products';
      throw new Error(errorMessage);
    }
  },

  downloadTemplate: async () => {
    try {
      const response = await api.get('product/products/template', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to download template';
      throw new Error(errorMessage);
    }
  },

  // ============== Helper Functions ==============
  getCategoryHierarchy: async () => {
    try {
      const categories = await ProductApi.getCategories();
      const subcategories = await ProductApi.getAllSubcategories();
      const productTypes = await ProductApi.getAllProductTypes();
      const fabricTypes = await ProductApi.getFabricTypes();
      
      const hierarchy = categories.map(category => ({
        ...category,
        subcategories: subcategories.filter(sub => sub.categoryId === category._id).map(sub => ({
          ...sub,
          productTypes: productTypes.filter(type => type.subcategoryId === sub._id)
        }))
      }));
      
      return {
        categories: hierarchy,
        fabricTypes
      };
    } catch (error) {
      console.error('Failed to fetch category hierarchy:', error);
      throw error;
    }
  },
  // Get subcategories by category ID
  getSubcategoriesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`product/subcategories/category/${categoryId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subcategories';
      throw new Error(errorMessage);
    }
  },

  // Get product types by subcategory ID
  getProductTypesBySubcategory: async (subcategoryId) => {
    try {
      const response = await api.get(`product/product-types/subcategory/${subcategoryId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product types';
      throw new Error(errorMessage);
    }
  },

  // Get full category hierarchy for navbar
  getCategoryHierarchy: async () => {
    try {
      const response = await api.get('product/category-hierarchy');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch category hierarchy';
      throw new Error(errorMessage);
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10) => {
    try {
      const response = await api.get(`product/featured-products?limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch featured products';
      throw new Error(errorMessage);
    }
  },

  // Search products with query
  searchProducts: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get(`product/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to search products';
      throw new Error(errorMessage);
    }
  },
   // ============== Color Management ==============
  getColors: async () => {
    try {
      const response = await api.get('product/colors');
      return response.data; // Returns array of color names for backward compatibility
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch colors';
      throw new Error(errorMessage);
    }
  },

  getColorsFull: async () => {
    try {
      const response = await api.get('product/colors/full');
      return response.data; // Returns full color objects with hexCode, order, etc.
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch colors';
      throw new Error(errorMessage);
    }
  },

  addColor: async (colorData) => {
    try {
      const response = await api.post('product/colors', colorData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add color';
      throw new Error(errorMessage);
    }
  },

  updateColor: async (id, colorData) => {
    try {
      const response = await api.put(`product/colors/${id}`, colorData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update color';
      throw new Error(errorMessage);
    }
  },

  deleteColor: async (id) => {
    try {
      const response = await api.delete(`product/colors/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete color';
      throw new Error(errorMessage);
    }
  },

  updateColorsBulk: async (colors) => {
    try {
      const response = await api.put('product/colors/bulk', { colors });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update colors';
      throw new Error(errorMessage);
    }
  },

  // ============== Size Management ==============
  getSizes: async () => {
    try {
      const response = await api.get('product/sizes');
      return response.data; // Returns array of size names for backward compatibility
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sizes';
      throw new Error(errorMessage);
    }
  },

  getSizesFull: async () => {
    try {
      const response = await api.get('product/sizes/full');
      return response.data; // Returns full size objects with order, etc.
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sizes';
      throw new Error(errorMessage);
    }
  },

  addSize: async (sizeData) => {
    try {
      const response = await api.post('product/sizes', sizeData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add size';
      throw new Error(errorMessage);
    }
  },

  updateSize: async (id, sizeData) => {
    try {
      const response = await api.put(`product/sizes/${id}`, sizeData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update size';
      throw new Error(errorMessage);
    }
  },

  deleteSize: async (id) => {
    try {
      const response = await api.delete(`product/sizes/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete size';
      throw new Error(errorMessage);
    }
  },

  updateSizesBulk: async (sizes) => {
    try {
      const response = await api.put('product/sizes/bulk', { sizes });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update sizes';
      throw new Error(errorMessage);
    }
  },
  // Get all filter options (categories, colors, sizes, etc.)
  getFilterOptions: async () => {
    try {
      const response = await api.get('product/filter-options');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch filter options';
      throw new Error(errorMessage);
    }
  },

  // Get all colors from database
  getAllColors: async () => {
    try {
      const response = await api.get('product/colors/full');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch colors';
      throw new Error(errorMessage);
    }
  },

  // Get all sizes from database
  getAllSizes: async () => {
    try {
      const response = await api.get('product/sizes/full');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sizes';
      throw new Error(errorMessage);
    }
  },

  // Get all categories with hierarchy
  getCategoryHierarchy: async () => {
    try {
      const response = await api.get('product/category-hierarchy');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch category hierarchy';
      throw new Error(errorMessage);
    }
  },
  // User Interest methods
 addUserInterest: async (productId) => {
  const response = await api.post('/user-interests', {productId: productId},{
  
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    
  });
  return response.data;
},

 removeUserInterest: async (productId) => {
  const response = await api.delete(`/user-interests/${productId}`, {
    
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
},

checkUserInterest: async (productId) => {
  const response = await api.get(`/user-interests/${productId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
},

getProductLikesCount: async (productId) => {
  const response = await api.get(`/user-interests/likeCount/${productId}`);
  return response.data;
},

};

export default ProductApi;