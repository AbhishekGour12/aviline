// controllers/productController.js
import { Category, Subcategory, ProductType, FabricType, Product } from '../Models/Product.js';
import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path'
import { Color, Size } from '../Models/Setting.js';
// Helper function for pricing calculation
const calculatePricing = ({ price, offerPercent, gstPercent }) => {
  let discountedPrice = price;
  if (offerPercent > 0) {
    const discount = (price * offerPercent) / 100;
    discountedPrice = price - discount;
  }
  
  const gstAmount = (discountedPrice * gstPercent) / 100;
  const totalPrice = discountedPrice + gstAmount;
  
  return {
    discountedPrice: parseFloat(discountedPrice.toFixed(2)),
    gstAmount: parseFloat(gstAmount.toFixed(2)),
    totalPrice: parseFloat(totalPrice.toFixed(2))
  };
};

// ============== PRODUCT CRUD ==============

// Add single product
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.product || "{}");
    const uploadedFiles = req.files || [];

    const imageUrls = uploadedFiles.map(
      (file) => `/uploads/products/${file.filename}`
    );

    // Calculate pricing
    const pricing = calculatePricing({
      price: productData.price,
      offerPercent: productData.offerPercent || 0,
      gstPercent: productData.gstPercent || 18
    });

    // Handle custom colors with images
    const customColors = productData.customColors || [];
    let imageIndex = 0;
    const processedCustomColors = customColors.map((color) => {
      const colorImageCount = color.imageCount || 0;
      const colorImages = imageUrls.slice(imageIndex, imageIndex + colorImageCount);
      imageIndex += colorImageCount;
      
      return {
        name: color.name,
        hexCode: color.hexCode || '#000000',
        images: colorImages
      };
    });

    const mainImages = imageUrls.slice(imageIndex);

    // Get category, subcategory, product type details
    const category = await Category.findById(productData.categoryId);
    const subcategory = await Subcategory.findById(productData.subcategoryId);
    const productType = await ProductType.findById(productData.productTypeId);
    const fabricType = productData.fabricTypeId ? await FabricType.findById(productData.fabricTypeId) : null;

    const product = new Product({
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      weight: Number(productData.weight) || 0.5,
      offerPercent: Number(productData.offerPercent) || 0,
      ...pricing,
      category: category?.name || '',
      subcategory: subcategory?.name || '',
      productType: productType?.name || '',
      fabricType: fabricType?.name || '',
      imageUrls: mainImages,
      customColors: processedCustomColors,
      rating: Number(productData.rating) || 0,
      sizes: productData.sizes || [],
      colors: productData.colors || []
    });

    await product.save();

    res.status(201).json({
      message: "✅ Product added successfully",
      product
    });
  } catch (error) {
    console.error("❌ addProduct error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all products with filters
export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      subcategory,
      productType,
      fabricType,
      minPrice,
      maxPrice,
      isFeatured,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      colors,
      sizes,
    } = req.query;
   

    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    // Handle category filtering - supports both ID and name
    if (category) {
      // Check if category is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.categoryId = category;
      } else {
        filter.category = category;
      }
    }

  

    // Handle size filtering - filter products that have at least one of the selected sizes
    if (sizes) {
      const sizeArray = sizes.split(',');
      filter.sizes = { $in: sizeArray };
    }

    // Handle product type filtering - supports both ID and name
    if (productType) {
      if (mongoose.Types.ObjectId.isValid(productType)) {
        filter.productTypeId = productType;
      } else {
        filter.productType = productType;
      }
    }
    

    // Handle fabric type filtering - supports both ID and name
    if (fabricType) {
      if (mongoose.Types.ObjectId.isValid(fabricType)) {
        filter.fabricTypeId = fabricType;
      } else {
        filter.fabricType = fabricType;
      }
    }
      // Handle subcategory filtering - supports both ID and name
    if (subcategory) {
      if (mongoose.Types.ObjectId.isValid(subcategory)) {
        filter.subcategoryId = subcategory;
      } else {
        filter.subcategory = subcategory;
      }
    }
