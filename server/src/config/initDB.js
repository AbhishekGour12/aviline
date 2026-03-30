// src/config/initDB.js
import { Category, Subcategory, ProductType, FabricType } from '../Models/Product.js';

const defaultCategories = [
  { name: 'Men', order: 1, isActive: true },
  { name: 'Women', order: 2, isActive: true },
  { name: 'Kids', order: 3, isActive: true }
];

const defaultSubcategories = {
  Men: ['Topwear', 'Bottomwear', 'Two Piece', 'Three Piece', 'Footwear', 'Accessories'],
  Women: ['Western', 'Ethnic', 'Footwear', 'Accessories'],
  Kids: ['Girls', 'Boys', 'Footwear', 'Accessories']
};

const defaultProductTypes = {
  'Two Piece': ['Kurta Pajama', 'Shirts', 'T-Shirts'],
  'Topwear': ['Shirts', 'T-Shirts', 'Jackets'],
  'Western': ['Dresses', 'Tops', 'Jeans', 'Skirts'],
  'Ethnic': ['Sarees', 'Kurtis', 'Lehenga', 'Salwar Suit'],
  'Girls': ['Dresses', 'Tops', 'Skirts'],
  'Boys': ['Shirts', 'T-Shirts', 'Shorts']
};

const defaultFabricTypes = [
  'Cotton', 'Cotton Blend', 'Linen', 'Silk', 'Rayon', 'Wool', 'Denim', 'Polyester', 'Velvet'
];

export const initializeDatabase = async () => {
  try {
    console.log('🔍 Checking database initialization...');
    
    // Initialize Categories
    let categories = await Category.find({});
    if (categories.length === 0) {
      console.log('📦 Creating default categories...');
      categories = await Category.insertMany(defaultCategories);
      console.log(`✅ Created ${categories.length} categories`);
    } else {
      console.log(`✅ Found ${categories.length} existing categories`);
    }
    
    // Create category map for easy lookup
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.name, cat);
    });
    
    // Initialize Subcategories
    let subcategories = await Subcategory.find({});
    if (subcategories.length === 0) {
      console.log('📦 Creating default subcategories...');
      const subcategoryDocs = [];
      
      for (const [categoryName, subNames] of Object.entries(defaultSubcategories)) {
        const category = categoryMap.get(categoryName);
        if (category) {
          for (const subName of subNames) {
            subcategoryDocs.push({
              name: subName,
              categoryId: category._id,
              order: subcategoryDocs.length,
              isActive: true
            });
          }
        }
      }
      
      subcategories = await Subcategory.insertMany(subcategoryDocs);
      console.log(`✅ Created ${subcategories.length} subcategories`);
    } else {
      console.log(`✅ Found ${subcategories.length} existing subcategories`);
    }
    
    // Create subcategory map
    const subcategoryMap = new Map();
    subcategories.forEach(sub => {
      const key = `${sub.name}|${sub.categoryId.toString()}`;
      subcategoryMap.set(key, sub);
    });
    
    // Initialize Product Types
    let productTypes = await ProductType.find({});
    if (productTypes.length === 0) {
      console.log('📦 Creating default product types...');
      const productTypeDocs = [];
      
      for (const [subcategoryName, typeNames] of Object.entries(defaultProductTypes)) {
        // Find subcategory by name (case insensitive)
        const subcategory = subcategories.find(s => 
          s.name.toLowerCase() === subcategoryName.toLowerCase()
        );
        
        if (subcategory) {
          for (const typeName of typeNames) {
            productTypeDocs.push({
              name: typeName,
              subcategoryId: subcategory._id,
              order: productTypeDocs.length,
              isActive: true
            });
          }
        }
      }
      
      if (productTypeDocs.length > 0) {
        productTypes = await ProductType.insertMany(productTypeDocs);
        console.log(`✅ Created ${productTypes.length} product types`);
      }
    } else {
      console.log(`✅ Found ${productTypes.length} existing product types`);
    }
    
    // Initialize Fabric Types
    let fabricTypes = await FabricType.find({});
    if (fabricTypes.length === 0) {
      console.log('📦 Creating default fabric types...');
      const fabricTypeDocs = defaultFabricTypes.map((name, index) => ({
        name,
        isActive: true
      }));
      
      fabricTypes = await FabricType.insertMany(fabricTypeDocs);
      console.log(`✅ Created ${fabricTypes.length} fabric types`);
    } else {
      console.log(`✅ Found ${fabricTypes.length} existing fabric types`);
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
    return {
      categories,
      subcategories,
      productTypes,
      fabricTypes
    };
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};