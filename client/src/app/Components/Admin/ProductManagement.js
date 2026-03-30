// src/components/admin/ProductManagement.js
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaUpload, FaDownload, FaFileExcel,
  FaTimes, FaSave, FaImage, FaSearch, FaFilter, FaStar, FaEye,
  FaBoxes, FaTag, FaWeight, FaDollarSign, FaPercent, FaPalette,
  FaRulerCombined, FaInfoCircle, FaImages, FaCalendarAlt, FaChartBar,
  FaChevronDown, FaChevronUp, FaCheck, FaTshirt, FaChild, FaFemale
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { ProductApi } from '../../lib/ProductApi';

const ProductManagement = () => {
  // Hierarchical Categories State
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [productTypes, setProductTypes] = useState({});
  const [fabricTypes, setFabricTypes] = useState([]);
  
  // Colors & Sizes
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [customColors, setCustomColors] = useState([]);
const [colorsFullData, setColorsFullData] = useState([]);
const [sizesFullData, setSizesFullData] = useState([]);
const [newColorHex, setNewColorHex] = useState('#000000');
const [editingColor, setEditingColor] = useState(null);
const [editingSize, setEditingSize] = useState(null);
  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // UI States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showColorSizeModal, setShowColorSizeModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });
  
  // Form States
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    offerPercent: '',
    stock: '',
    weight: '',
    images: [],
    categoryId: '',
    subcategoryId: '',
    productTypeId: '',
    fabricTypeId: '',
    sizes: [],
    colors: [],
    customColors: [],
    isFeatured: false,
    rating: 0,
    gstPercent: 18
  });

  // Bulk Products State
  const [bulkProducts, setBulkProducts] = useState([createEmptyProduct()]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Category Management States
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newProductType, setNewProductType] = useState('');
  const [newFabricType, setNewFabricType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  const [editSubcategory, setEditSubcategory] = useState({ id: null, name: '', categoryId: '' });
  const [editProductType, setEditProductType] = useState({ id: null, name: '', subcategoryId: '' });
  const [editFabricType, setEditFabricType] = useState({ id: null, name: '' });

  // Color/Size Management States
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    productType: '',
    fabricType: '',
    minPrice: '',
    maxPrice: '',
    isFeatured: '',
    page: 1,
    limit: 10
  });

  function createEmptyProduct() {
    return {
      name: '',
      description: '',
      price: '',
      offerPercent: '',
      stock: '',
      weight: '',
      images: [],
      categoryId: '',
      subcategoryId: '',
      productTypeId: '',
      fabricTypeId: '',
      sizes: [],
      colors: [],
      customColors: [],
      isFeatured: false,
      rating: 0,
      gstPercent: 18
    };
  }

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Helper function to get hex code for common colors
const getColorHexCode = (colorName) => {
  const colorMap = {
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#00FF00',
    'black': '#000000',
    'white': '#FFFFFF',
    'yellow': '#FFFF00',
    'purple': '#800080',
    'orange': '#FFA500',
    'brown': '#A52A2A',
    'pink': '#FFC0CB',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'maroon': '#800000',
    'teal': '#008080',
    'olive': '#808000',
    'coral': '#FF7F50',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'beige': '#F5F5DC',
    'lavender': '#E6E6FA',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'indigo': '#4B0082',
    'violet': '#EE82EE'
  };
  
  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || '#CCCCCC';
};

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchSubcategories(),
        fetchProductTypes(),
        fetchFabricTypes(),
        fetchColors(),
        fetchSizes(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ProductApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await ProductApi.getAllSubcategories();
      const subcatMap = {};
      response.forEach(sub => {
        if (!subcatMap[sub.categoryId]) {
          subcatMap[sub.categoryId] = [];
        }
        subcatMap[sub.categoryId].push(sub);
      });
      setSubcategories(subcatMap);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const response = await ProductApi.getAllProductTypes();
      const typeMap = {};
      response.forEach(type => {
        if (!typeMap[type.subcategoryId]) {
          typeMap[type.subcategoryId] = [];
        }
        typeMap[type.subcategoryId].push(type);
      });
      setProductTypes(typeMap);
    } catch (error) {
      console.error('Error fetching product types:', error);
    }
  };

  const fetchFabricTypes = async () => {
    try {
      const response = await ProductApi.getFabricTypes();
      setFabricTypes(response);
    } catch (error) {
      console.error('Error fetching fabric types:', error);
    }
  };

  const fetchColors = async () => {
  try {
    const response = await ProductApi.getColors();
    setAvailableColors(response);
    
    // Also fetch full color details for hex codes
    const colorsFull = await ProductApi.getColorsFull();
    setColorsFullData(colorsFull);
  } catch (error) {
    console.error('Error fetching colors:', error);
  }
};