// Handle color filtering - filter products that have at least one of the selected colors
    if (colors) {
  const colorArray = colors.split(',').map(color => 
    new RegExp(`^${color}$`, 'i') // case-insensitive exact match
  );

  filter.colors = { $in: colorArray };
}

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (isFeatured !== undefined && isFeatured !== '') {
      filter.isFeatured = isFeatured === 'true';
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', 'name')
        .populate('subcategoryId', 'name')
        .populate('productTypeId', 'name')
        .populate('fabricTypeId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      products,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      limit: Number(limit)
    });
  } catch (error) {
    console.error("❌ getAllProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};// Get all products with filters


// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('productTypeId', 'name')
      .populate('fabricTypeId', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ getProductById error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.product || "{}");
    const uploadedFiles = req.files || [];

    const newImageUrls = uploadedFiles.map(
      (file) => `/uploads/products/${file.filename}`
    );

    const existingImages = productData.existingImages ? JSON.parse(productData.existingImages) : [];
    const allImageUrls = [...existingImages, ...newImageUrls];

    // Calculate pricing
    const pricing = calculatePricing({
      price: productData.price,
      offerPercent: productData.offerPercent || 0,
      gstPercent: productData.gstPercent || 18
    });

    // Handle custom colors
    const customColors = productData.customColors || [];
    let imageIndex = 0;
    const processedCustomColors = customColors.map((color) => {
      const colorImageCount = color.imageCount || 0;
      const colorImages = newImageUrls.slice(imageIndex, imageIndex + colorImageCount);
      imageIndex += colorImageCount;
      
      return {
        name: color.name,
        hexCode: color.hexCode || '#000000',
        images: [...(color.existingImages || []), ...colorImages]
      };
    });

    const mainImages = allImageUrls;

    // Get category, subcategory, product type details
    const category = productData.categoryId ? await Category.findById(productData.categoryId) : null;
    const subcategory = productData.subcategoryId ? await Subcategory.findById(productData.subcategoryId) : null;
    const productType = productData.productTypeId ? await ProductType.findById(productData.productTypeId) : null;
    const fabricType = productData.fabricTypeId ? await FabricType.findById(productData.fabricTypeId) : null;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        weight: Number(productData.weight) || 0.5,
        offerPercent: Number(productData.offerPercent) || 0,
        ...pricing,
        category: category?.name || '',
        subcategory: subcategory?.name || '',
        productType: productType?.name || '',
        fabricType: fabricType?.name || '',
        imageUrls: mainImages,
        customColors: processedCustomColors,
        sizes: productData.sizes || [],
        colors: productData.colors || []
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("❌ updateProduct error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ deleteProduct error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk add products
export const bulkAddProducts = async (req, res) => {
  try {
    const productsData = JSON.parse(req.body.products || "[]");
    const uploadedFiles = req.files || [];

    let fileIndex = 0;
    const products = [];

    for (const productData of productsData) {
      const imageCount = productData.imageFilesCount || 0;
      const productImages = uploadedFiles.slice(fileIndex, fileIndex + imageCount);
      const imageUrls = productImages.map(file => `/uploads/products/${file.filename}`);
      fileIndex += imageCount;

      const pricing = calculatePricing({
        price: productData.price,
        offerPercent: productData.offerPercent || 0,
        gstPercent: productData.gstPercent || 18
      });

      // Get category, subcategory, product type details
      const category = await Category.findOne({ name: productData.category });
      const subcategory = await Subcategory.findOne({ name: productData.subcategory });
      const productType = await ProductType.findOne({ name: productData.productType });
      const fabricType = productData.fabricType ? await FabricType.findOne({ name: productData.fabricType }) : null;

      products.push({
        ...productData,
        categoryId: category?._id,
        category: category?.name || '',
        subcategoryId: subcategory?._id,
        subcategory: subcategory?.name || '',
        productTypeId: productType?._id,
        productType: productType?.name || '',
        fabricTypeId: fabricType?._id,
        fabricType: fabricType?.name || '',
        ...pricing,
        imageUrls
      });
    }

    const savedProducts = await Product.insertMany(products);

    res.status(201).json({
      message: `✅ ${savedProducts.length} products added successfully`,
      created: savedProducts.length
    });
  } catch (error) {
    console.error("❌ bulkAddProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk Excel upload

export const bulkExcelUpload = async (req, res) => {
  try {
    console.log('=== Starting bulk Excel upload ===');
    
    // Log all received files for debugging
    console.log('Received files structure:', {
      excelFile: req.files?.excelFile?.length || 0,
      productImages: req.files?.productImages?.length || 0,
      images: req.files?.images?.length || 0
    });
    
    // Get the uploaded files
    const excelFiles = req.files?.excelFile || [];
    const excelFile = excelFiles[0];
    
    if (!excelFile) {
      return res.status(400).json({ error: 'No Excel file found' });
    }

    console.log(`Excel file: ${excelFile.originalname}`);
    console.log(`Excel file saved at: ${excelFile.path}`);
    
    // Verify Excel file exists
    if (!fs.existsSync(excelFile.path)) {
      throw new Error(`Excel file not found at path: ${excelFile.path}`);
    }

    // Read Excel file
    const fileBuffer = fs.readFileSync(excelFile.path);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${data.length} rows in Excel file`);

    // Get all images from both fields
    const productImages = req.files?.productImages || [];
    const additionalImages = req.files?.images || [];
    const allImages = [...productImages, ...additionalImages];
    
    console.log(`Found ${allImages.length} images total`);
    console.log('Images details:', allImages.map(img => ({
      originalname: img.originalname,
      filename: img.filename,
      path: img.path,
      size: img.size
    })));

    // Create image map for quick lookup
    const imageMap = new Map();
    allImages.forEach(file => {
      const fileName = file.originalname.toLowerCase();
      imageMap.set(fileName, file);
      console.log(`Mapped image: ${fileName} -> ${file.filename}`);
    });

    // Get all data from database
    const allCategories = await Category.find({});
    const allSubcategories = await Subcategory.find({});
    const allProductTypes = await ProductType.find({});
    const allFabricTypes = await FabricType.find({});
    
    // Create lookup maps
    const categoryMap = new Map();
    allCategories.forEach(cat => {
      categoryMap.set(cat.name.toLowerCase(), cat);
    });
    
    const subcategoryMap = new Map();
    allSubcategories.forEach(sub => {
      const key = `${sub.name.toLowerCase()}|${sub.categoryId.toString()}`;
      subcategoryMap.set(key, sub);
    });
    
    const productTypeMap = new Map();
    allProductTypes.forEach(type => {
      const key = `${type.name.toLowerCase()}|${type.subcategoryId.toString()}`;
      productTypeMap.set(key, type);
    });
    
    const fabricTypeMap = new Map();
    allFabricTypes.forEach(fabric => {
      fabricTypeMap.set(fabric.name.toLowerCase(), fabric);
    });

    let created = 0;
    let skipped = 0;
    const errors = [];

    // Process each row
    for (const row of data) {
      try {
        if (!row.name || !row.price || !row.category || !row.subcategory || !row.productType) {
          errors.push(`Row skipped: Missing required fields`);
          skipped++;
          continue;
        }
        
        // Find category
        const category = categoryMap.get(row.category.toLowerCase());
        if (!category) {
          errors.push(`Row "${row.name}": Category "${row.category}" not found`);
          skipped++;
          continue;
        }
        
        // Find subcategory
        const subcategoryKey = `${row.subcategory.toLowerCase()}|${category._id.toString()}`;
        let subcategory = subcategoryMap.get(subcategoryKey);
        
        if (!subcategory) {
          subcategory = await Subcategory.findOne({
            name: { $regex: new RegExp(`^${row.subcategory}$`, 'i') },
            categoryId: category._id
          });
        }
        
        if (!subcategory) {
          errors.push(`Row "${row.name}": Subcategory "${row.subcategory}" not found`);
          skipped++;
          continue;
        }
        
        // Find product type
        const productTypeKey = `${row.productType.toLowerCase()}|${subcategory._id.toString()}`;
        let productType = productTypeMap.get(productTypeKey);
        
        if (!productType) {
          productType = await ProductType.findOne({
            name: { $regex: new RegExp(`^${row.productType}$`, 'i') },
            subcategoryId: subcategory._id
          });
        }
        
        if (!productType) {
          errors.push(`Row "${row.name}": Product type "${row.productType}" not found`);
          skipped++;
          continue;
        }
        
        // Find fabric type
        let fabricType = null;
        if (row.fabricType) {
          fabricType = fabricTypeMap.get(row.fabricType.toLowerCase());
          if (!fabricType) {
            fabricType = await FabricType.findOne({
              name: { $regex: new RegExp(`^${row.fabricType}$`, 'i') }
            });
          }
        }
        
        // Parse sizes and colors
        const sizes = row.sizes ? row.sizes.split(',').map(s => s.trim().toUpperCase()) : [];
        const colors = row.colors ? row.colors.split(',').map(c => c.trim()) : [];
        
        // Match images
        const imageFilenames = row.images ? row.images.split(',').map(i => i.trim().toLowerCase()) : [];
        const matchedImages = [];
        
        console.log(`Processing images for ${row.name}: ${imageFilenames.join(', ')}`);
        
        imageFilenames.forEach(imgName => {
          if (imageMap.has(imgName)) {
            const file = imageMap.get(imgName);
            matchedImages.push(file);
            console.log(`✓ Matched image: ${imgName} -> ${file.filename}`);
          } else {
            // Try partial match
            let found = false;
            for (const [key, file] of imageMap.entries()) {
              if (key.includes(imgName) || imgName.includes(key)) {
                matchedImages.push(file);
                console.log(`✓ Partially matched: ${imgName} -> ${file.filename} (from ${key})`);
                found = true;
                break;
              }
            }
            if (!found) {
              console.log(`⚠️ No match found for image: ${imgName}`);
            }
          }
        });
        
        // Create image URLs (using the saved filename)
        const imageUrls = matchedImages.map(file => `/uploads/products/${file.filename}`);
        
        console.log(`Created ${imageUrls.length} image URLs for ${row.name}`);
        
        // Calculate prices
        const price = Number(row.price);
        const offerPercent = Number(row.offerPercent) || 0;
        const discountedPrice = offerPercent > 0 ? price - (price * offerPercent / 100) : price;
        const gstPercent = Number(row.gstPercent) || 18;
        
        // Create product
        const product = new Product({
          name: row.name,
          description: row.description || '',
          price: price,
          stock: Number(row.stock) || 0,
          weight: Number(row.weight) || 0.5,
          offerPercent: offerPercent,
          discountedPrice: parseFloat(discountedPrice.toFixed(2)),
          categoryId: category._id,
          category: category.name,
          subcategoryId: subcategory._id,
          subcategory: subcategory.name,
          productTypeId: productType._id,
          productType: productType.name,
          fabricTypeId: fabricType?._id,
          fabricType: fabricType?.name,
          sizes,
          colors,
          isFeatured: row.isFeatured === 'true' || row.isFeatured === true,
          gstPercent: gstPercent,
          imageUrls
        });
        
        await product.save();
        created++;
        console.log(`✓ Created product: ${row.name} with ${imageUrls.length} images`);
        
      } catch (rowError) {
        console.error(`Error processing row:`, rowError);
        errors.push(`${row.name || 'unknown'}: ${rowError.message}`);
        skipped++;
      }
    }
    
    // Don't delete files immediately - let them stay for debugging
    // Instead, we can optionally move them to a permanent location
    
    console.log(`Upload complete: ${created} created, ${skipped} skipped`);
    
    res.status(200).json({
      message: `Upload complete: ${created} products created, ${skipped} skipped`,
      created,
      skipped,
      errors: errors.slice(0, 50),
      imageCount: allImages.length,
      imagePaths: allImages.map(img => img.path)
    });
    
  } catch (error) {
    console.error("❌ bulkExcelUpload error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// ============== CATEGORY MANAGEMENT ==============

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('order');
    res.status(200).json(categories);
  } catch (error) {
    console.error("❌ getCategories error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, order } = req.body;
    console.log(name)
    
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({ name, order });
    await category.save();

    res.status(201).json({ message: 'Category added successfully', category });
  } catch (error) {
    console.error("❌ addCategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, order, isActive } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, order, isActive },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error("❌ updateCategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Also delete associated subcategories and product types
    await Subcategory.deleteMany({ categoryId: req.params.id });
    await ProductType.deleteMany({ subcategoryId: { $in: await Subcategory.find({ categoryId: req.params.id }).distinct('_id') } });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error("❌ deleteCategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============== SUBCATEGORY MANAGEMENT ==============

export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ 
     
      isActive: true 
    }).sort('order');
   
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("❌ getSubcategories error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addSubcategory = async (req, res) => {
  try {
    const { name, categoryId, order } = req.body;
    
    const existing = await Subcategory.findOne({ name, categoryId });
    if (existing) {
      return res.status(400).json({ error: 'Subcategory already exists in this category' });
    }

    const subcategory = new Subcategory({ name, categoryId, order });
    await subcategory.save();

    res.status(201).json({ message: 'Subcategory added successfully', subcategory });
  } catch (error) {
    console.error("❌ addSubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { name, order, isActive } = req.body;
    
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name, order, isActive },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.status(200).json({ message: 'Subcategory updated successfully', subcategory });
  } catch (error) {
    console.error("❌ updateSubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    // Also delete associated product types
    await ProductType.deleteMany({ subcategoryId: req.params.id });

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error("❌ deleteSubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============== PRODUCT TYPE MANAGEMENT ==============

export const getProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ 
      subcategoryId: req.params.subcategoryId,
      isActive: true 
    }).sort('order');
    res.status(200).json(productTypes);
  } catch (error) {
    console.error("❌ getProductTypes error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getALLProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ 
      
      isActive: true 
    }).sort('order');
    res.status(200).json(productTypes);
  } catch (error) {
    console.error("❌ getProductTypes error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const addProductType = async (req, res) => {
  try {
    const { name, subcategoryId, order } = req.body;
    
    const existing = await ProductType.findOne({ name, subcategoryId });
    if (existing) {
      return res.status(400).json({ error: 'Product type already exists in this subcategory' });
    }

    const productType = new ProductType({ name, subcategoryId, order });
    await productType.save();

    res.status(201).json({ message: 'Product type added successfully', productType });
  } catch (error) {
    console.error("❌ addProductType error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProductType = async (req, res) => {
  try {
    const { name, order, isActive } = req.body;
    
    const productType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { name, order, isActive },
      { new: true }
    );

    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }

    res.status(200).json({ message: 'Product type updated successfully', productType });
  } catch (error) {
    console.error("❌ updateProductType error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findByIdAndDelete(req.params.id);
    
    if (!productType) {
      return res.status(404).json({ error: 'Product type not found' });
    }

    res.status(200).json({ message: 'Product type deleted successfully' });
  } catch (error) {
    console.error("❌ deleteProductType error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============== FABRIC TYPE MANAGEMENT ==============

export const getFabricTypes = async (req, res) => {
  try {
    const fabricTypes = await FabricType.find({ isActive: true }).sort('name');
    res.status(200).json(fabricTypes);
  } catch (error) {
    console.error("❌ getFabricTypes error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addFabricType = async (req, res) => {
  try {
    const { name } = req.body;
    
    const existing = await FabricType.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Fabric type already exists' });
    }

    const fabricType = new FabricType({ name });
    await fabricType.save();

    res.status(201).json({ message: 'Fabric type added successfully', fabricType });
  } catch (error) {
    console.error("❌ addFabricType error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateFabricType = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    
    const fabricType = await FabricType.findByIdAndUpdate(
      req.params.id,
      { name, isActive },
      { new: true }
    );

    if (!fabricType) {
      return res.status(404).json({ error: 'Fabric type not found' });
    }

    res.status(200).json({ message: 'Fabric type updated successfully', fabricType });
  } catch (error) {
    console.error("❌ updateFabricType error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteFabricType = async (req, res) => {
  try {
    const fabricType = await FabricType.findByIdAndDelete(req.params.id);
    
    if (!fabricType) {
      return res.status(404).json({ error: 'Fabric type not found' });
    }

    res.status(200).json({ message: 'Fabric type deleted successfully' });
  } catch (error) {
    console.error("❌ deleteFabricType error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============== COLOR & SIZE MANAGEMENT ==============

let globalColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Brown', 'Pink', 'Gray', 'Navy', 'Maroon', 'Teal', 'Olive', 'Coral'];
let globalSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];



export const updateColors = async (req, res) => {
  try {
    const { colors } = req.body;
    globalColors = colors;
    res.status(200).json({ message: 'Colors updated successfully', colors: globalColors });
  } catch (error) {
    console.error("❌ updateColors error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updateSizes = async (req, res) => {
  try {
    const { sizes } = req.body;
    globalSizes = sizes;
    res.status(200).json({ message: 'Sizes updated successfully', sizes: globalSizes });
  } catch (error) {
    console.error("❌ updateSizes error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ProductController.js - Add these functions

// Get subcategories by category ID
export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    const subcategories = await Subcategory.find({ 
      categoryId: categoryId, 
      isActive: true 
    }).sort('order');
    
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("❌ getSubcategoriesByCategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get product types by subcategory ID
export const getProductTypesBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    
    if (!subcategoryId) {
      return res.status(400).json({ error: 'Subcategory ID is required' });
    }
    
    const productTypes = await ProductType.find({ 
      subcategoryId: subcategoryId, 
      isActive: true 
    }).sort('order');
    
    res.status(200).json(productTypes);
  } catch (error) {
    console.error("❌ getProductTypesBySubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get products by subcategory
export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    if (!subcategoryId) {
      return res.status(400).json({ error: 'Subcategory ID is required' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find({ 
      subcategoryId: subcategoryId,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalCount = await Product.countDocuments({ 
      subcategoryId: subcategoryId,
      status: 'active'
    });
    
    res.status(200).json({
      products,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("❌ getProductsBySubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get products by product type
export const getProductsByProductType = async (req, res) => {
  try {
    const { productTypeId } = req.params;
    const { limit = 20, page = 1 } = req.query;
    
    if (!productTypeId) {
      return res.status(400).json({ error: 'Product type ID is required' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find({ 
      productTypeId: productTypeId,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalCount = await Product.countDocuments({ 
      productTypeId: productTypeId,
      status: 'active'
    });
    
    res.status(200).json({
      products,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("❌ getProductsByProductType error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get full category hierarchy with products count
export const getCategoryHierarchy = async (req, res) => {
  try {
    // Get all active categories
    const categories = await Category.find({ isActive: true }).sort('order');
    
    // Build hierarchy
    const hierarchy = [];
    
    for (const category of categories) {
      // Get subcategories for this category
      const subcategories = await Subcategory.find({ 
        categoryId: category._id, 
        isActive: true 
      }).sort('order');
      
      const subcategoriesWithTypes = [];
      
      for (const subcategory of subcategories) {
        // Get product types for this subcategory
        const productTypes = await ProductType.find({ 
          subcategoryId: subcategory._id, 
          isActive: true 
        }).sort('order');
        
        // Get product count for this subcategory
        const productCount = await Product.countDocuments({
          subcategoryId: subcategory._id,
          status: 'active'
        });
        
        subcategoriesWithTypes.push({
          _id: subcategory._id,
          name: subcategory.name,
          productCount,
          productTypes: productTypes.map(type => ({
            _id: type._id,
            name: type.name
          }))
        });
      }
      
      hierarchy.push({
        _id: category._id,
        name: category.name,
        subcategories: subcategoriesWithTypes
      });
    }
    
    res.status(200).json(hierarchy);
  } catch (error) {
    console.error("❌ getCategoryHierarchy error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find({ 
      isFeatured: true,
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
    
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ getFeaturedProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
        { productType: { $regex: q, $options: 'i' } }
      ],
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
    const totalCount = await Product.countDocuments({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
        { productType: { $regex: q, $options: 'i' } }
      ],
      status: 'active'
    });
    
    res.status(200).json({
      products,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      limit: parseInt(limit),
      query: q
    });
  } catch (error) {
    console.error("❌ searchProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};



//Helper function to get color hex code
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
    'coral': '#FF7F50'
  };
  
  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || '#CCCCCC';
};

// ============== COLOR MANAGEMENT ==============

// Get all colors
export const getColors = async (req, res) => {
  try {
    const colors = await Color.find({ isActive: true }).sort('order');
    res.status(200).json(colors.map(c => c.name)); // Return just the names for backward compatibility
  } catch (error) {
    console.error("❌ getColors error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all colors with full details
export const getColorsFull = async (req, res) => {
  try {
    const colors = await Color.find({ isActive: true }).sort('order');
    res.status(200).json(colors);
  } catch (error) {
    console.error("❌ getColorsFull error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add new color
export const addColor = async (req, res) => {
  try {
    const { name, hexCode, order } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Color name is required' });
    }
    
    // Check if color already exists
    const existingColor = await Color.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingColor) {
      return res.status(400).json({ error: 'Color already exists' });
    }
    
    const color = new Color({
      name: name.trim(),
      hexCode: hexCode || getColorHexCode(name),
      order: order || 0
    });
    
    await color.save();
    
    res.status(201).json({ 
      message: '✅ Color added successfully', 
      color 
    });
  } catch (error) {
    console.error("❌ addColor error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update color
export const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hexCode, isActive, order } = req.body;
    
    const color = await Color.findByIdAndUpdate(
      id,
      {
        name: name?.trim(),
        hexCode,
        isActive,
        order
      },
      { new: true }
    );
    
    if (!color) {
      return res.status(404).json({ error: 'Color not found' });
    }
    
    res.status(200).json({ 
      message: '✅ Color updated successfully', 
      color 
    });
  } catch (error) {
    console.error("❌ updateColor error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete color (soft delete by setting isActive false)
export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete - just mark as inactive
    const color = await Color.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!color) {
      return res.status(404).json({ error: 'Color not found' });
    }
    
    res.status(200).json({ 
      message: '✅ Color deleted successfully' 
    });
  } catch (error) {
    console.error("❌ deleteColor error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk update colors (for reordering)
export const updateColorsBulk = async (req, res) => {
  try {
    const { colors } = req.body; // Array of { id, name, hexCode, order, isActive }
    
    if (!Array.isArray(colors)) {
      return res.status(400).json({ error: 'Colors must be an array' });
    }
    
    const updates = [];
    for (const colorData of colors) {
      const updated = await Color.findByIdAndUpdate(
        colorData.id,
        {
          name: colorData.name?.trim(),
          hexCode: colorData.hexCode,
          order: colorData.order,
          isActive: colorData.isActive
        },
        { new: true }
      );
      if (updated) updates.push(updated);
    }
    
    res.status(200).json({ 
      message: '✅ Colors updated successfully', 
      colors: updates 
    });
  } catch (error) {
    console.error("❌ updateColorsBulk error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============== SIZE MANAGEMENT ==============

// Get all sizes
export const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find({ isActive: true }).sort('order');
    res.status(200).json(sizes.map(s => s.name)); // Return just the names for backward compatibility
  } catch (error) {
    console.error("❌ getSizes error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all sizes with full details
export const getSizesFull = async (req, res) => {
  try {
    const sizes = await Size.find({ isActive: true }).sort('order');
    res.status(200).json(sizes);
  } catch (error) {
    console.error("❌ getSizesFull error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add new size
export const addSize = async (req, res) => {
  try {
    const { name, order } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Size name is required' });
    }
    
    // Check if size already exists
    const existingSize = await Size.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingSize) {
      return res.status(400).json({ error: 'Size already exists' });
    }
    
    const size = new Size({
      name: name.trim().toUpperCase(),
      order: order || 0
    });
    
    await size.save();
    
    res.status(201).json({ 
      message: '✅ Size added successfully', 
      size 
    });
  } catch (error) {
    console.error("❌ addSize error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update size
export const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, order } = req.body;
    
    const size = await Size.findByIdAndUpdate(
      id,
      {
        name: name?.trim().toUpperCase(),
        isActive,
        order
      },
      { new: true }
    );
    
    if (!size) {
      return res.status(404).json({ error: 'Size not found' });
    }
    
    res.status(200).json({ 
      message: '✅ Size updated successfully', 
      size 
    });
  } catch (error) {
    console.error("❌ updateSize error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete size (soft delete by setting isActive false)
export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    
    const size = await Size.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!size) {
      return res.status(404).json({ error: 'Size not found' });
    }
    
    res.status(200).json({ 
      message: '✅ Size deleted successfully' 
    });
  } catch (error) {
    console.error("❌ deleteSize error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Bulk update sizes (for reordering)
export const updateSizesBulk = async (req, res) => {
  try {
    const { sizes } = req.body; // Array of { id, name, order, isActive }
    
    if (!Array.isArray(sizes)) {
      return res.status(400).json({ error: 'Sizes must be an array' });
    }
    
    const updates = [];
    for (const sizeData of sizes) {
      const updated = await Size.findByIdAndUpdate(
        sizeData.id,
        {
          name: sizeData.name?.trim().toUpperCase(),
          order: sizeData.order,
          isActive: sizeData.isActive
        },
        { new: true }
      );
      if (updated) updates.push(updated);
    }
    
    res.status(200).json({ 
      message: '✅ Sizes updated successfully', 
      sizes: updates 
    });
  } catch (error) {
    console.error("❌ updateSizesBulk error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============== INITIALIZE DEFAULT COLORS AND SIZES ==============

// Function to initialize default colors and sizes (call this when server starts)
export const initializeDefaultSettings = async () => {
  try {
    // Initialize default colors
    const defaultColors = [
      { name: 'Red', hexCode: '#FF0000', order: 0 },
      { name: 'Blue', hexCode: '#0000FF', order: 1 },
      { name: 'Green', hexCode: '#00FF00', order: 2 },
      { name: 'Black', hexCode: '#000000', order: 3 },
      { name: 'White', hexCode: '#FFFFFF', order: 4 },
      { name: 'Yellow', hexCode: '#FFFF00', order: 5 },
      { name: 'Purple', hexCode: '#800080', order: 6 },
      { name: 'Orange', hexCode: '#FFA500', order: 7 },
      { name: 'Brown', hexCode: '#A52A2A', order: 8 },
      { name: 'Pink', hexCode: '#FFC0CB', order: 9 },
      { name: 'Gray', hexCode: '#808080', order: 10 },
      { name: 'Navy', hexCode: '#000080', order: 11 },
      { name: 'Maroon', hexCode: '#800000', order: 12 },
      { name: 'Teal', hexCode: '#008080', order: 13 },
      { name: 'Olive', hexCode: '#808000', order: 14 },
      { name: 'Coral', hexCode: '#FF7F50', order: 15 }
    ];
    
    for (const color of defaultColors) {
      const existing = await Color.findOne({ 
        name: { $regex: new RegExp(`^${color.name}$`, 'i') } 
      });
      if (!existing) {
        await Color.create(color);
        console.log(`✅ Default color created: ${color.name}`);
      }
    }
    
    // Initialize default sizes
    const defaultSizes = [
      { name: 'XS', order: 0 },
      { name: 'S', order: 1 },
      { name: 'M', order: 2 },
      { name: 'L', order: 3 },
      { name: 'XL', order: 4 },
      { name: 'XXL', order: 5 },
      { name: 'XXXL', order: 6 }
    ];
    
    for (const size of defaultSizes) {
      const existing = await Size.findOne({ 
        name: { $regex: new RegExp(`^${size.name}$`, 'i') } 
      });
      if (!existing) {
        await Size.create(size);
        console.log(`✅ Default size created: ${size.name}`);
      }
    }
    
    console.log('✅ Default colors and sizes initialized');
  } catch (error) {
    console.error('❌ Error initializing default settings:', error);
  }
};


// controllers/productController.js - Add this new function

export const getFilterOptions = async (req, res) => {
  try {
    // Get unique values from products
    const [categories, subcategories, productTypes, fabricTypes, allColors, allSizes] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('subcategory'),
      Product.distinct('productType'),
      Product.distinct('fabricType'),
      Product.distinct('colors'),
      Product.distinct('sizes')
    ]);

    // Get colors from Color model with hex codes
    const colorsFromDb = await Color.find({ isActive: true }).sort('order');
    
    // Get sizes from Size model
    const sizesFromDb = await Size.find({ isActive: true }).sort('order');

    // Get categories with their subcategories and product types
    const categoryHierarchy = await Category.aggregate([
      { $match: { isActive: true } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'subcategories'
        }
      },
      {
        $unwind: {
          path: '$subcategories',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'producttypes',
          localField: 'subcategories._id',
          foreignField: 'subcategoryId',
          as: 'subcategories.productTypes'
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          order: { $first: '$order' },
          subcategories: { $push: '$subcategories' }
        }
      },
      {
        $project: {
          name: 1,
          order: 1,
          subcategories: {
            $filter: {
              input: '$subcategories',
              as: 'sub',
              cond: { $ne: ['$$sub._id', null] }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      categories: categoryHierarchy,
      subcategories: [...new Set(subcategories.filter(Boolean))],
      productTypes: [...new Set(productTypes.filter(Boolean))],
      fabricTypes: [...new Set(fabricTypes.filter(Boolean))],
      colors: colorsFromDb.map(c => ({ name: c.name, hexCode: c.hexCode })),
      sizes: sizesFromDb.map(s => s.name),
      priceRange: {
        min: await Product.findOne().sort('discountedPrice').select('discountedPrice'),
        max: await Product.findOne().sort('-discountedPrice').select('discountedPrice')
      }
    });
  } catch (error) {
    console.error("❌ getFilterOptions error:", error);
    res.status(500).json({ error: error.message });
  }
};