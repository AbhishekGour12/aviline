// routes/productRoutes.js
import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkAddProducts,
  bulkExcelUpload,
  getCategories,
  getSubcategories,
  getProductTypes,
  getFabricTypes,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  addProductType,
  updateProductType,
  deleteProductType,
  addFabricType,
  updateFabricType,
  deleteFabricType,
  
  getALLProductTypes,
  getSubcategoriesByCategory,
  getProductTypesBySubcategory,
  getProductsBySubcategory,
  getProductsByProductType,
  getCategoryHierarchy,
  getFeaturedProducts,
  searchProducts,
  getColors,
  getColorsFull,
  addColor,
  updateColor,
  deleteColor,
  updateColorsBulk,
  getSizes,
  getSizesFull,
  addSize,
  updateSize,
  deleteSize,
  updateSizesBulk,
  getFilterOptions
} from '../Controllers/ProductController.js';

import { handleMulterError, uploadMixedFiles, uploadProductImages } from '../Middleware/Multer.js';

const router = express.Router();

// Product CRUD
router.post('/products/bulk', uploadProductImages.array('images', 100), handleMulterError, updateProduct);
router.post('/products/bulk-excel', uploadMixedFiles, handleMulterError, bulkExcelUpload);

router.post('/products', uploadProductImages.array('images', 20), handleMulterError, addProduct);
router.get('/products', getAllProducts);

// Category Management
router.get('/categories', getCategories);
router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/products/:id', getProductById);
router.put('/products/:id', uploadProductImages.array('images', 20), handleMulterError, updateProduct);
router.delete('/products/:id', deleteProduct);


// Subcategory Management
router.get('/subcategories', getSubcategories);
router.post('/subcategories', addSubcategory);
router.put('/subcategories/:id', updateSubcategory);
router.delete('/subcategories/:id', deleteSubcategory);

// Product Type Management
router.get('/product-types/:subcategoryId', getProductTypes);
router.get('/product-types', getALLProductTypes);
router.post('/product-types', addProductType);
router.put('/product-types/:id', updateProductType);
router.delete('/product-types/:id', deleteProductType);

// Fabric Type Management
router.get('/fabric-types', getFabricTypes);
router.post('/fabric-types', addFabricType);
router.put('/fabric-types/:id', updateFabricType);
router.delete('/fabric-types/:id', deleteFabricType);

// Color routes
router.get('/colors', getColors);
router.get('/colors/full', getColorsFull);
router.post('/colors', addColor);
router.put('/colors/:id', updateColor);
router.delete('/colors/:id', deleteColor);
router.put('/colors/bulk', updateColorsBulk);

// Size routes
router.get('/sizes', getSizes);
router.get('/sizes/full', getSizesFull);
router.post('/sizes', addSize);
router.put('/sizes/:id', updateSize);
router.delete('/sizes/:id', deleteSize);
router.put('/sizes/bulk', updateSizesBulk);
// routes/productRoutes.js - Add this route

router.get('/filter-options', getFilterOptions);
// Get subcategories by category (for dropdowns)
router.get('/subcategories/category/:categoryId', getSubcategoriesByCategory);

// Get product types by subcategory (for dropdowns)
router.get('/product-types/subcategory/:subcategoryId', getProductTypesBySubcategory);

// Get products by subcategory
router.get('/products/subcategory/:subcategoryId', getProductsBySubcategory);

// Get products by product type
router.get('/products/product-type/:productTypeId', getProductsByProductType);

// Get full category hierarchy (for navbar)
router.get('/category-hierarchy', getCategoryHierarchy);

// Get featured products
router.get('/featured-products', getFeaturedProducts);

// Search products
router.get('/products/search', searchProducts);
export default router;