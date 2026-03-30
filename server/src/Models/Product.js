// models/EcommerceProduct.js
import mongoose from "mongoose";

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Subcategory Schema
const SubcategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Product Type Schema
const ProductTypeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Fabric Type Schema
const FabricTypeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Product Schema
const EcommerceProductSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { 
      type: String, 
      required: true,
      trim: true,
      index: true
    },
    description: { 
      type: String,
      trim: true
    },
    
    // Pricing
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    offerPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    offerPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    discountedPrice: {
      type: Number,
      default: 0
    },
    
    // Inventory
    stock: { 
      type: Number, 
      required: true,
      min: 0,
      default: 0
    },
    
    // Physical Attributes
    weight: { 
      type: Number, 
      required: true,
      min: 0,
      default: 0.5
    },
    
    // Hierarchical Categories
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true
    },
    subcategory: {
      type: String,
      required: true
    },
    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductType',
      required: true
    },
    productType: {
      type: String,
      required: true
    },
    fabricTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FabricType'
    },
    fabricType: {
      type: String
    },
    
    // Size & Color Variations
    sizes: [{
      type: String,
      trim: true
    }],
    colors: [{
      type: String,
      trim: true
    }],
    
    // Custom Colors (user-defined with hex codes)
    customColors: [{
      name: { type: String, required: true },
      hexCode: { type: String, default: '#000000' },
      images: [String]
    }],
    
    // Images
    imageUrls: { 
      type: [String], 
      default: [] 
    },
    
    // Status & Flags
    isFeatured: { 
      type: Boolean, 
      default: false 
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'low-stock', 'out-of-stock'],
      default: 'active'
    },
    
    // Ratings
    rating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: { 
      type: Number, 
      default: 0 
    },
    
    // GST
    gstPercent: { 
      type: Number, 
      default: 18,
      min: 0,
      max: 28
    },
    gstAmount: { 
      type: Number, 
      default: 0 
    },
    totalPrice: { 
      type: Number, 
      default: 0 
    },
    
    // Sales & Analytics
    sales: { 
      type: Number, 
      default: 0 
    },
    views: { 
      type: Number, 
      default: 0 
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for better query performance
EcommerceProductSchema.index({ name: 'text', description: 'text' });
EcommerceProductSchema.index({ category: 1, subcategory: 1, productType: 1 });
EcommerceProductSchema.index({ price: 1 });
EcommerceProductSchema.index({ isFeatured: 1 });
EcommerceProductSchema.index({ status: 1 });
EcommerceProductSchema.index({ createdAt: -1 });



// Alternative: Using function without parameters if not needed
 EcommerceProductSchema.pre('save', function() {
//   // Calculate discounted price based on offer percent
    let finalPrice = this.price;
    if (this.offerPercent > 0) {
    const discount = (this.price * this.offerPercent) / 100;
    finalPrice = this.price - discount;
     this.discountedPrice = parseFloat(finalPrice.toFixed(2));
     this.offerPrice = this.discountedPrice;
   } else {
     this.discountedPrice = this.price;
     this.offerPrice = this.price;
   }
   
   // Calculate GST
   const gstMultiplier = this.gstPercent / 100;
   this.gstAmount = parseFloat((this.discountedPrice * gstMultiplier).toFixed(2));
   this.totalPrice = parseFloat((this.discountedPrice + this.gstAmount).toFixed(2));
   
   // Set status based on stock
   if (this.stock <= 0) {
     this.status = 'out-of-stock';
   } else if (this.stock < 10) {
     this.status = 'low-stock';
   } else {
     this.status = 'active';
   }
 });

// Models
export const Category = mongoose.model("Category", CategorySchema);
export const Subcategory = mongoose.model("Subcategory", SubcategorySchema);
export const ProductType = mongoose.model("ProductType", ProductTypeSchema);
export const FabricType = mongoose.model("FabricType", FabricTypeSchema);
export const Product = mongoose.model("EcommerceProduct", EcommerceProductSchema);