const fetchSizes = async () => {
  try {
    const response = await ProductApi.getSizes();
    setAvailableSizes(response);
    
    // Also fetch full size details
    const sizesFull = await ProductApi.getSizesFull();
    setSizesFullData(sizesFull);
  } catch (error) {
    console.error('Error fetching sizes:', error);
  }
};

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductApi.getProducts(filters);
      setProducts(response.products);
      setFilteredProducts(response.products);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
        limit: response.limit
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories[categoryId] || [];
  };

  // Get product types for selected subcategory
  const getProductTypesForSubcategory = (subcategoryId) => {
    return productTypes[subcategoryId] || [];
  };

  // Add custom color
  const addCustomColor = () => {
    if (customColorName.trim()) {
      setCustomColors([
        ...customColors,
        { name: customColorName, hexCode: customColorHex, images: [] }
      ]);
      setCustomColorName('');
      setCustomColorHex('#000000');
    }
  };

  const removeCustomColor = (index) => {
    setCustomColors(customColors.filter((_, i) => i !== index));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductForm({ ...productForm, images: [...productForm.images, ...files] });
  };

  const removeImage = (index) => {
    const updated = [...productForm.images];
    updated.splice(index, 1);
    setProductForm({ ...productForm, images: updated });
  };

  // Handle size selection
  const toggleSize = (size) => {
    const updatedSizes = productForm.sizes.includes(size)
      ? productForm.sizes.filter(s => s !== size)
      : [...productForm.sizes, size];
    setProductForm({ ...productForm, sizes: updatedSizes });
  };

  // Handle color selection
  const toggleColor = (color) => {
    const updatedColors = productForm.colors.includes(color)
      ? productForm.colors.filter(c => c !== color)
      : [...productForm.colors, color];
    setProductForm({ ...productForm, colors: updatedColors });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        weight: parseFloat(productForm.weight),
        offerPercent: parseFloat(productForm.offerPercent) || 0,
        gstPercent: parseFloat(productForm.gstPercent) || 18,
        customColors: customColors
      };
      
      formData.append('product', JSON.stringify(productData));
      
      productForm.images.forEach((image) => {
        formData.append('images', image);
      });

      customColors.forEach((color, index) => {
        color.images.forEach((img) => {
          formData.append('images', img);
        });
      });

      await ProductApi.createProduct(formData);
      alert('Product added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

 const resetForm = () => {
  setProductForm({
    name: '',
    description: '',
    price: '',
    offerPercent: '',
    stock: '',
    weight: '',
    images: [],
    existingImagesToDelete: [], // Add this line
    categoryId: '',
    subcategoryId: '',
    productTypeId: '',
    fabricTypeId: '',
    sizes: [],
    colors: [],
    customColors: [],
    isFeatured: false,
    rating: 0,
    gstPercent: 18
  });
  setCustomColors([]);
};

  // View product
  const openViewModal = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  // Edit product
  const openEditModal = (product) => {
  setEditingProduct(product);
  setProductForm({
    name: product.name,
    description: product.description || '',
    price: product.price,
    offerPercent: product.offerPercent || '',
    stock: product.stock,
    weight: product.weight,
    images: [],
    existingImagesToDelete: [], // Add this line
    categoryId: product.categoryId?._id || product.categoryId,
    subcategoryId: product.subcategoryId?._id || product.subcategoryId,
    productTypeId: product.productTypeId?._id || product.productTypeId,
    fabricTypeId: product.fabricTypeId?._id || product.fabricTypeId,
    sizes: product.sizes || [],
    colors: product.colors || [],
    customColors: product.customColors || [],
    isFeatured: product.isFeatured || false,
    rating: product.rating || 0,
    gstPercent: product.gstPercent || 18
  });
  setCustomColors(product.customColors || []);
  setShowEditModal(true);
};

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);

    try {
      const formData = new FormData();
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        weight: parseFloat(productForm.weight),
        offerPercent: parseFloat(productForm.offerPercent) || 0,
        gstPercent: parseFloat(productForm.gstPercent) || 18,
        customColors: customColors,
        existingImages: JSON.stringify(editingProduct.imageUrls || [])
      };
      
      formData.append('product', JSON.stringify(productData));
      
      productForm.images.forEach((image) => {
        formData.append('images', image);
      });

      customColors.forEach((color, index) => {
        color.images.forEach((img) => {
          formData.append('images', img);
        });
      });

      await ProductApi.updateProduct(editingProduct._id, formData);
      alert('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      await ProductApi.deleteProduct(productId);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Bulk product management
  const addBulkProductRow = () => {
    setBulkProducts([...bulkProducts, createEmptyProduct()]);
  };

  const removeBulkProductRow = (index) => {
    if (bulkProducts.length === 1) return;
    setBulkProducts(bulkProducts.filter((_, i) => i !== index));
  };

  const updateBulkProduct = (index, field, value) => {
    setBulkProducts(bulkProducts.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const handleBulkProductImage = (index, files) => {
    const fileArray = Array.from(files);
    setBulkProducts(bulkProducts.map((product, i) => 
      i === index ? { ...product, images: fileArray } : product
    ));
  };

  // Bulk products upload
  const addBulkProducts = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      const productsData = bulkProducts.map((product) => ({
        name: product.name,
        description: product.description || "",
        price: Number(product.price),
        stock: Number(product.stock),
        weight: Number(product.weight) || 0.5,
        category: categories.find(c => c._id === product.categoryId)?.name || '',
        subcategory: getSubcategoriesForCategory(product.categoryId).find(s => s._id === product.subcategoryId)?.name || '',
        productType: getProductTypesForSubcategory(product.subcategoryId).find(t => t._id === product.productTypeId)?.name || '',
        fabricType: fabricTypes.find(f => f._id === product.fabricTypeId)?.name || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        isFeatured: Boolean(product.isFeatured),
        rating: Number(product.rating) || 0,
        offerPercent: Number(product.offerPercent) || 0,
        gstPercent: Number(product.gstPercent) || 18,
        imageFilesCount: product.images?.length || 0
      }));

      formData.append("products", JSON.stringify(productsData));

      bulkProducts.forEach((p) => {
        if (p.images && p.images.length > 0) {
          for (let file of p.images) {
            formData.append("images", file);
          }
        }
      });

      await ProductApi.bulkAddProducts(formData);
      alert(`${bulkProducts.length} products added successfully!`);
      setBulkProducts([createEmptyProduct()]);
      setShowBulkModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Excel upload with images
  // In ProductManagement.js - handleExcelUpload function
const handleExcelUpload = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    
    // Find the excel file
    const excelFile = selectedFiles.find(
      (f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls") || f.name.endsWith(".csv")
    );
    
    if (!excelFile) {
      alert("Please select a valid Excel file");
      return;
    }
    
    // Append excel file
    formData.append("excelFile", excelFile);

    // Append all images
    const imageFiles = selectedFiles.filter((f) => f.type.startsWith("image/"));
    imageFiles.forEach((file) => {
      formData.append("productImages", file);
    });

    const response = await ProductApi.bulkExcelUpload(formData);

    if (response.created > 0) {
      alert(`✅ Uploaded ${response.created} products successfully`);
      if (response.errors && response.errors.length > 0) {
        console.warn('Partial errors:', response.errors);
        alert(`⚠️ ${response.errors.length} rows had issues. Check console for details.`);
      }
      fetchProducts();
      setShowBulkModal(false);
      setSelectedFiles([]);
    } else {
      alert(`❌ Upload failed: ${response.errors?.join(', ') || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Upload Excel error:", error);
    alert(`Upload failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Excel download template
  const downloadExcelTemplate = () => {
    const templateData = [
      {
        name: 'Sample Product',
        description: 'Product description',
        price: 99.99,
        offerPercent: 10,
        stock: 10,
        weight: 0.5,
        category: 'Men',
        subcategory: 'Topwear',
        productType: 'Shirts',
        fabricType: 'Cotton',
        sizes: 'S,M,L,XL',
        colors: 'Red,Blue,Black',
        isFeatured: 'true',
        gstPercent: 18,
        images: 'product1.jpg,product2.jpg'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const instructions = [
      ['INSTRUCTIONS FOR EXCEL UPLOAD:'],
      [''],
      ['1. Fill product data in the Products sheet'],
      ['2. Required fields: name, price, category, subcategory, productType'],
      ['3. Category options: Men, Women, Kids'],
      ['4. Subcategory for Men: Topwear, Bottomwear, Footwear, Accessories'],
      ['5. Subcategory for Women: Western, Ethnic, Footwear, Accessories'],
      ['6. Subcategory for Kids: Girls, Boys, Footwear, Accessories'],
      ['7. Product Types: Shirts, T-Shirts, Jeans, Dresses, Kurtas, etc.'],
      ['8. Fabric Types: Cotton, Linen, Silk, Wool, Denim, etc.'],
      ['9. Sizes column: Add comma-separated sizes (e.g., "S,M,L,XL")'],
      ['10. Colors column: Add comma-separated colors (e.g., "Red,Blue,Black")'],
      ['11. For featured products, set isFeatured to "true"'],
      ['12. Images column: Add comma-separated image filenames'],
      ['13. Upload images separately with matching filenames'],
      ['']
    ];

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');

    XLSX.writeFile(workbook, 'product_template.xlsx');
  };

  // File drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Category Management Functions
  const addCategory = async () => {
    if (newCategory.trim()) {
      try {
        await ProductApi.addCategory({ name: newCategory });
        setNewCategory('');
        fetchCategories();
        alert('Category added successfully!');
      } catch (error) {
        alert('Failed to add category: ' + error.message);
      }
    }
  };

  const deleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await ProductApi.deleteCategory(categoryId);
        fetchCategories();
        alert('Category deleted successfully!');
      } catch (error) {
        alert('Failed to delete category: ' + error.message);
      }
    }
  };

  const startEditCategory = (category) => {
    setEditCategory({ id: category._id, name: category.name });
  };

  const saveEditCategory = async () => {
    if (editCategory.name.trim()) {
      try {
        await ProductApi.updateCategory(editCategory.id, { name: editCategory.name });
        fetchCategories();
        setEditCategory({ id: null, name: '' });
        alert('Category updated successfully!');
      } catch (error) {
        alert('Failed to update category: ' + error.message);
      }
    }
  };

  // Subcategory Management Functions
  const addSubcategory = async () => {
    if (selectedCategory && newSubcategory.trim()) {
      try {
        await ProductApi.addSubcategory({ 
          name: newSubcategory, 
          categoryId: selectedCategory 
        });
        setNewSubcategory('');
        fetchSubcategories();
        alert('Subcategory added successfully!');
      } catch (error) {
        alert('Failed to add subcategory: ' + error.message);
      }
    }
  };

  const deleteSubcategory = async (subcategoryId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await ProductApi.deleteSubcategory(subcategoryId);
        fetchSubcategories();
        alert('Subcategory deleted successfully!');
      } catch (error) {
        alert('Failed to delete subcategory: ' + error.message);
      }
    }
  };

  const startEditSubcategory = (subcategory) => {
    setEditSubcategory({ 
      id: subcategory._id, 
      name: subcategory.name, 
      categoryId: subcategory.categoryId 
    });
  };

  const saveEditSubcategory = async () => {
    if (editSubcategory.name.trim()) {
      try {
        await ProductApi.updateSubcategory(editSubcategory.id, { name: editSubcategory.name });
        fetchSubcategories();
        setEditSubcategory({ id: null, name: '', categoryId: '' });
        alert('Subcategory updated successfully!');
      } catch (error) {
        alert('Failed to update subcategory: ' + error.message);
      }
    }
  };

  // Product Type Management Functions
  const addProductType = async () => {
    if (selectedSubcategory && newProductType.trim()) {
      try {
        await ProductApi.addProductType({ 
          name: newProductType, 
          subcategoryId: selectedSubcategory 
        });
        setNewProductType('');
        fetchProductTypes();
        alert('Product type added successfully!');
      } catch (error) {
        alert('Failed to add product type: ' + error.message);
      }
    }
  };

  const deleteProductType = async (productTypeId) => {
    if (window.confirm('Are you sure you want to delete this product type?')) {
      try {
        await ProductApi.deleteProductType(productTypeId);
        fetchProductTypes();
        alert('Product type deleted successfully!');
      } catch (error) {
        alert('Failed to delete product type: ' + error.message);
      }
    }
  };

  const startEditProductType = (productType) => {
    setEditProductType({ 
      id: productType._id, 
      name: productType.name, 
      subcategoryId: productType.subcategoryId 
    });
  };

  const saveEditProductType = async () => {
    if (editProductType.name.trim()) {
      try {
        await ProductApi.updateProductType(editProductType.id, { name: editProductType.name });
        fetchProductTypes();
        setEditProductType({ id: null, name: '', subcategoryId: '' });
        alert('Product type updated successfully!');
      } catch (error) {
        alert('Failed to update product type: ' + error.message);
      }
    }
  };

  // Fabric Type Management Functions
  const addFabricType = async () => {
    if (newFabricType.trim()) {
      try {
        await ProductApi.addFabricType({ name: newFabricType });
        setNewFabricType('');
        fetchFabricTypes();
        alert('Fabric type added successfully!');
      } catch (error) {
        alert('Failed to add fabric type: ' + error.message);
      }
    }
  };

  const deleteFabricType = async (fabricTypeId) => {
    if (window.confirm('Are you sure you want to delete this fabric type?')) {
      try {
        await ProductApi.deleteFabricType(fabricTypeId);
        fetchFabricTypes();
        alert('Fabric type deleted successfully!');
      } catch (error) {
        alert('Failed to delete fabric type: ' + error.message);
      }
    }
  };

  const startEditFabricType = (fabricType) => {
    setEditFabricType({ id: fabricType._id, name: fabricType.name });
  };

  const saveEditFabricType = async () => {
    if (editFabricType.name.trim()) {
      try {
        await ProductApi.updateFabricType(editFabricType.id, { name: editFabricType.name });
        fetchFabricTypes();
        setEditFabricType({ id: null, name: '' });
        alert('Fabric type updated successfully!');
      } catch (error) {
        alert('Failed to update fabric type: ' + error.message);
      }
    }
  };
// Color Management Functions
const addNewColor = async () => {
  if (newColor && !availableColors.includes(newColor)) {
    try {
      await ProductApi.addColor({ name: newColor, hexCode: newColorHex });
      await fetchColors(); // Refresh colors
      setNewColor('');
      setNewColorHex('#000000');
      alert('Color added successfully!');
    } catch (error) {
      alert('Failed to add color: ' + error.message);
    }
  }
};

const deleteColor = async (colorId) => {
  if (window.confirm('Are you sure you want to delete this color?')) {
    try {
      await ProductApi.deleteColor(colorId);
      await fetchColors(); // Refresh colors
      alert('Color deleted successfully!');
    } catch (error) {
      alert('Failed to delete color: ' + error.message);
    }
  }
};

const startEditColor = (name, hexCode, id) => {
  setEditingColor({ name, hexCode, id });
};

const saveEditColor = async () => {
  if (editingColor.name.trim()) {
    try {
      await ProductApi.updateColor(editingColor.id, { 
        name: editingColor.name, 
        hexCode: editingColor.hexCode 
      });
      await fetchColors(); // Refresh colors
      setEditingColor(null);
      alert('Color updated successfully!');
    } catch (error) {
      alert('Failed to update color: ' + error.message);
    }
  }
};

// Size Management Functions
const addNewSize = async () => {
  if (newSize && !availableSizes.includes(newSize)) {
    try {
      await ProductApi.addSize({ name: newSize });
      await fetchSizes(); // Refresh sizes
      setNewSize('');
      alert('Size added successfully!');
    } catch (error) {
      alert('Failed to add size: ' + error.message);
    }
  }
};

const deleteSize = async (sizeId) => {
  if (window.confirm('Are you sure you want to delete this size?')) {
    try {
      await ProductApi.deleteSize(sizeId);
      await fetchSizes(); // Refresh sizes
      alert('Size deleted successfully!');
    } catch (error) {
      alert('Failed to delete size: ' + error.message);
    }
  }
};

const startEditSize = (name, id) => {
  setEditingSize({ name, id });
};

const saveEditSize = async () => {
  if (editingSize.name.trim()) {
    try {
      await ProductApi.updateSize(editingSize.id, { name: editingSize.name });
      await fetchSizes(); // Refresh sizes
      setEditingSize(null);
      alert('Size updated successfully!');
    } catch (error) {
      alert('Failed to update size: ' + error.message);
    }
  }
};
  // Color Management Functions
  

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      productType: '',
      fabricType: '',
      minPrice: '',
      maxPrice: '',
      isFeatured: '',
      page: 1,
      limit: 10
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get category icon
  const getCategoryIcon = (categoryName) => {
    switch(categoryName?.toLowerCase()) {
      case 'men':
        return <FaTshirt className="text-blue-600" />;
      case 'women':
        return <FaFemale className="text-pink-500" />;
      case 'kids':
        return <FaChild className="text-green-500" />;
      default:
        return <FaTag className="text-[#8A9B6E]" />;
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A4D3E]">Product Management</h1>
          <p className="text-[#8A9B6E] mt-1">Manage your product inventory</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-[#F5F9F0] text-[#1A4D3E] px-4 py-2 rounded-xl font-semibold border border-[#D0E0C0]">
            {pagination.totalCount} Products
          </span>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColorSizeModal(true)}
            className="bg-[#1A4D3E] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaPalette />
            <span>Colors & Sizes</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryModal(true)}
            className="bg-[#1A4D3E] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaTag />
            <span>Categories</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBulkModal(true)}
            className="bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaUpload />
            <span>Bulk Upload</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#FFB347] to-[#FF8C42] text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <FaPlus />
            <span>Add Product</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#D0E0C0]">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-[#8A9B6E]" />
          <h3 className="font-semibold text-[#1A4D3E]">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A9B6E]" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: '', productType: '', page: 1 })}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({ ...filters, subcategory: e.target.value, productType: '', page: 1 })}
              disabled={!filters.category}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
            >
              <option value="">All Subcategories</option>
              {filters.category && getSubcategoriesForCategory(filters.category).map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filters.productType}
              onChange={(e) => setFilters({ ...filters, productType: e.target.value, page: 1 })}
              disabled={!filters.subcategory}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
            >
              <option value="">All Product Types</option>
              {filters.subcategory && getProductTypesForSubcategory(filters.subcategory).map(type => (
                <option key={type._id} value={type._id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filters.fabricType}
              onChange={(e) => setFilters({ ...filters, fabricType: e.target.value, page: 1 })}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
            >
              <option value="">All Fabrics</option>
              {fabricTypes.map(fabric => (
                <option key={fabric._id} value={fabric._id}>{fabric.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
            />
          </div>
          
          <div>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
            />
          </div>
        </div>
        
        {(filters.search || filters.category || filters.subcategory || filters.productType || filters.fabricType || filters.minPrice || filters.maxPrice) && (
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="text-sm text-[#8A9B6E] hover:text-[#1A4D3E]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-[#D0E0C0] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A]"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F9F0] border-b border-[#D0E0C0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Product Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Fabric</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E8D0]">
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#F5F9F0] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#8BC34A] to-[#5A9E4E] rounded-xl flex items-center justify-center text-white font-bold overflow-hidden">
                            {product.imageUrls?.[0] ? (
                              <img
                                src={product.imageUrls[0].startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API}${product.imageUrls[0]}` : product.imageUrls[0]}
                                className="w-full h-full rounded-xl object-cover"
                                alt={product.name}
                              />
                            ) : (
                              <FaImage className="text-white text-xl" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1A4D3E]">{product.name}</p>
                            <p className="text-xs text-[#8A9B6E] line-clamp-1">{product.description?.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(product.category)}
                          <div>
                            <p className="text-[#1A4D3E]">{product.category}</p>
                            <p className="text-xs text-[#8A9B6E]">{product.subcategory}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#1A4D3E]">{product.productType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#F5F9F0] text-xs rounded-full">
                          {product.fabricType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#1A4D3E]">₹{product.price}</p>
                        {product.offerPercent > 0 && (
                          <p className="text-xs text-green-600">-{product.offerPercent}% OFF</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          product.stock > 20 ? 'bg-green-100 text-green-600' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-[#8BC34A] hover:bg-[#F5F9F0] rounded-xl transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => openViewModal(product)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <FaBoxes className="text-4xl text-[#8A9B6E] mx-auto mb-3" />
                <p className="text-[#1A4D3E] font-semibold">No products found</p>
                <p className="text-sm text-[#8A9B6E] mt-1">Try adjusting your filters</p>
              </div>
            )}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 py-4 bg-[#F5F9F0] border-t border-[#D0E0C0]">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="px-4 py-2 rounded-xl bg-[#1A4D3E] text-white disabled:opacity-40 text-sm"
                >
                  Prev
                </button>
                
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg border text-sm ${
                        pagination.currentPage === pageNum
                          ? "bg-[#8BC34A] text-white border-[#5A9E4E]"
                          : "text-[#1A4D3E] border-[#D0E0C0]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="px-4 py-2 rounded-xl bg-[#1A4D3E] text-white disabled:opacity-40 text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1A4D3E]">Add New Product</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
                  >
                    <FaTimes className="text-[#8A9B6E]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={productForm.categoryId}
                      onChange={(e) => {
                        setProductForm({ 
                          ...productForm, 
                          categoryId: e.target.value, 
                          subcategoryId: '',
                          productTypeId: '' 
                        });
                      }}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Subcategory *
                    </label>
                    <select
                      required
                      value={productForm.subcategoryId}
                      onChange={(e) => {
                        setProductForm({ 
                          ...productForm, 
                          subcategoryId: e.target.value,
                          productTypeId: '' 
                        });
                      }}
                      disabled={!productForm.categoryId}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
                    >
                      <option value="">Select Subcategory</option>
                      {productForm.categoryId && getSubcategoriesForCategory(productForm.categoryId).map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Product Type *
                    </label>
                    <select
                      required
                      value={productForm.productTypeId}
                      onChange={(e) => setProductForm({ ...productForm, productTypeId: e.target.value })}
                      disabled={!productForm.subcategoryId}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
                    >
                      <option value="">Select Product Type</option>
                      {productForm.subcategoryId && getProductTypesForSubcategory(productForm.subcategoryId).map(type => (
                        <option key={type._id} value={type._id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Fabric Type
                    </label>
                    <select
                      value={productForm.fabricTypeId}
                      onChange={(e) => setProductForm({ ...productForm, fabricTypeId: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    >
                      <option value="">Select Fabric Type</option>
                      {fabricTypes.map(fabric => (
                        <option key={fabric._id} value={fabric._id}>{fabric.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Offer Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={productForm.offerPercent}
                      onChange={(e) => setProductForm({ ...productForm, offerPercent: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.weight}
                      onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      placeholder="0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      GST (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="28"
                      value={productForm.gstPercent}
                      onChange={(e) => setProductForm({ ...productForm, gstPercent: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      placeholder="18"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[#1A4D3E] font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    placeholder="Product description"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-[#1A4D3E] font-semibold mb-3">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all ${
                          productForm.sizes.includes(size)
                            ? 'bg-[#8BC34A] border-[#5A9E4E] text-white'
                            : 'bg-white border-[#D0E0C0] text-[#1A4D3E] hover:border-[#8BC34A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-[#1A4D3E] font-semibold mb-3">
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all ${
                          productForm.colors.includes(color)
                            ? 'bg-[#8BC34A] border-[#5A9E4E] text-white'
                            : 'bg-white border-[#D0E0C0] text-[#1A4D3E] hover:border-[#8BC34A]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[#1A4D3E] font-semibold">
                      Custom Colors
                    </label>
                    <button
                      type="button"
                      onClick={addCustomColor}
                      className="px-3 py-1.5 bg-[#8BC34A] text-white rounded-xl text-sm flex items-center gap-1 hover:bg-[#5A9E4E] transition-colors"
                    >
                      <FaPlus size={12} /> Add Custom Color
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {customColors.map((color, index) => (
                      <div key={index} className="border border-[#D0E0C0] rounded-xl p-4 bg-[#F5F9F0]">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={color.name}
                              onChange={(e) => {
                                const updated = [...customColors];
                                updated[index].name = e.target.value;
                                setCustomColors(updated);
                              }}
                              placeholder="Color name (e.g., Ocean Blue)"
                              className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={color.hexCode}
                              onChange={(e) => {
                                const updated = [...customColors];
                                updated[index].hexCode = e.target.value;
                                setCustomColors(updated);
                              }}
                              className="w-10 h-10 rounded-lg border border-[#D0E0C0] cursor-pointer"
                            />
                            <span className="text-sm text-[#8A9B6E]">{color.hexCode}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomColor(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        
                        {/* Custom Color Images */}
                        <div>
                          <label className="block text-[#1A4D3E] text-sm font-semibold mb-2">
                            Images for {color.name || 'this color'}
                          </label>
                          <div className="border-2 border-dashed border-[#D0E0C0] rounded-xl p-3 text-center bg-white">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const updated = [...customColors];
                                updated[index].images = [...updated[index].images, ...files];
                                setCustomColors(updated);
                              }}
                              className="hidden"
                              id={`custom-color-images-${index}`}
                            />
                            <label
                              htmlFor={`custom-color-images-${index}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <FaImage className="text-2xl text-[#8A9B6E] mb-1" />
                              <span className="text-sm text-[#8A9B6E]">Upload images</span>
                            </label>
                          </div>
                          {color.images?.length > 0 && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {color.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                  {img instanceof File ? (
                                    <img
                                      src={URL.createObjectURL(img)}
                                      alt={`${color.name} ${imgIndex + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <FaImage className="text-gray-400" />
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...customColors];
                                      updated[index].images = updated[index].images.filter((_, i) => i !== imgIndex);
                                      setCustomColors(updated);
                                    }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-xs"
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Product Images */}
                <div>
                  <label className="block text-[#1A4D3E] font-semibold mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
                    <FaImage className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
                    <p className="text-[#1A4D3E] mb-3">Drag & drop images or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="product-images"
                    />
                    <label
                      htmlFor="product-images"
                      className="inline-block bg-[#8BC34A] text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-[#5A9E4E] transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                  
                  {productForm.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {productForm.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-[#F5F9F0] rounded-xl border border-[#D0E0C0] flex items-center justify-center overflow-hidden">
                            {img instanceof File ? (
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaImage className="text-2xl text-[#8A9B6E]" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-5 h-5 text-[#8BC34A] bg-white border-[#D0E0C0] rounded focus:ring-[#8BC34A]"
                  />
                  <label htmlFor="isFeatured" className="text-[#1A4D3E] font-semibold">
                    Feature this product
                  </label>
                </div>

                {/* Form Actions */}
                <div className="sticky bottom-0 bg-white pt-4 border-t border-[#D0E0C0] flex flex-col md:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Product Modal */}
      <AnimatePresence>
        {showViewModal && viewingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1A4D3E] flex items-center gap-2">
                    <FaInfoCircle className="text-[#8BC34A]" />
                    Product Details
                  </h3>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setViewingProduct(null);
                    }}
                    className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
                  >
                    <FaTimes className="text-[#8A9B6E]" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div>
                    <h4 className="font-semibold text-[#1A4D3E] mb-3">Product Images</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {viewingProduct.imageUrls && viewingProduct.imageUrls.length > 0 ? (
                        viewingProduct.imageUrls.map((url, index) => (
                          <div key={index} className="aspect-square rounded-xl overflow-hidden border border-[#D0E0C0]">
                            <img
                              src={url.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API}${url}` : url}
                              alt={`${viewingProduct.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 aspect-square bg-[#F5F9F0] rounded-xl flex items-center justify-center">
                          <FaImages className="text-4xl text-[#8A9B6E]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#1A4D3E]">{viewingProduct.name}</h2>
                      <p className="text-[#8A9B6E] mt-1">{viewingProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Original Price</p>
                        <p className="text-lg font-semibold text-[#1A4D3E]">₹{viewingProduct.price}</p>
                      </div>
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Discounted Price</p>
                        <p className="text-lg font-semibold text-[#FF8C42]">₹{viewingProduct.discountedPrice || viewingProduct.price}</p>
                      </div>
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Stock</p>
                        <p className={`text-lg font-semibold ${viewingProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {viewingProduct.stock} units
                        </p>
                      </div>
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Weight</p>
                        <p className="text-lg font-semibold text-[#1A4D3E]">{viewingProduct.weight} kg</p>
                      </div>
                    </div>

                    <div className="border-t border-[#D0E0C0] pt-4">
                      <h4 className="font-semibold text-[#1A4D3E] mb-2">Category Details</h4>
                      <div className="space-y-1">
                        <p className="text-[#5A7A4C]"><span className="font-medium">Category:</span> {viewingProduct.category}</p>
                        <p className="text-[#5A7A4C]"><span className="font-medium">Subcategory:</span> {viewingProduct.subcategory}</p>
                        <p className="text-[#5A7A4C]"><span className="font-medium">Product Type:</span> {viewingProduct.productType}</p>
                        {viewingProduct.fabricType && (
                          <p className="text-[#5A7A4C]"><span className="font-medium">Fabric Type:</span> {viewingProduct.fabricType}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-[#D0E0C0] pt-4">
                      <h4 className="font-semibold text-[#1A4D3E] mb-2">Available Sizes</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingProduct.sizes && viewingProduct.sizes.length > 0 ? (
                          viewingProduct.sizes.map(size => (
                            <span key={size} className="px-3 py-1 bg-[#F5F9F0] rounded-lg text-sm text-[#1A4D3E]">
                              {size}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#8A9B6E]">No sizes specified</span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-[#D0E0C0] pt-4">
                      <h4 className="font-semibold text-[#1A4D3E] mb-2">Available Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingProduct.colors && viewingProduct.colors.length > 0 ? (
                          viewingProduct.colors.map(color => (
                            <span key={color} className="px-3 py-1 bg-[#F5F9F0] rounded-lg text-sm text-[#1A4D3E]">
                              {color}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#8A9B6E]">No colors specified</span>
                        )}
                      </div>
                    </div>

                    {viewingProduct.isFeatured && (
                      <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                        <p className="text-purple-600 font-semibold flex items-center gap-2">
                          <FaStar /> This product is featured on the homepage
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#D0E0C0]">
                  <button
                    onClick={() => openEditModal(viewingProduct)}
                    className="px-6 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors flex items-center gap-2"
                  >
                    <FaEdit />
                    Edit Product
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setViewingProduct(null);
                    }}
                    className="px-6 py-2 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal - Similar structure to Add Product but with existing values */}
      {/* ... (similar to Add Product Modal with pre-filled values) */}
{/* Edit Product Modal */}
<AnimatePresence>
  {showEditModal && editingProduct && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#1A4D3E]">Edit Product</h3>
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
            >
              <FaTimes className="text-[#8A9B6E]" />
            </button>
          </div>
        </div>

        <form onSubmit={updateProduct} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Category *
              </label>
              <select
                required
                value={productForm.categoryId}
                onChange={(e) => {
                  setProductForm({ 
                    ...productForm, 
                    categoryId: e.target.value, 
                    subcategoryId: '',
                    productTypeId: '' 
                  });
                }}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Subcategory *
              </label>
              <select
                required
                value={productForm.subcategoryId}
                onChange={(e) => {
                  setProductForm({ 
                    ...productForm, 
                    subcategoryId: e.target.value,
                    productTypeId: '' 
                  });
                }}
                disabled={!productForm.categoryId}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
              >
                <option value="">Select Subcategory</option>
                {productForm.categoryId && getSubcategoriesForCategory(productForm.categoryId).map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Product Type *
              </label>
              <select
                required
                value={productForm.productTypeId}
                onChange={(e) => setProductForm({ ...productForm, productTypeId: e.target.value })}
                disabled={!productForm.subcategoryId}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
              >
                <option value="">Select Product Type</option>
                {productForm.subcategoryId && getProductTypesForSubcategory(productForm.subcategoryId).map(type => (
                  <option key={type._id} value={type._id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Fabric Type
              </label>
              <select
                value={productForm.fabricTypeId}
                onChange={(e) => setProductForm({ ...productForm, fabricTypeId: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              >
                <option value="">Select Fabric Type</option>
                {fabricTypes.map(fabric => (
                  <option key={fabric._id} value={fabric._id}>{fabric.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Offer Percentage (%)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={productForm.offerPercent}
                onChange={(e) => setProductForm({ ...productForm, offerPercent: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={productForm.weight}
                onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                placeholder="0.5"
              />
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                GST (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={productForm.gstPercent}
                onChange={(e) => setProductForm({ ...productForm, gstPercent: e.target.value })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                placeholder="18"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#1A4D3E] font-semibold mb-2">
              Description
            </label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              placeholder="Product description"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-[#1A4D3E] font-semibold mb-3">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    productForm.sizes.includes(size)
                      ? 'bg-[#8BC34A] border-[#5A9E4E] text-white'
                      : 'bg-white border-[#D0E0C0] text-[#1A4D3E] hover:border-[#8BC34A]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-[#1A4D3E] font-semibold mb-3">
              Available Colors
            </label>
            <div className="flex flex-wrap gap-3">
              {availableColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleColor(color)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${
                    productForm.colors.includes(color)
                      ? 'bg-[#8BC34A] border-[#5A9E4E] text-white'
                      : 'bg-white border-[#D0E0C0] text-[#1A4D3E] hover:border-[#8BC34A]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[#1A4D3E] font-semibold">
                Custom Colors
              </label>
              <button
                type="button"
                onClick={addCustomColor}
                className="px-3 py-1.5 bg-[#8BC34A] text-white rounded-xl text-sm flex items-center gap-1 hover:bg-[#5A9E4E] transition-colors"
              >
                <FaPlus size={12} /> Add Custom Color
              </button>
            </div>
            
            <div className="space-y-3">
              {customColors.map((color, index) => (
                <div key={index} className="border border-[#D0E0C0] rounded-xl p-4 bg-[#F5F9F0]">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => {
                          const updated = [...customColors];
                          updated[index].name = e.target.value;
                          setCustomColors(updated);
                        }}
                        placeholder="Color name (e.g., Ocean Blue)"
                        className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.hexCode}
                        onChange={(e) => {
                          const updated = [...customColors];
                          updated[index].hexCode = e.target.value;
                          setCustomColors(updated);
                        }}
                        className="w-10 h-10 rounded-lg border border-[#D0E0C0] cursor-pointer"
                      />
                      <span className="text-sm text-[#8A9B6E]">{color.hexCode}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomColor(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  {/* Custom Color Images */}
                  <div>
                    <label className="block text-[#1A4D3E] text-sm font-semibold mb-2">
                      Images for {color.name || 'this color'}
                    </label>
                    <div className="border-2 border-dashed border-[#D0E0C0] rounded-xl p-3 text-center bg-white">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          const updated = [...customColors];
                          updated[index].images = [...updated[index].images, ...files];
                          setCustomColors(updated);
                        }}
                        className="hidden"
                        id={`edit-custom-color-images-${index}`}
                      />
                      <label
                        htmlFor={`edit-custom-color-images-${index}`}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FaImage className="text-2xl text-[#8A9B6E] mb-1" />
                        <span className="text-sm text-[#8A9B6E]">Upload new images</span>
                      </label>
                    </div>
                    {color.images?.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {color.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            {img instanceof File ? (
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`${color.name} ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaImage className="text-gray-400" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...customColors];
                                updated[index].images = updated[index].images.filter((_, i) => i !== imgIndex);
                                setCustomColors(updated);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-xs"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Images Display */}
          {editingProduct.imageUrls && editingProduct.imageUrls.length > 0 && (
            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Existing Images
              </label>
              <div className="grid grid-cols-4 gap-3">
                {editingProduct.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-[#F5F9F0] rounded-xl border border-[#D0E0C0] overflow-hidden">
                      <img
                        src={url.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API}${url}` : url}
                        alt={`Existing product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Mark image for deletion
                        const updatedProduct = { ...productForm };
                        updatedProduct.existingImagesToDelete = updatedProduct.existingImagesToDelete || [];
                        updatedProduct.existingImagesToDelete.push(url);
                        setProductForm(updatedProduct);
                        
                        // Remove from display
                        editingProduct.imageUrls.splice(index, 1);
                        setEditingProduct({ ...editingProduct });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Product Images */}
          <div>
            <label className="block text-[#1A4D3E] font-semibold mb-2">
              Add New Images
            </label>
            <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
              <FaImage className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
              <p className="text-[#1A4D3E] mb-3">Drag & drop images or click to browse</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="edit-product-images"
              />
              <label
                htmlFor="edit-product-images"
                className="inline-block bg-[#8BC34A] text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-[#5A9E4E] transition-colors"
              >
                Browse Files
              </label>
            </div>
            
            {productForm.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {productForm.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-[#F5F9F0] rounded-xl border border-[#D0E0C0] flex items-center justify-center overflow-hidden">
                      {img instanceof File ? (
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaImage className="text-2xl text-[#8A9B6E]" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="edit-isFeatured"
              checked={productForm.isFeatured}
              onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
              className="w-5 h-5 text-[#8BC34A] bg-white border-[#D0E0C0] rounded focus:ring-[#8BC34A]"
            />
            <label htmlFor="edit-isFeatured" className="text-[#1A4D3E] font-semibold">
              Feature this product
            </label>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white pt-4 border-t border-[#D0E0C0] flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="flex-1 px-6 py-3 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>
      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1A4D3E]">Bulk Product Upload</h3>
                  <button
                    onClick={() => {
                      setShowBulkModal(false);
                      setBulkProducts([createEmptyProduct()]);
                      setSelectedFiles([]);
                    }}
                    className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
                  >
                    <FaTimes className="text-[#8A9B6E]" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                      activeTab === 'manual'
                        ? 'bg-[#8BC34A] text-white'
                        : 'bg-[#F5F9F0] text-[#1A4D3E]'
                    }`}
                  >
                    Manual Entry
                  </button>
                  <button
                    onClick={() => setActiveTab('excel')}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                      activeTab === 'excel'
                        ? 'bg-[#8BC34A] text-white'
                        : 'bg-[#F5F9F0] text-[#1A4D3E]'
                    }`}
                  >
                    Excel/CSV Upload
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'manual' ? (
                  <form onSubmit={addBulkProducts} className="space-y-6">
                    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                      {bulkProducts.map((product, index) => (
                        <div
                          key={index}
                          className="bg-[#F5F9F0] rounded-2xl p-6 border-2 border-[#D0E0C0]"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-[#1A4D3E]">
                              Product {index + 1}
                            </h4>
                            {bulkProducts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBulkProductRow(index)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={product.name}
                                onChange={(e) => updateBulkProduct(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Category *
                              </label>
                              <select
                                required
                                value={product.categoryId}
                                onChange={(e) => {
                                  updateBulkProduct(index, 'categoryId', e.target.value);
                                  updateBulkProduct(index, 'subcategoryId', '');
                                  updateBulkProduct(index, 'productTypeId', '');
                                }}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              >
                                <option value="">Select</option>
                                {categories.map(cat => (
                                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Subcategory *
                              </label>
                              <select
                                required
                                value={product.subcategoryId}
                                onChange={(e) => {
                                  updateBulkProduct(index, 'subcategoryId', e.target.value);
                                  updateBulkProduct(index, 'productTypeId', '');
                                }}
                                disabled={!product.categoryId}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm disabled:opacity-50"
                              >
                                <option value="">Select</option>
                                {product.categoryId && getSubcategoriesForCategory(product.categoryId).map(sub => (
                                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Product Type *
                              </label>
                              <select
                                required
                                value={product.productTypeId}
                                onChange={(e) => updateBulkProduct(index, 'productTypeId', e.target.value)}
                                disabled={!product.subcategoryId}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm disabled:opacity-50"
                              >
                                <option value="">Select</option>
                                {product.subcategoryId && getProductTypesForSubcategory(product.subcategoryId).map(type => (
                                  <option key={type._id} value={type._id}>{type.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Fabric Type
                              </label>
                              <select
                                value={product.fabricTypeId}
                                onChange={(e) => updateBulkProduct(index, 'fabricTypeId', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              >
                                <option value="">Select</option>
                                {fabricTypes.map(fabric => (
                                  <option key={fabric._id} value={fabric._id}>{fabric.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Price (₹) *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                required
                                value={product.price}
                                onChange={(e) => updateBulkProduct(index, 'price', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Offer %
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={product.offerPercent}
                                onChange={(e) => updateBulkProduct(index, 'offerPercent', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Stock *
                              </label>
                              <input
                                type="number"
                                required
                                min="0"
                                value={product.stock}
                                onChange={(e) => updateBulkProduct(index, 'stock', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Weight (kg)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={product.weight}
                                onChange={(e) => updateBulkProduct(index, 'weight', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                GST (%)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="28"
                                value={product.gstPercent}
                                onChange={(e) => updateBulkProduct(index, 'gstPercent', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div className="col-span-3">
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Sizes (comma separated)
                              </label>
                              <input
                                type="text"
                                value={product.sizes?.join(', ') || ''}
                                onChange={(e) => updateBulkProduct(index, 'sizes', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                                placeholder="S, M, L, XL"
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div className="col-span-3">
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Colors (comma separated)
                              </label>
                              <input
                                type="text"
                                value={product.colors?.join(', ') || ''}
                                onChange={(e) => updateBulkProduct(index, 'colors', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                                placeholder="Red, Blue, Black"
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div className="col-span-3">
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Description
                              </label>
                              <textarea
                                value={product.description}
                                onChange={(e) => updateBulkProduct(index, 'description', e.target.value)}
                                rows="2"
                                className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                              />
                            </div>

                            <div className="col-span-3">
                              <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                                Images
                              </label>
                              <div className="border-2 border-dashed border-[#D0E0C0] rounded-xl p-3 text-center bg-white">
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleBulkProductImage(index, e.target.files)}
                                  className="hidden"
                                  id={`bulk-product-images-${index}`}
                                />
                                <label
                                  htmlFor={`bulk-product-images-${index}`}
                                  className="cursor-pointer flex flex-col items-center"
                                >
                                  <FaUpload className="text-xl text-[#8A9B6E] mb-1" />
                                  <span className="text-sm text-[#8A9B6E]">Choose images</span>
                                </label>
                              </div>
                              {product.images?.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-green-600">{product.images.length} file(s) selected</p>
                                </div>
                              )}
                            </div>

                            <div className="col-span-3">
                              <div className="flex items-center gap-3 mt-2">
                                <input
                                  type="checkbox"
                                  id={`bulk-isFeatured-${index}`}
                                  checked={product.isFeatured || false}
                                  onChange={(e) => updateBulkProduct(index, 'isFeatured', e.target.checked)}
                                  className="w-4 h-4 text-[#8BC34A] bg-white border-gray-300 rounded focus:ring-[#8BC34A]"
                                />
                                <label htmlFor={`bulk-isFeatured-${index}`} className="text-[#1A4D3E] text-sm">
                                  Feature this product
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addBulkProductRow}
                      className="w-full border-2 border-dashed border-[#D0E0C0] text-[#1A4D3E] py-4 rounded-2xl hover:bg-[#F5F9F0] transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPlus />
                      Add Another Product
                    </button>

                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBulkModal(false);
                          setBulkProducts([createEmptyProduct()]);
                          setSelectedFiles([]);
                        }}
                        className="flex-1 px-6 py-3 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : (
                          `Add ${bulkProducts.length} Product${bulkProducts.length > 1 ? 's' : ''}`
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-[#F5F9F0] rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-[#1A4D3E] mb-4 flex items-center gap-2">
                        <FaFileExcel className="text-green-600" />
                        Upload Excel File with Images
                      </h4>

                      <div
                        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                          dragActive
                            ? 'border-[#8BC34A] bg-white'
                            : 'border-[#D0E0C0] bg-white'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <FaFileExcel className="text-4xl text-green-600 mx-auto mb-2" />
                        <FaImage className="text-3xl text-blue-600 mx-auto mb-3" />
                        <p className="text-[#1A4D3E] mb-2 font-semibold">
                          Drag & drop Excel file + Product Images
                        </p>
                        <p className="text-sm text-[#8A9B6E] mb-3">
                          Upload Excel file along with product images. Image names in Excel should match uploaded files.
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".xlsx,.xls,.csv,image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setSelectedFiles([...selectedFiles, ...files]);
                          }}
                          className="hidden"
                          id="excel-images-files"
                        />
                        <label
                          htmlFor="excel-images-files"
                          className="inline-block bg-green-600 text-white px-6 py-3 rounded-2xl cursor-pointer hover:bg-green-700 transition-colors"
                        >
                          Choose Excel & Image Files
                        </label>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-[#1A4D3E] font-semibold mb-2">
                            Selected Files:
                          </h5>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white p-2 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  {file.type.startsWith("image/") ? (
                                    <FaImage className="text-blue-500" />
                                  ) : (
                                    <FaFileExcel className="text-green-500" />
                                  )}
                                  <span className="text-sm text-[#1A4D3E]">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-[#8A9B6E]">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-[#8A9B6E] mt-2">
                            Excel files:{" "}
                            {
                              selectedFiles.filter(
                                (f) =>
                                  f.name.endsWith(".xlsx") ||
                                  f.name.endsWith(".xls") ||
                                  f.name.endsWith(".csv")
                              ).length
                            }{" "}
                            | Images:{" "}
                            {
                              selectedFiles.filter((f) =>
                                f.type.startsWith("image/")
                              ).length
                            }
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <button
                          onClick={downloadExcelTemplate}
                          className="bg-[#1A4D3E] text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#0F3A2E] transition-colors"
                        >
                          <FaDownload />
                          Download Template
                        </button>

                        <button
                          onClick={handleExcelUpload}
                          disabled={
                            loading ||
                            !selectedFiles.find(
                              (f) =>
                                f.name.endsWith(".xlsx") ||
                                f.name.endsWith(".xls") ||
                                f.name.endsWith(".csv")
                            )
                          }
                          className="bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white py-3 rounded-2xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <FaUpload />
                              Upload Excel & Images
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2">Excel Upload Instructions:</h5>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>First column headers must match the template exactly</li>
                        <li>Required columns: name, price, category, subcategory, productType</li>
                        <li>Category options: Men, Women, Kids</li>
                        <li>Subcategory for Men: Topwear, Bottomwear, Footwear, Accessories</li>
                        <li>Subcategory for Women: Western, Ethnic, Footwear, Accessories</li>
                        <li>Subcategory for Kids: Girls, Boys, Footwear, Accessories</li>
                        <li>Product Types: Shirts, T-Shirts, Jeans, Dresses, Kurtas, etc.</li>
                        <li>Fabric Types: Cotton, Linen, Silk, Wool, Denim, etc.</li>
                        <li>Sizes should be comma-separated (e.g., "S,M,L,XL")</li>
                        <li>Colors should be comma-separated (e.g., "Red,Blue,Black")</li>
                        <li>Images column: Add comma-separated image filenames</li>
                        <li>Upload images with matching filenames along with Excel file</li>
                        <li>Set isFeatured to "true" for featured products</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1A4D3E]">Category Management</h3>
                  <button
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditCategory({ id: null, name: '' });
                      setEditSubcategory({ id: null, name: '', categoryId: '' });
                      setEditProductType({ id: null, name: '', subcategoryId: '' });
                      setEditFabricType({ id: null, name: '' });
                    }}
                    className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
                  >
                    <FaTimes className="text-[#8A9B6E]" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Main Categories Section */}
                <div className="bg-[#F5F9F0] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1A4D3E] mb-3 flex items-center gap-2">
                    <FaTag /> Main Categories (Men, Women, Kids)
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Category name (e.g., Men)"
                      className="flex-1 px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    />
                    <button
                      onClick={addCategory}
                      disabled={!newCategory}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div key={category._id} className="bg-white rounded-xl p-3 border border-[#D0E0C0]">
                        {editCategory.id === category._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editCategory.name}
                              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                              className="flex-1 px-2 py-1 border border-[#D0E0C0] rounded-lg text-sm"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && saveEditCategory()}
                            />
                            <button
                              onClick={saveEditCategory}
                              className="p-1 bg-green-500 text-white rounded-lg"
                            >
                              <FaSave size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(category.name)}
                              <span className="font-medium text-[#1A4D3E]">{category.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditCategory(category)}
                                className="p-1 text-[#8BC34A] hover:bg-[#F5F9F0] rounded"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => deleteCategory(category._id)}
                                className="p-1 text-red-500 hover:bg-[#F5F9F0] rounded"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subcategories Section */}
                <div className="bg-[#F5F9F0] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1A4D3E] mb-3">Subcategories</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      placeholder="Subcategory name"
                      className="px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
                    />
                    <button
                      onClick={addSubcategory}
                      disabled={!selectedCategory || !newSubcategory}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50"
                    >
                      Add Subcategory
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedCategory && subcategories[selectedCategory]?.map((sub) => (
                      <div key={sub._id} className="bg-white rounded-xl p-3 border border-[#D0E0C0]">
                        {editSubcategory.id === sub._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editSubcategory.name}
                              onChange={(e) => setEditSubcategory({ ...editSubcategory, name: e.target.value })}
                              className="flex-1 px-2 py-1 border border-[#D0E0C0] rounded-lg text-sm"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && saveEditSubcategory()}
                            />
                            <button
                              onClick={saveEditSubcategory}
                              className="p-1 bg-green-500 text-white rounded-lg"
                            >
                              <FaSave size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-[#1A4D3E]">{sub.name}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditSubcategory(sub)}
                                className="p-1 text-[#8BC34A] hover:bg-[#F5F9F0] rounded"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => deleteSubcategory(sub._id)}
                                className="p-1 text-red-500 hover:bg-[#F5F9F0] rounded"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedCategory && (!subcategories[selectedCategory] || subcategories[selectedCategory].length === 0) && (
                      <p className="text-sm text-[#8A9B6E] text-center py-2">No subcategories yet</p>
                    )}
                  </div>
                </div>

                {/* Product Types Section */}
                <div className="bg-[#F5F9F0] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1A4D3E] mb-3">Product Types</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    >
                      <option value="">Select Subcategory</option>
                      {selectedCategory && subcategories[selectedCategory]?.map(sub => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newProductType}
                      onChange={(e) => setNewProductType(e.target.value)}
                      placeholder="Product type (e.g., Shirts, T-Shirts)"
                      className="px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      onKeyPress={(e) => e.key === 'Enter' && addProductType()}
                    />
                    <button
                      onClick={addProductType}
                      disabled={!selectedSubcategory || !newProductType}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50"
                    >
                      Add Product Type
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedSubcategory && productTypes[selectedSubcategory]?.map((type) => (
                      <div key={type._id} className="bg-white rounded-xl p-3 border border-[#D0E0C0]">
                        {editProductType.id === type._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editProductType.name}
                              onChange={(e) => setEditProductType({ ...editProductType, name: e.target.value })}
                              className="flex-1 px-2 py-1 border border-[#D0E0C0] rounded-lg text-sm"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && saveEditProductType()}
                            />
                            <button
                              onClick={saveEditProductType}
                              className="p-1 bg-green-500 text-white rounded-lg"
                            >
                              <FaSave size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-[#1A4D3E]">{type.name}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditProductType(type)}
                                className="p-1 text-[#8BC34A] hover:bg-[#F5F9F0] rounded"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => deleteProductType(type._id)}
                                className="p-1 text-red-500 hover:bg-[#F5F9F0] rounded"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {selectedSubcategory && (!productTypes[selectedSubcategory] || productTypes[selectedSubcategory].length === 0) && (
                      <p className="text-sm text-[#8A9B6E] text-center py-2">No product types yet</p>
                    )}
                  </div>
                </div>

                {/* Fabric Types Section */}
                <div className="bg-[#F5F9F0] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1A4D3E] mb-3">Fabric Types</h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFabricType}
                      onChange={(e) => setNewFabricType(e.target.value)}
                      placeholder="Fabric type (e.g., Cotton, Linen, Silk)"
                      className="flex-1 px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      onKeyPress={(e) => e.key === 'Enter' && addFabricType()}
                    />
                    <button
                      onClick={addFabricType}
                      disabled={!newFabricType}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {fabricTypes.map((fabric) => (
                      <div key={fabric._id} className="bg-white rounded-xl px-3 py-1 border border-[#D0E0C0] flex items-center gap-2">
                        {editFabricType.id === fabric._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editFabricType.name}
                              onChange={(e) => setEditFabricType({ ...editFabricType, name: e.target.value })}
                              className="px-2 py-1 border border-[#D0E0C0] rounded-lg text-sm"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && saveEditFabricType()}
                            />
                            <button
                              onClick={saveEditFabricType}
                              className="p-1 bg-green-500 text-white rounded-lg"
                            >
                              <FaSave size={10} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-[#1A4D3E]">{fabric.name}</span>
                            <button
                              onClick={() => startEditFabricType(fabric)}
                              className="p-1 text-[#8BC34A] hover:bg-[#F5F9F0] rounded"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              onClick={() => deleteFabricType(fabric._id)}
                              className="p-1 text-red-500 hover:bg-[#F5F9F0] rounded"
                            >
                              <FaTrash size={10} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gradient-to-r from-[#F5F9F0] to-white rounded-2xl p-4 border border-[#D0E0C0]">
                  <h4 className="font-semibold text-[#1A4D3E] mb-2">Category Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-[#8A9B6E]">Main Categories</p>
                      <p className="text-2xl font-bold text-[#1A4D3E]">{categories.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8A9B6E]">Subcategories</p>
                      <p className="text-2xl font-bold text-[#1A4D3E]">
                        {Object.values(subcategories).reduce((sum, subs) => sum + subs.length, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8A9B6E]">Product Types</p>
                      <p className="text-2xl font-bold text-[#1A4D3E]">
                        {Object.values(productTypes).reduce((sum, types) => sum + types.length, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#8A9B6E]">Fabric Types</p>
                      <p className="text-2xl font-bold text-[#1A4D3E]">{fabricTypes.length}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="px-6 py-2 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

     {/* Colors & Sizes Management Modal */}
<AnimatePresence>
  {showColorSizeModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-[#D0E0C0]">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#1A4D3E]">Colors & Sizes Management</h3>
            <button
              onClick={() => setShowColorSizeModal(false)}
              className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
            >
              <FaTimes className="text-[#8A9B6E]" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Colors Section */}
          <div className="bg-[#F5F9F0] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[#1A4D3E] flex items-center gap-2">
                <FaPalette className="text-[#8BC34A]" />
                Available Colors
              </h4>
              <button
                onClick={async () => {
                  try {
                    const colorsFull = await ProductApi.getColorsFull();
                    console.log('Full colors:', colorsFull);
                  } catch (error) {
                    console.error('Error fetching colors:', error);
                  }
                }}
                className="text-xs text-[#8A9B6E] hover:text-[#1A4D3E]"
              >
                Manage colors
              </button>
            </div>
            
            {/* Add New Color */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Color name (e.g., Teal, Coral)"
                className="flex-1 px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                onKeyPress={(e) => e.key === 'Enter' && addNewColor()}
              />
              <div className="relative">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-[#D0E0C0] cursor-pointer bg-white"
                />
              </div>
              <button
                onClick={addNewColor}
                disabled={!newColor}
                className="px-5 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <FaPlus size={14} />
                Add
              </button>
            </div>
            
            {/* Color List */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {availableColors.map((color, index) => {
                // Get color details if available
                const colorDetail = colorsFullData.find(c => c.name === color);
                const hexCode = colorDetail?.hexCode || getColorHexCode(color);
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#D0E0C0] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{ backgroundColor: hexCode }}
                      />
                      <span className="text-[#1A4D3E] font-medium">{color}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditColor(color, hexCode, colorDetail?._id)}
                        className="p-1 text-[#8BC34A] hover:bg-[#F5F9F0] rounded transition-colors"
                        title="Edit color"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => deleteColor(colorDetail?._id || color)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete color"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {availableColors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#8A9B6E]">No colors added yet. Add your first color above.</p>
              </div>
            )}
          </div>

          {/* Sizes Section */}
          <div className="bg-[#F5F9F0] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[#1A4D3E] flex items-center gap-2">
                <FaRulerCombined className="text-[#8BC34A]" />
                Available Sizes
              </h4>
              <button
                onClick={async () => {
                  try {
                    const sizesFull = await ProductApi.getSizesFull();
                    console.log('Full sizes:', sizesFull);
                  } catch (error) {
                    console.error('Error fetching sizes:', error);
                  }
                }}
                className="text-xs text-[#8A9B6E] hover:text-[#1A4D3E]"
              >
                Manage sizes
              </button>
            </div>
            
            {/* Add New Size */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                placeholder="Size (e.g., XXL, 3XL, 42)"
                className="flex-1 px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                onKeyPress={(e) => e.key === 'Enter' && addNewSize()}
              />
              <button
                onClick={addNewSize}
                disabled={!newSize}
                className="px-5 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <FaPlus size={14} />
                Add
              </button>
            </div>
            
            {/* Size List */}
            <div className="flex flex-wrap gap-3 mt-4">
              {availableSizes.map((size, index) => {
                const sizeDetail = sizesFullData.find(s => s.name === size);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#D0E0C0] hover:shadow-md transition-shadow"
                  >
                    <span className="text-[#1A4D3E] font-medium">{size}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => startEditSize(size, sizeDetail?._id)}
                        className="p-1 text-[#8BC34A] hover:bg-[#F5F9F0] rounded transition-colors"
                        title="Edit size"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => deleteSize(sizeDetail?._id || size)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Delete size"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {availableSizes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#8A9B6E]">No sizes added yet. Add your first size above.</p>
              </div>
            )}
          </div>

          {/* Edit Color Modal */}
          {editingColor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96">
                <h4 className="text-xl font-bold text-[#1A4D3E] mb-4">Edit Color</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingColor.name}
                    onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                    placeholder="Color name"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editingColor.hexCode}
                      onChange={(e) => setEditingColor({ ...editingColor, hexCode: e.target.value })}
                      className="w-12 h-12 rounded-xl border border-[#D0E0C0] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingColor.hexCode}
                      onChange={(e) => setEditingColor({ ...editingColor, hexCode: e.target.value })}
                      className="flex-1 px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                      placeholder="#000000"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={saveEditColor}
                      className="flex-1 bg-[#8BC34A] text-white py-2 rounded-xl hover:bg-[#5A9E4E]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingColor(null)}
                      className="flex-1 border border-[#D0E0C0] text-[#1A4D3E] py-2 rounded-xl hover:bg-[#F5F9F0]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Size Modal */}
          {editingSize && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96">
                <h4 className="text-xl font-bold text-[#1A4D3E] mb-4">Edit Size</h4>
                <input
                  type="text"
                  value={editingSize.name}
                  onChange={(e) => setEditingSize({ ...editingSize, name: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                  placeholder="Size name"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={saveEditSize}
                    className="flex-1 bg-[#8BC34A] text-white py-2 rounded-xl hover:bg-[#5A9E4E]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSize(null)}
                    className="flex-1 border border-[#D0E0C0] text-[#1A4D3E] py-2 rounded-xl hover:bg-[#F5F9F0]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#D0E0C0] flex justify-end gap-3">
          <button
            onClick={() => setShowColorSizeModal(false)}
            className="px-6 py-2 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

    </div>
  );
};

export default ProductManagement;