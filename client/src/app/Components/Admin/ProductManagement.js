// src/components/admin/ProductManagement.js
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaDownload,
  FaFileExcel,
  FaTimes,
  FaSave,
  FaImage,
  FaSearch,
  FaFilter,
  FaStar,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaBoxes,
  FaTag,
  FaWeight,
  FaDollarSign,
  FaPercent,
  FaPalette,
  FaRulerCombined,
  FaEye,
  FaInfoCircle,
  FaImages,
  FaCalendarAlt,
  FaChartBar
  
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { ProductApi } from '../../lib/ProductApi';

const ProductManagement = () => {
  // Categories state with subcategories
  const [categories, setCategories] = useState({});
  const [availableSizes, setAvailableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']);
  const [availableColors, setAvailableColors] = useState([
    'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange',
    'Brown', 'Pink', 'Gray', 'Navy', 'Maroon', 'Teal', 'Olive', 'Coral'
  ]);
  const [customColors, setCustomColors] = useState([]);

  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // UI States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showColorSizeModal, setShowColorSizeModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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
    category: '',
    subcategory: '',
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
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState('');
  const [editCategory, setEditCategory] = useState({ name: '', original: '' });
  const [editSubcategory, setEditSubcategory] = useState({ name: '', original: '', category: '' });
 const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
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
      category: '',
      subcategory: '',
      sizes: [],
      colors: [],
      customColors: [],
      isFeatured: false,
      rating: 0
    };
  }

  // Fetch all data on mount
  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();
    fetchProducts();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ProductApi.getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      //alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch colors from API
  const fetchColors = async () => {
    try {
      const response = await ProductApi.getColors();
      setAvailableColors(response);
    } catch (error) {
      //console.error('Error fetching colors:', error);
    }
  };

  // Fetch sizes from API
  const fetchSizes = async () => {
    try {
      const response = await ProductApi.getSizes();
      setAvailableSizes(response);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductApi.getProducts(filters);
      console.log(response.products)
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
     // alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
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
      category: '',
      subcategory: '',
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
      category: product.category,
      subcategory: product.subcategory,
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
        category: product.category,
        subcategory: product.subcategory,
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

  // CSV Upload
  
  // Excel upload with images
  const handleExcelUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      const excelFile = selectedFiles.find(
        (f) => f.name.endsWith(".xlsx") || f.name.endsWith(".xls") || f.name.endsWith(".csv")
      );
      
      if (!excelFile) {
        alert("Please select a valid Excel file");
        return;
      }
      
      formData.append("excelFile", excelFile);

      selectedFiles
        .filter((f) => f.type.startsWith("image/"))
        .forEach((file) => formData.append("productImages", file));

      const response = await ProductApi.bulkExcelUpload(formData);

      if (response.created > 0) {
        alert(`✅ Uploaded ${response.created} products successfully`);
        fetchProducts();
        setShowBulkModal(false);
        setSelectedFiles([]);
      } else {
        alert(`❌ Upload failed`);
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
        category: 'Wool',
        subcategory: 'Jumpers',
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
      ['2. Required fields: name, price, category, subcategory'],
      ['3. Sizes column: Add comma-separated sizes (e.g., "S,M,L,XL")'],
      ['4. Colors column: Add comma-separated colors (e.g., "Red,Blue,Black")'],
      ['5. For featured products, set isFeatured to "true"'],
      ['6. Images column: Add comma-separated image filenames'],
      ['7. Upload images separately with matching filenames'],
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
    if (newCategory && !categories[newCategory]) {
      try {
        await ProductApi.addCategory(newCategory, []);
        setCategories({ ...categories, [newCategory]: [] });
        setNewCategory('');
        alert('Category added successfully!');
      } catch (error) {
        alert('Failed to add category: ' + error.message);
      }
    }
  };

  const deleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category}" category?`)) {
      try {
        await ProductApi.deleteCategory(category);
        const updated = { ...categories };
        delete updated[category];
        setCategories(updated);
        alert('Category deleted successfully!');
      } catch (error) {
        alert('Failed to delete category: ' + error.message);
      }
    }
  };

  const startEditCategory = (category) => {
    setEditCategory({ name: category, original: category });
  };

  const saveEditCategory = async () => {
    if (editCategory.name && editCategory.name !== editCategory.original) {
      try {
        // Update categories in backend
        const updated = { ...categories };
        updated[editCategory.name] = [...updated[editCategory.original]];
        delete updated[editCategory.original];
        await ProductApi.updateCategories(updated);
        setCategories(updated);
        alert('Category updated successfully!');
      } catch (error) {
        alert('Failed to update category: ' + error.message);
      }
    }
    setEditCategory({ name: '', original: '' });
  };

  const addSubcategory = async () => {
    if (selectedCategoryForSub && newSubcategory) {
      try {
        await ProductApi.addSubcategory(selectedCategoryForSub, newSubcategory);
        const updated = { ...categories };
        if (!updated[selectedCategoryForSub].includes(newSubcategory)) {
          updated[selectedCategoryForSub] = [...updated[selectedCategoryForSub], newSubcategory];
          setCategories(updated);
          setNewSubcategory('');
          alert('Subcategory added successfully!');
        }
      } catch (error) {
        alert('Failed to add subcategory: ' + error.message);
      }
    }
  };

  const deleteSubcategory = async (category, subcategory) => {
    if (window.confirm(`Are you sure you want to delete "${subcategory}"?`)) {
      try {
        await ProductApi.deleteSubcategory(category, subcategory);
        const updated = { ...categories };
        updated[category] = updated[category].filter(sub => sub !== subcategory);
        setCategories(updated);
        alert('Subcategory deleted successfully!');
      } catch (error) {
        alert('Failed to delete subcategory: ' + error.message);
      }
    }
  };

  const startEditSubcategory = (category, subcategory) => {
    setEditSubcategory({ name: subcategory, original: subcategory, category });
  };

  const saveEditSubcategory = async () => {
    if (editSubcategory.name && editSubcategory.name !== editSubcategory.original) {
      try {
        const updated = { ...categories };
        const index = updated[editSubcategory.category].indexOf(editSubcategory.original);
        if (index !== -1) {
          updated[editSubcategory.category][index] = editSubcategory.name;
          await ProductApi.updateCategories(updated);
          setCategories(updated);
          alert('Subcategory updated successfully!');
        }
      } catch (error) {
        alert('Failed to update subcategory: ' + error.message);
      }
    }
    setEditSubcategory({ name: '', original: '', category: '' });
  };

  // Color Management Functions
  const addNewColor = async () => {
    if (newColor && !availableColors.includes(newColor)) {
      try {
        const updatedColors = [...availableColors, newColor];
        await ProductApi.updateColors(updatedColors);
        setAvailableColors(updatedColors);
        setNewColor('');
        alert('Color added successfully!');
      } catch (error) {
        alert('Failed to add color: ' + error.message);
      }
    }
  };

  const deleteColor = async (color) => {
    if (window.confirm(`Are you sure you want to delete "${color}" color?`)) {
      try {
        const updatedColors = availableColors.filter(c => c !== color);
        await ProductApi.updateColors(updatedColors);
        setAvailableColors(updatedColors);
        alert('Color deleted successfully!');
      } catch (error) {
        alert('Failed to delete color: ' + error.message);
      }
    }
  };

  // Size Management Functions
  const addNewSize = async () => {
    if (newSize && !availableSizes.includes(newSize)) {
      try {
        const updatedSizes = [...availableSizes, newSize];
        await ProductApi.updateSizes(updatedSizes);
        setAvailableSizes(updatedSizes);
        setNewSize('');
        alert('Size added successfully!');
      } catch (error) {
        alert('Failed to add size: ' + error.message);
      }
    }
  };

  const deleteSize = async (size) => {
    if (window.confirm(`Are you sure you want to delete "${size}" size?`)) {
      try {
        const updatedSizes = availableSizes.filter(s => s !== size);
        await ProductApi.updateSizes(updatedSizes);
        setAvailableSizes(updatedSizes);
        alert('Size deleted successfully!');
      } catch (error) {
        alert('Failed to delete size: ' + error.message);
      }
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
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
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
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
              onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: '', page: 1 })}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({ ...filters, subcategory: e.target.value, page: 1 })}
              disabled={!filters.category}
              className="w-full px-4 py-2 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
            >
              <option value="">All Subcategories</option>
              {filters.category && categories[filters.category]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          
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
        
        {(filters.search || filters.category || filters.subcategory || filters.minPrice || filters.maxPrice) && (
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Sizes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">Colors</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A4D3E]">is Featured</th>
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
                          <div className="w-12 h-12 bg-gradient-to-br from-[#8BC34A] to-[#5A9E4E] rounded-xl flex items-center justify-center text-white font-bold">
                           <img
                        src={product.imageUrls?.[0]?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API}${product.imageUrls?.[0]}` : URL.createObjectURL(product.imageUrls?.[0])}
                        className="w-12 h-12 rounded-xl object-cover border"
                        alt={product.name}
                      />
                          </div>
                          <div>
                            <p className="font-semibold text-[#1A4D3E]">{product.name}</p>
                            <p className="text-xs text-[#8A9B6E] line-clamp-1">{product.description?.slice(0, 100)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[#1A4D3E]">{product.category}</p>
                        <p className="text-xs text-[#8A9B6E]">{product.subcategory}</p>
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
                        <div className="flex gap-1 flex-wrap">
                          {product.sizes?.slice(0, 3).map(size => (
                            <span key={size} className="px-2 py-1 bg-[#F5F9F0] text-xs rounded-lg">
                              {size}
                            </span>
                          ))}
                          {product.sizes?.length > 3 && (
                            <span className="px-2 py-1 bg-[#F5F9F0] text-xs rounded-lg">
                              +{product.sizes.length - 3}
                            </span>
                          )}
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          <span className="text-[#1A4D3E]">{product.rating}</span>
                        </div>
                       </td>
                       <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {product.colors?.slice(0, 3).map(color => (
                            <span key={color} className="px-2 py-1 bg-[#F5F9F0] text-xs rounded-lg">
                              {color}
                            </span>
                          ))}
                          {product.colors?.length > 3 && (
                            <span className="px-2 py-1 bg-[#F5F9F0] text-xs rounded-lg">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.isFeatured && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-semibold">
                            Featured
                          </span>
                        )}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-[#8BC34A] hover:bg-[#F5F9F0] rounded-xl transition-colors"
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
                              src={`${process.env.NEXT_PUBLIC_API}${url}`}
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

                    {/* Custom Colors with Images */}
                    {viewingProduct.customColors && viewingProduct.customColors.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-[#1A4D3E] mb-3">Custom Colors</h4>
                        <div className="space-y-4">
                          {viewingProduct.customColors.map((color, idx) => (
                            <div key={idx} className="border border-[#D0E0C0] rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div 
                                  className="w-6 h-6 rounded-full border border-[#D0E0C0]"
                                  style={{ backgroundColor: color.hexCode }}
                                />
                                <span className="font-medium text-[#1A4D3E]">{color.name}</span>
                              </div>
                              {color.images && color.images.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {color.images.map((img, imgIdx) => (
                                    <div key={imgIdx} className="aspect-square rounded-lg overflow-hidden border border-[#D0E0C0]">
                                      <img
                                        src={img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API}${img}` : img}
                                        alt={`${color.name} ${imgIdx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                        <p className="text-xs text-[#8A9B6E]">Offer Price</p>
                        <p className="text-lg font-semibold text-[#FF8C42]">₹{viewingProduct.discountedPrice || viewingProduct.price}</p>
                      </div>
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Offer Percentage</p>
                        <p className="text-lg font-semibold text-green-600">{viewingProduct.offerPercent || 0}% OFF</p>
                      </div>
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Total Price (incl. GST)</p>
                        <p className="text-lg font-semibold text-[#1A4D3E]">₹{viewingProduct.totalPrice}</p>
                      </div>
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">GST</p>
                        <p className="text-lg font-semibold text-[#1A4D3E]">{viewingProduct.gstPercent}% (₹{viewingProduct.gstAmount})</p>
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
                      <div className="bg-[#F5F9F0] rounded-xl p-3">
                        <p className="text-xs text-[#8A9B6E]">Rating</p>
                        <p className="text-lg font-semibold text-[#1A4D3E] flex items-center gap-1">
                          {viewingProduct.rating || 0} <FaStar className="text-yellow-400 text-sm" />
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#D0E0C0] pt-4">
                      <h4 className="font-semibold text-[#1A4D3E] mb-2">Category</h4>
                      <p className="text-[#5A7A4C]">{viewingProduct.category} / {viewingProduct.subcategory}</p>
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

                    <div className="border-t border-[#D0E0C0] pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-[#1A4D3E] mb-2 flex items-center gap-1">
                            <FaCalendarAlt className="text-[#8A9B6E]" />
                            Created
                          </h4>
                          <p className="text-sm text-[#5A7A4C]">{formatDate(viewingProduct.createdAt)}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1A4D3E] mb-2 flex items-center gap-1">
                            <FaChartBar className="text-[#8A9B6E]" />
                            Views
                          </h4>
                          <p className="text-sm text-[#5A7A4C]">{viewingProduct.views || 0} views</p>
                        </div>
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
      {/* Add Product Modal - Keep existing JSX but update form fields to include customColors */}
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
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value, subcategory: '' })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Subcategory *
              </label>
              <select
                required
                value={productForm.subcategory}
                onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                disabled={!productForm.category}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
              >
                <option value="">Select Subcategory</option>
                {productForm.category && categories[productForm.category]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
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

      {/* Edit Product Modal - Keep existing JSX */}
       {/* Edit Product Modal */}
<AnimatePresence>
  {showEditModal && (
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
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value, subcategory: '' })}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Subcategory *
              </label>
              <select
                required
                value={productForm.subcategory}
                onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                disabled={!productForm.category}
                className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] disabled:opacity-50"
              >
                <option value="">Select Subcategory</option>
                {productForm.category && categories[productForm.category]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
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
                  
                  {/* Display existing custom color images */}
                  {color.images && color.images.length > 0 && (
                    <div className="mb-3">
                      <label className="block text-[#1A4D3E] text-sm font-semibold mb-2">
                        Current Images
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {color.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API}${img}` : URL.createObjectURL(img)}
                              alt={`${color.name} ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
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
                    </div>
                  )}
                  
                  {/* Add new images for custom color */}
                  <div>
                    <label className="block text-[#1A4D3E] text-sm font-semibold mb-2">
                      Add New Images
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
                        <FaUpload className="text-xl text-[#8A9B6E] mb-1" />
                        <span className="text-sm text-[#8A9B6E]">Upload new images</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Product Images */}
          {editingProduct?.imageUrls && editingProduct.imageUrls.length > 0 && (
            <div>
              <label className="block text-[#1A4D3E] font-semibold mb-2">
                Current Product Images
              </label>
              <div className="flex gap-2 flex-wrap">
                {editingProduct.imageUrls.map((url, index) => (
                  <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-[#D0E0C0]">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API}${url}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Product Images */}
          <div>
            <label className="block text-[#1A4D3E] font-semibold mb-2">
              Add New Images
            </label>
            <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
              <FaUpload className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
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
                          alt={`New ${index + 1}`}
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

          {/* Rating */}
          <div>
            <label className="block text-[#1A4D3E] font-semibold mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={productForm.rating}
              onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })}
              className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              placeholder="0"
            />
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
      {/* Bulk Upload Modal - Keep existing JSX but update API calls */}
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
                          value={product.category}
                          onChange={(e) => updateBulkProduct(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                        >
                          <option value="">Select</option>
                          {Object.keys(categories).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#1A4D3E] font-semibold mb-2 text-sm">
                          Subcategory *
                        </label>
                        <select
                          required
                          value={product.subcategory}
                          onChange={(e) => updateBulkProduct(index, 'subcategory', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] text-sm"
                        >
                          <option value="">Select</option>
                          {product.category && categories[product.category]?.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
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
                  <li>Required columns: name, price, category, subcategory</li>
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
      {/* Category Management Modal - Keep existing JSX but update with API calls */}
{/* Category Management Modal */}
<AnimatePresence>
  {showCategoryModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#1A4D3E]">Category Management</h3>
            <button
              onClick={() => {
                setShowCategoryModal(false);
                setEditCategory({ name: '', original: '' });
                setEditSubcategory({ name: '', original: '', category: '' });
              }}
              className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
            >
              <FaTimes className="text-[#8A9B6E]" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Category */}
          <div className="bg-[#F5F9F0] rounded-2xl p-4">
            <h4 className="font-semibold text-[#1A4D3E] mb-3">Add New Category</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name (e.g., Silk)"
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
          </div>

          {/* Add Subcategory */}
          <div className="bg-[#F5F9F0] rounded-2xl p-4">
            <h4 className="font-semibold text-[#1A4D3E] mb-3">Add New Subcategory</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={selectedCategoryForSub}
                onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                className="px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
                disabled={!selectedCategoryForSub || !newSubcategory}
                className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#1A4D3E] flex items-center gap-2">
              <FaTag className="text-[#8BC34A]" />
              All Categories
            </h4>
            
            {Object.keys(categories).length === 0 ? (
              <div className="text-center py-8 bg-[#F5F9F0] rounded-2xl">
                <FaTag className="text-4xl text-[#8A9B6E] mx-auto mb-2" />
                <p className="text-[#8A9B6E]">No categories yet. Add your first category above.</p>
              </div>
            ) : (
              Object.entries(categories).map(([category, subcategories]) => (
                <div key={category} className="border border-[#D0E0C0] rounded-2xl overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-[#F5F9F0] px-4 py-3 flex items-center justify-between">
                    {editCategory.original === category ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editCategory.name}
                          onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                          className="px-3 py-1 bg-white border border-[#D0E0C0] rounded-lg text-[#1A4D3E] flex-1"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && saveEditCategory()}
                        />
                        <button
                          onClick={saveEditCategory}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <FaSave size={14} />
                        </button>
                      </div>
                    ) : (
                      <h5 className="font-semibold text-[#1A4D3E] text-lg">{category}</h5>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {editCategory.original !== category && (
                        <button
                          onClick={() => startEditCategory(category)}
                          className="p-2 text-[#8BC34A] hover:bg-white rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => deleteCategory(category)}
                        className="p-2 text-red-500 hover:bg-white rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {/* Subcategories List */}
                  <div className="p-4 bg-white">
                    {subcategories.length === 0 ? (
                      <p className="text-sm text-[#8A9B6E] text-center py-2">No subcategories yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {subcategories.map((subcategory, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-[#F5F9F0] rounded-lg">
                            {editSubcategory.original === subcategory && editSubcategory.category === category ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editSubcategory.name}
                                  onChange={(e) => setEditSubcategory({...editSubcategory, name: e.target.value})}
                                  className="px-3 py-1 bg-white border border-[#D0E0C0] rounded-lg text-[#1A4D3E] flex-1"
                                  autoFocus
                                  onKeyPress={(e) => e.key === 'Enter' && saveEditSubcategory()}
                                />
                                <button
                                  onClick={saveEditSubcategory}
                                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  <FaSave size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="text-[#1A4D3E]">{subcategory}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => startEditSubcategory(category, subcategory)}
                                    className="p-1 text-[#8BC34A] hover:bg-white rounded-lg transition-colors"
                                    title="Edit Subcategory"
                                  >
                                    <FaEdit size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteSubcategory(category, subcategory)}
                                    className="p-1 text-red-500 hover:bg-white rounded-lg transition-colors"
                                    title="Delete Subcategory"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-[#F5F9F0] to-white rounded-2xl p-4 border border-[#D0E0C0]">
            <h4 className="font-semibold text-[#1A4D3E] mb-2">Category Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#8A9B6E]">Total Categories</p>
                <p className="text-2xl font-bold text-[#1A4D3E]">{Object.keys(categories).length}</p>
              </div>
              <div>
                <p className="text-sm text-[#8A9B6E]">Total Subcategories</p>
                <p className="text-2xl font-bold text-[#1A4D3E]">
                  {Object.values(categories).reduce((sum, subs) => sum + subs.length, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setShowCategoryModal(false);
                setEditCategory({ name: '', original: '' });
                setEditSubcategory({ name: '', original: '', category: '' });
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
      {/* Colors & Sizes Management Modal */}
      <AnimatePresence>
        {showColorSizeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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

              <div className="p-6 space-y-6">
                {/* Colors Section */}
                <div className="bg-[#F5F9F0] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1A4D3E] mb-3 flex items-center gap-2">
                    <FaPalette /> Available Colors
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Color name"
                      className="flex-1 px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                    />
                    <button
                      onClick={addNewColor}
                      disabled={!newColor}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {availableColors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-[#D0E0C0]"
                      >
                        <span className="text-[#1A4D3E]">{color}</span>
                        <button
                          onClick={() => deleteColor(color)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes Section */}
                <div className="bg-[#F5F9F0] rounded-2xl p-4">
                  <h4 className="font-semibold text-[#1A4D3E] mb-3 flex items-center gap-2">
                    <FaRulerCombined /> Available Sizes
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Size (e.g., XXL)"
                      className="flex-1 px-4 py-2 bg-white border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
                    />
                    <button
                      onClick={addNewSize}
                      disabled={!newSize}
                      className="px-4 py-2 bg-[#8BC34A] text-white rounded-xl hover:bg-[#5A9E4E] disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {availableSizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-[#D0E0C0]"
                      >
                        <span className="text-[#1A4D3E]">{size}</span>
                        <button
                          onClick={() => deleteSize(size)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;