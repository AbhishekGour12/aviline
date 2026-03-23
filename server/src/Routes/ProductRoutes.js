// routes/ecommerceProductRoutes.js
import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  addBulkProductsWithImages,
  uploadBulkProductsWithImages,
  getCategories,
  updateCategories,
  addCategory,
  deleteCategory,
  addSubcategory,
  deleteSubcategory,
  getColors,
  updateColors,
  getSizes,
  updateSizes,
  updateStock,
  toggleFeatured,
  getLowStockProducts
} from "../Controllers/ProductController.js";

import {
  uploadProductImages,
  uploadMixedFiles,
  handleMulterError
} from "../Middleware/Multer.js";

const router = express.Router();

// ==================== Public Routes ====================
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/colors", getColors);
router.get("/sizes", getSizes);
router.get("/low-stock", getLowStockProducts);
router.get("/:id", getProductById);

// ==================== Category Management ====================
router.put("/categories", updateCategories);
router.post("/categories", addCategory);
router.delete("/categories/:category", deleteCategory);
router.post("/categories/subcategory", addSubcategory);
router.delete("/categories/:category/subcategory/:subcategory", deleteSubcategory);

// ==================== Color & Size Management ====================
router.put("/colors", updateColors);
router.put("/sizes", updateSizes);

// ==================== Admin Routes ====================
router.post(
  "/",
  uploadProductImages.array('images', 20),
  handleMulterError,
  addProduct
);

router.put(
  "/:id",
  uploadProductImages.array('images', 20),
  handleMulterError,
  updateProduct
);

router.delete("/:id", deleteProduct);

// ==================== Bulk Operations ====================
router.post(
  "/bulk",
  uploadProductImages.array('images', 100),
  handleMulterError,
  addBulkProductsWithImages
);

router.post(
  "/bulk-excel",
  uploadMixedFiles,
  handleMulterError,
  uploadBulkProductsWithImages
);

// ==================== Stock & Featured Management ====================
router.patch("/:id/stock", updateStock);
router.patch("/:id/featured", toggleFeatured);

export default router;