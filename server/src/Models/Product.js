// models/EcommerceProduct.js
import mongoose from "mongoose";

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
      
    },
    length: { type: Number, default: 0 },
    breadth: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    
    // Categorization
    category: { 
      type: String, 
      required: true,
      trim: true,
      index: true
    },
    subcategory: { 
      type: String,
      required: true,
      trim: true
    },
    
    // Available categories (admin editable)
    availableCategories: {
      type: Map,
      of: [String],
      default: {
        'Wool': ['Jumpers', 'Cardigans', 'Scarves', 'Hats'],
        'Cotton': ['T-Shirts', 'Shirts', 'Dresses', 'Pants'],
        'Denim': ['Jeans', 'Jackets', 'Shorts', 'Skirts'],
        'Leather': ['Jackets', 'Bags', 'Belts', 'Shoes'],
        'Linen': ['Shirts', 'Pants', 'Dresses', 'Suits']
      }
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
    
    // Available sizes (global list)
    availableSizes: {
      type: [String],
      default: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    },
    
    // Available colors (global list)
    availableColors: {
      type: [String],
      default: [
        'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange',
        'Brown', 'Pink', 'Gray', 'Navy', 'Maroon', 'Teal', 'Olive', 'Coral'
      ]
    },
    
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
EcommerceProductSchema.index({ category: 1, subcategory: 1 });
EcommerceProductSchema.index({ price: 1 });
EcommerceProductSchema.index({ isFeatured: 1 });
EcommerceProductSchema.index({ status: 1 });
EcommerceProductSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate derived fields
EcommerceProductSchema.pre('save', function (next) {
  // Calculate discounted price based on offer percent
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

// Static method to get available categories
EcommerceProductSchema.statics.getCategories = async function() {
  const categories = await this.aggregate([
    { $match: { status: 'active' } },
    { $group: { 
      _id: { category: "$category", subcategory: "$subcategory" } 
    }},
    { $group: { 
      _id: "$_id.category", 
      subcategories: { $addToSet: "$_id.subcategory" } 
    }},
    { $sort: { _id: 1 } }
  ]);
  
  const result = {};
  categories.forEach(cat => {
    result[cat._id] = cat.subcategories;
  });
  
  return result;
};

// Static method to get available colors
EcommerceProductSchema.statics.getColors = async function() {
  const colors = await this.aggregate([
    { $unwind: "$colors" },
    { $group: { _id: "$colors" } },
    { $sort: { _id: 1 } }
  ]);
  
  return colors.map(c => c._id);
};

// Static method to get available sizes
EcommerceProductSchema.statics.getSizes = async function() {
  const sizes = await this.aggregate([
    { $unwind: "$sizes" },
    { $group: { _id: "$sizes" } },
    { $sort: { _id: 1 } }
  ]);
  
  return sizes.map(s => s._id);
};

const Product = mongoose.model("EcommerceProduct", EcommerceProductSchema);

export default Product;