// controllers/ProductController.js
import Product from "../Models/Product.js";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";
const XLSX = xlsx;

// Helper function to calculate pricing
const calculatePricing = ({
  price,
  offerPercent = 0,
  gstPercent = 18,
}) => {
  const basePrice = Number(price);
  const discount = offerPercent > 0 ? (basePrice * offerPercent) / 100 : 0;
  const discountedPrice = Number((basePrice - discount).toFixed(2));
  const gstAmount = Number(((discountedPrice * gstPercent) / 100).toFixed(2));
  const totalPrice = Number((discountedPrice + gstAmount).toFixed(2));

  return {
    discountedPrice,
    gstAmount,
    totalPrice,
  };
};

// ✅ Get all products with filters
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      subcategory = "",
      minPrice,
      maxPrice,
      isFeatured,
      sortBy = "createdAt",
      order = "desc",
      status = "",
      sizes = "",
      colors = ""
    } = req.query;
    
    // Build MongoDB filter
    const filter = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (isFeatured !== undefined && isFeatured !== "") {
      filter.isFeatured = isFeatured === "true";
    }

    // Status filter
    if (status) filter.status = status;

    // Sizes filter
    if (sizes) {
      const sizeArray = sizes.split(',');
      filter.sizes = { $in: sizeArray };
    }

    // Colors filter
    if (colors) {
      const colorArray = colors.split(',');
      filter.colors = { $in: colorArray };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    // Fetch data
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      currentPage: Number(page),
      totalPages,
      totalCount,
      limit: Number(limit),
      products,
    });
  } catch (error) {
    console.error("❌ getProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error("❌ getProductById error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add single product
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.product || "{}");
    const uploadedFiles = req.files || [];

    // Process uploaded images
    const imageUrls = uploadedFiles.map(
      (file) => `/uploads/products/${file.filename}`
    );

    // Calculate pricing
    const offerPercent = Number(productData.offerPercent) || 0;
    const gstPercent = Number(productData.gstPercent) || 18;
    const pricing = calculatePricing({
      price: productData.price,
      offerPercent,
      gstPercent,
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

    // Remaining images are main product images
    const mainImages = imageUrls.slice(imageIndex);

    // Create product
    const product = new Product({
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
      weight: Number(productData.weight) || 0.5,
      offerPercent,
      discountedPrice: pricing.discountedPrice,
      gstPercent,
      gstAmount: pricing.gstAmount,
      totalPrice: pricing.totalPrice,
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

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = req.body;
    const uploadedFiles = req.files || [];

    // Process new uploaded images
    const newImageUrls = uploadedFiles.map(
      (file) => `/uploads/products/${file.filename}`
    );

    // Calculate pricing if price or offer percent changed
    const price = Number(productData.price) || product.price;
    const offerPercent = Number(productData.offerPercent) || product.offerPercent || 0;
    const gstPercent = Number(productData.gstPercent) || product.gstPercent || 18;

    const pricing = calculatePricing({
      price,
      offerPercent,
      gstPercent,
    });

    // Handle existing images
    let imageUrls = product.imageUrls;
    if (productData.existingImages) {
      const existingImages = JSON.parse(productData.existingImages || "[]");
      imageUrls = [...existingImages, ...newImageUrls];
    } else {
      imageUrls = [...product.imageUrls, ...newImageUrls];
    }

    // Handle custom colors
    let customColors = product.customColors;
    if (productData.customColors) {
      customColors = JSON.parse(productData.customColors);
    }

    // Parse sizes and colors
    let sizes = product.sizes;
    let colors = product.colors;
    
    if (productData.sizes) {
      sizes = typeof productData.sizes === 'string' 
        ? JSON.parse(productData.sizes) 
        : productData.sizes;
    }
    
    if (productData.colors) {
      colors = typeof productData.colors === 'string' 
        ? JSON.parse(productData.colors) 
        : productData.colors;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: productData.name || product.name,
        description: productData.description || product.description,
        price,
        offerPercent,
        discountedPrice: pricing.discountedPrice,
        stock: productData.stock !== undefined ? Number(productData.stock) : product.stock,
        category: productData.category || product.category,
        subcategory: productData.subcategory || product.subcategory,
        weight: productData.weight || product.weight,
        sizes,
        colors,
        customColors,
        imageUrls,
        isFeatured: productData.isFeatured === "true" || productData.isFeatured === true,
        rating: productData.rating || product.rating,
        gstPercent,
        gstAmount: pricing.gstAmount,
        totalPrice: pricing.totalPrice
      },
      { new: true }
    );

    res.json({
      message: "✅ Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("❌ updateProduct error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete associated images from filesystem
    const deleteImages = (imageUrls) => {
      if (imageUrls && imageUrls.length > 0) {
        imageUrls.forEach(imageUrl => {
          const filename = path.basename(imageUrl);
          const filePath = path.join(process.cwd(), 'uploads', 'products', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    };

    deleteImages(product.imageUrls);
    
    // Delete custom color images
    if (product.customColors && product.customColors.length > 0) {
      product.customColors.forEach(color => {
        deleteImages(color.images);
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("❌ deleteProduct error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Bulk add products with images
export const addBulkProductsWithImages = async (req, res) => {
  try {
    const productsData = JSON.parse(req.body.products);
    const uploadedFiles = req.files || [];

    const imageUrls = uploadedFiles.map(
      (file) => `/uploads/products/${file.filename}`
    );

    let fileIndex = 0;
    const processedProducts = [];
    const errors = [];

    for (let i = 0; i < productsData.length; i++) {
      try {
        const product = productsData[i];
        const imageCount = product.imageFilesCount || 0;
        
        const productImages = imageUrls.slice(
          fileIndex,
          fileIndex + imageCount
        );
        fileIndex += imageCount;

        const offerPercent = Number(product.offerPercent) || 0;
        const gstPercent = Number(product.gstPercent) || 18;
        
        const pricing = calculatePricing({
          price: product.price,
          offerPercent,
          gstPercent,
        });

        // Handle custom colors
        const customColors = product.customColors || [];

        const newProduct = new Product({
          name: product.name,
          description: product.description || "",
          price: Number(product.price),
          offerPercent,
          discountedPrice: pricing.discountedPrice,
          stock: Number(product.stock),
          category: product.category,
          subcategory: product.subcategory,
          weight: Number(product.weight) || 0.5,
          sizes: product.sizes || [],
          colors: product.colors || [],
          customColors,
          imageUrls: productImages,
          isFeatured: product.isFeatured || false,
          rating: Number(product.rating) || 0,
          gstPercent,
          gstAmount: pricing.gstAmount,
          totalPrice: pricing.totalPrice
        });

        await newProduct.save();
        processedProducts.push(newProduct);
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    res.status(201).json({
      message: `✅ ${processedProducts.length} products added successfully`,
      count: processedProducts.length,
      products: processedProducts,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error("❌ Bulk add error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Bulk upload via Excel
export const uploadBulkProductsWithImages = async (req, res) => {
  try {
    console.log("🟢 Files received:", Object.keys(req.files || {}));

    const excelFile = req.files?.excelFile?.[0];
    const imageFiles = req.files?.productImages || [];

    if (!excelFile) {
      return res.status(400).json({ error: "Excel file is required" });
    }

    // Validate Excel format
    const excelExt = path.extname(excelFile.originalname).toLowerCase();
    if (![".xlsx", ".xls", ".csv"].includes(excelExt)) {
      fs.unlinkSync(excelFile.path);
      return res.status(400).json({ error: "Invalid Excel file format" });
    }

    // Read Excel
    const workbook = XLSX.readFile(excelFile.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📘 Processing ${rawData.length} rows from Excel`);

    const products = [];
    const errors = [];

    for (let i = 0; i < rawData.length; i++) {
      try {
        // Normalize headers
        const row = {};
        for (const key in rawData[i]) {
          row[key.trim().toLowerCase()] = rawData[i][key];
        }

        // Required fields
        const required = ["name", "price", "stock", "category", "subcategory"];
        const missing = required.filter((f) => !row[f]);
        if (missing.length) {
          errors.push(
            `Row ${i + 2}: Missing required fields (${missing.join(", ")})`
          );
          continue;
        }

        // Parse numeric values
        const price = Number(row.price);
        const stock = Number(row.stock);
        const weight = Number(row.weight) || 0.5;
        const rating = Number(row.rating) || 0;
        const gstPercent = Number(row.gstpercent) || 18;
        const offerPercent = Number(row.offerpercent) || 0;

        if (price <= 0 || isNaN(price)) {
          errors.push(`Row ${i + 2}: Invalid price`);
          continue;
        }

        if (stock < 0 || isNaN(stock)) {
          errors.push(`Row ${i + 2}: Invalid stock`);
          continue;
        }

        const pricing = calculatePricing({
          price,
          offerPercent,
          gstPercent,
        });

        // Parse sizes and colors
        const sizes = row.sizes ? row.sizes.split(',').map(s => s.trim()) : [];
        const colors = row.colors ? row.colors.split(',').map(c => c.trim()) : [];

        // Image matching
        const productImages = [];
        if (row.images) {
          const imageNames = row.images
            .split(",")
            .map((n) => n.trim().toLowerCase());

          for (const imgName of imageNames) {
            const img = imageFiles.find(
              (f) => f.originalname.toLowerCase() === imgName.toLowerCase()
            );

            if (img) {
              const ext = path.extname(img.originalname);
              const uniqueName = `product-${Date.now()}-${Math.round(
                Math.random() * 1e9
              )}${ext}`;

              const targetPath = path.join("uploads", "products", uniqueName);
              fs.mkdirSync(path.dirname(targetPath), { recursive: true });
              fs.renameSync(img.path, targetPath);

              productImages.push(`/uploads/products/${uniqueName}`);
            } else {
              errors.push(`Row ${i + 2}: Image "${imgName}" not found`);
            }
          }
        }

        // Parse custom colors if present
        let customColors = [];
        if (row.customcolors) {
          try {
            customColors = JSON.parse(row.customcolors);
          } catch (e) {
            // If not JSON, try simple format: color1:hex1,color2:hex2
            const colorPairs = row.customcolors.split(',').map(p => p.trim());
            customColors = colorPairs.map(pair => {
              const [name, hex] = pair.split(':');
              return { name: name.trim(), hexCode: hex?.trim() || '#000000', images: [] };
            });
          }
        }

        // Final product object
        const productData = {
          name: row.name.toString().trim(),
          description: (row.description || "").toString().trim(),
          price,
          offerPercent,
          discountedPrice: pricing.discountedPrice,
          stock,
          category: row.category.toString().trim(),
          subcategory: row.subcategory.toString().trim(),
          weight,
          sizes,
          colors,
          customColors,
          gstPercent,
          gstAmount: pricing.gstAmount,
          rating,
          isFeatured:
            row.isfeatured === "TRUE" ||
            row.isfeatured === true ||
            row.isfeatured === "true",
          imageUrls: productImages,
          totalPrice: pricing.totalPrice,
        };

        const product = await Product.create(productData);
        products.push(product);

        console.log(`✅ Added product: ${product.name}`);
      } catch (err) {
        console.error(`❌ Row ${i + 2} error:`, err.message);
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }

    // Cleanup temp files
    try {
      if (fs.existsSync(excelFile.path)) fs.unlinkSync(excelFile.path);
      imageFiles.forEach((f) => fs.existsSync(f.path) && fs.unlinkSync(f.path));
    } catch (cleanupErr) {
      console.warn("⚠️ Cleanup error:", cleanupErr.message);
    }

    // Response
    if (errors.length > 0) {
      return res.status(207).json({
        message: "Uploaded with partial errors",
        created: products.length,
        errors,
        products,
      });
    }

    res.status(201).json({
      message: `${products.length} products uploaded successfully`,
      products,
    });
  } catch (error) {
    console.error("💥 Excel upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get available categories
export const getCategories = async (req, res) => {
  try {
    // Get the first product to retrieve available categories
    const product = await Product.findOne();
    const categories = product?.availableCategories || {
      'Wool': ['Jumpers', 'Cardigans', 'Scarves', 'Hats'],
      'Cotton': ['T-Shirts', 'Shirts', 'Dresses', 'Pants'],
      'Denim': ['Jeans', 'Jackets', 'Shorts', 'Skirts'],
      'Leather': ['Jackets', 'Bags', 'Belts', 'Shoes'],
      'Linen': ['Shirts', 'Pants', 'Dresses', 'Suits']
    };
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update categories
export const updateCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    
    // Update all products with the new categories structure
    await Product.updateMany(
      {},
      { $set: { availableCategories: categories } }
    );
    
    res.json({ message: "Categories updated successfully", categories });
  } catch (error) {
    console.error("❌ updateCategories error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add new category
export const addCategory = async (req, res) => {
  try {
    const { category, subcategories } = req.body;
    
    const product = await Product.findOne();
    if (product) {
      const updatedCategories = { ...product.availableCategories };
      updatedCategories[category] = subcategories || [];
      
      await Product.updateMany(
        {},
        { $set: { availableCategories: updatedCategories } }
      );
    }
    
    res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("❌ addCategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const product = await Product.findOne();
    if (product) {
      const updatedCategories = { ...product.availableCategories };
      delete updatedCategories[category];
      
      await Product.updateMany(
        {},
        { $set: { availableCategories: updatedCategories } }
      );
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("❌ deleteCategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add subcategory
export const addSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.body;
    
    const product = await Product.findOne();
    if (product && product.availableCategories[category]) {
      const updatedCategories = { ...product.availableCategories };
      if (!updatedCategories[category].includes(subcategory)) {
        updatedCategories[category] = [...updatedCategories[category], subcategory];
        
        await Product.updateMany(
          {},
          { $set: { availableCategories: updatedCategories } }
        );
      }
    }
    
    res.json({ message: "Subcategory added successfully" });
  } catch (error) {
    console.error("❌ addSubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    
    const product = await Product.findOne();
    if (product && product.availableCategories[category]) {
      const updatedCategories = { ...product.availableCategories };
      updatedCategories[category] = updatedCategories[category].filter(
        sub => sub !== subcategory
      );
      
      await Product.updateMany(
        {},
        { $set: { availableCategories: updatedCategories } }
      );
    }
    
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("❌ deleteSubcategory error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get available colors
export const getColors = async (req, res) => {
  try {
    const product = await Product.findOne();
    const colors = product?.availableColors || [
      'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange',
      'Brown', 'Pink', 'Gray', 'Navy', 'Maroon', 'Teal', 'Olive', 'Coral'
    ];
    
    res.json(colors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update available colors
export const updateColors = async (req, res) => {
  try {
    const { colors } = req.body;
    
    await Product.updateMany(
      {},
      { $set: { availableColors: colors } }
    );
    
    res.json({ message: "Colors updated successfully", colors });
  } catch (error) {
    console.error("❌ updateColors error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get available sizes
export const getSizes = async (req, res) => {
  try {
    const product = await Product.findOne();
    const sizes = product?.availableSizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    
    res.json(sizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update available sizes
export const updateSizes = async (req, res) => {
  try {
    const { sizes } = req.body;
    
    await Product.updateMany(
      {},
      { $set: { availableSizes: sizes } }
    );
    
    res.json({ message: "Sizes updated successfully", sizes });
  } catch (error) {
    console.error("❌ updateSizes error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update product stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { stock: Number(stock) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "✅ Stock updated successfully",
      product
    });
  } catch (error) {
    console.error("❌ updateStock error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Toggle featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { isFeatured: isFeatured === true || isFeatured === "true" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: `✅ Product ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      product
    });
  } catch (error) {
    console.error("❌ toggleFeatured error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    
    const products = await Product.find({ 
      stock: { $lt: threshold },
      status: { $ne: 'out-of-stock' }
    }).sort({ stock: 1 });

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    console.error("❌ getLowStockProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};