// src/app/products/page.jsx - Corrected version without FaFabric

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaFilter, 
  FaHeart, 
  FaRegHeart, 
  FaStar, 
  FaStarHalfAlt, 
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaEye,
  FaTshirt,
  FaFemale,
  FaTag,
  FaRulerCombined,
  FaPalette,
  FaLayerGroup
} from 'react-icons/fa';

import { ProductApi } from '../lib/ProductApi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Filter Section Component
const FilterSection = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-[#DFE0DC] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#777E5C]">{icon}</span>}
          <span className="text-sm font-semibold text-[#2C3E2B]">{title}</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="text-[#777E5C] text-xs" />
        ) : (
          <FaChevronDown className="text-[#777E5C] text-xs" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 space-y-3 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Price Range Slider Component
const PriceRangeSlider = ({ minPrice, maxPrice, onChange, minLimit = 0, maxLimit = 50000 }) => {
  const [min, setMin] = useState(minPrice || minLimit);
  const [max, setMax] = useState(maxPrice || maxLimit);
  
  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    if (value <= max) {
      setMin(value);
      onChange(value, max);
    }
  };
  
  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    if (value >= min) {
      setMax(value);
      onChange(min, value);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-xs text-[#7A8E6A]">Min</label>
          <input
            type="number"
            value={min}
            onChange={handleMinChange}
            className="w-full px-3 py-2 text-sm border border-[#DFE0DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D1D88D]"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-[#7A8E6A]">Max</label>
          <input
            type="number"
            value={max}
            onChange={handleMaxChange}
            className="w-full px-3 py-2 text-sm border border-[#DFE0DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D1D88D]"
          />
        </div>
      </div>
      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        value={min}
        onChange={handleMinChange}
        className="w-full accent-[#777E5C]"
      />
      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        value={max}
        onChange={handleMaxChange}
        className="w-full accent-[#777E5C]"
      />
    </div>
  );
};

// Color Circle Component
const ColorCircle = ({ color, hexCode, selected, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-8 h-8 rounded-full border-2 transition-all ${
        selected ? 'border-[#777E5C] ring-2 ring-[#D1D88D] ring-offset-1' : 'border-gray-200'
      }`}
      style={{ backgroundColor: hexCode || color }}
      title={color}
    />
  );
};

// Product Card Component
const ProductCard = ({ product, onWishlistToggle, isWishlisted }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  
  const discount = product.offerPercent || 0;
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-400 text-xs" />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-400 text-xs" />);
    }
    return stars;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/product/${product._id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F9FBF7]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0F7E6] to-[#E0EBD0] animate-pulse" />
        )}
        {product.imageUrls && product.imageUrls[0] && (
          <Image
            src={product.imageUrls[0].startsWith('/uploads') 
              ? `${process.env.NEXT_PUBLIC_API}${product.imageUrls[0]}` 
              : product.imageUrls[0]}
            alt={product.name}
            fill
            unoptimized
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#777E5C] text-white text-xs font-bold px-2 py-1 rounded-md">
            {discount}% OFF
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle(product._id);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-600 text-sm hover:text-red-500 transition-colors" />
          )}
        </button>
        
        {/* Quick View Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product._id}`);
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-[#777E5C] text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#777E5C] hover:text-white transition-all"
          >
            <FaEye className="text-xs" />
            Quick View
          </button>
        </motion.div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-[#2C3E2B] line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#777E5C]">₹{product.discountedPrice || product.price}</span>
          {product.offerPercent > 0 && (
            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
        
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>
        )}
        
        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((color, idx) => (
              <div
                key={idx}
                className="w-3 h-3 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Skeleton Loader Component
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="aspect-[3/4]">
        <Skeleton height="100%" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton count={2} />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </div>
    </div>
  );
};

// Main Product Listing Page
const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  
  // Filter Options State
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    subcategories: [],
    productTypes: [],
    fabricTypes: [],
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 50000 }
  });
  
  // Filter State
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    productType: searchParams.get('type') || '',
    fabricType: '',
    minPrice: '',
    maxPrice: '',
    sizes: [],
    colors: []
  });
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(true);
  
  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);
  
  const fetchFilterOptions = async () => {
    try {
      setLoadingFilters(true);
      const options = await ProductApi.getFilterOptions();
      setFilterOptions({
        categories: options.categories || [],
        subcategories: options.subcategories || [],
        productTypes: options.productTypes || [],
        fabricTypes: options.fabricTypes || [],
        colors: options.colors || [],
        sizes: options.sizes || [],
        priceRange: options.priceRange || { min: 0, max: 50000 }
      });
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    } finally {
      setLoadingFilters(false);
    }
  };
  
  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryFilters = {
        search: filters.search,
        category: filters.category,
        subcategory: filters.subcategory,
        productType: filters.productType,
        fabricType: filters.fabricType,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sizes: filters.sizes.length > 0 ? filters.sizes.join(',') : undefined,
        colors: filters.colors.length > 0 ? filters.colors.join(',') : undefined,
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder
      };
      
      // Remove empty filters
      Object.keys(queryFilters).forEach(key => {
        if (!queryFilters[key] || queryFilters[key] === '') {
          delete queryFilters[key];
        }
      });
      
      const response = await ProductApi.getProducts(queryFilters);
      setProducts(response.products);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, sortBy, sortOrder]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  // Handle size filter
  const handleSizeToggle = (size) => {
    setFilters(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
    setCurrentPage(1);
  };
  
  // Handle color filter
  const handleColorToggle = (color) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
    setCurrentPage(1);
  };
  
  // Handle price filter
  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
    setCurrentPage(1);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      productType: '',
      fabricType: '',
      minPrice: '',
      maxPrice: '',
      sizes: [],
      colors: []
    });
    setCurrentPage(1);
  };
  
  // Active filters count
  const activeFiltersCount = Object.keys(filters).filter(key => {
    if (key === 'sizes' || key === 'colors') {
      return filters[key].length > 0;
    }
    return filters[key] && filters[key] !== '';
  }).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7E6] to-[#E0EBD0] pt-[60px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[#7A8E6A]">
            <Link href="/" className="hover:text-[#777E5C] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#777E5C] font-medium">
              {filters.search ? `Search: "${filters.search}"` : 'Products'}
            </span>
          </div>
        </div>
        
        {/* Category Chips - Dynamic from API */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => handleFilterChange('category', '')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !filters.category
                  ? 'bg-[#777E5C] text-white shadow-md'
                  : 'bg-white text-[#777E5C] border border-[#DFE0DC] hover:border-[#777E5C] hover:shadow-sm'
              }`}
            >
              All Products
            </button>
            {filterOptions.categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleFilterChange('category', category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filters.category === category.name
                    ? 'bg-[#777E5C] text-white shadow-md'
                    : 'bg-white text-[#777E5C] border border-[#DFE0DC] hover:border-[#777E5C] hover:shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort and Filter Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <p className="text-sm text-[#7A8E6A]">
            Showing <span className="font-medium text-[#777E5C]">{totalCount}</span> products
          </p>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white border border-[#DFE0DC] rounded-lg text-sm text-[#2C3E2B] focus:outline-none focus:ring-2 focus:ring-[#D1D88D]"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="discountedPrice-asc">Price: Low to High</option>
              <option value="discountedPrice-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="soldCount-desc">Best Selling</option>
            </select>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#DFE0DC] rounded-lg text-sm text-[#777E5C]"
            >
              <FaFilter />
              Filter
              {activeFiltersCount > 0 && (
                <span className="bg-[#777E5C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Main Content - Two Column Layout */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-medium text-[#2C3E2B]">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#777E5C] hover:text-[#5A6E4A]"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Category Filter */}
              <FilterSection title="Category" icon={<FaTag className="text-xs" />}>
                <div className="space-y-2">
                  {filterOptions.categories.map((category) => (
                    <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.name}
                        onChange={() => handleFilterChange('category', category.name)}
                        className="w-4 h-4 accent-[#777E5C]"
                      />
                      <span className="text-sm text-[#5A6E4A]">{category.name}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
              
              {/* Subcategory Filter - Shows only when category is selected */}
              {filters.category && filterOptions.categories.find(c => c.name === filters.category)?.subcategories?.length > 0 && (
                <FilterSection title="Subcategory" icon={<FaFemale className="text-xs" />}>
                  <div className="space-y-2">
                    {filterOptions.categories
                      .find(c => c.name === filters.category)
                      ?.subcategories.map((sub) => (
                        <label key={sub._id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={filters.subcategory === sub.name}
                            onChange={() => handleFilterChange('subcategory', sub.name)}
                            className="w-4 h-4 accent-[#777E5C]"
                          />
                          <span className="text-sm text-[#5A6E4A]">{sub.name}</span>
                        </label>
                      ))}
                  </div>
                </FilterSection>
              )}
              
              {/* Product Type Filter */}
              {filterOptions.productTypes.length > 0 && (
                <FilterSection title="Product Type" icon={<FaTshirt className="text-xs" />}>
                  <div className="space-y-2">
                    {filterOptions.productTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.productType === type}
                          onChange={() => handleFilterChange('productType', filters.productType === type ? '' : type)}
                          className="w-4 h-4 accent-[#777E5C]"
                        />
                        <span className="text-sm text-[#5A6E4A]">{type}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}
              
              {/* Fabric Type Filter */}
              {filterOptions.fabricTypes.length > 0 && (
                <FilterSection title="Fabric Type" icon={<FaLayerGroup className="text-xs" />}>
                  <div className="space-y-2">
                    {filterOptions.fabricTypes.map((fabric) => (
                      <label key={fabric} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fabricType === fabric}
                          onChange={() => handleFilterChange('fabricType', filters.fabricType === fabric ? '' : fabric)}
                          className="w-4 h-4 accent-[#777E5C]"
                        />
                        <span className="text-sm text-[#5A6E4A]">{fabric}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}
              
              {/* Price Filter */}
              <FilterSection title="Price" icon={<span className="text-xs">₹</span>}>
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onChange={handlePriceChange}
                  minLimit={filterOptions.priceRange?.min?.discountedPrice || 0}
                  maxLimit={filterOptions.priceRange?.max?.discountedPrice || 50000}
                />
              </FilterSection>
              
              {/* Size Filter */}
              {filterOptions.sizes.length > 0 && (
                <FilterSection title="Size" icon={<FaRulerCombined className="text-xs" />}>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                          filters.sizes.includes(size)
                            ? 'bg-[#777E5C] text-white border-[#777E5C]'
                            : 'border-[#DFE0DC] text-[#2C3E2B] hover:border-[#777E5C]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </FilterSection>
              )}
              
              {/* Color Filter */}
              {filterOptions.colors.length > 0 && (
                <FilterSection title="Color" icon={<FaPalette className="text-xs" />}>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.colors.map((color) => (
                      <ColorCircle
                        key={color.name}
                        color={color.name}
                        hexCode={color.hexCode}
                        selected={filters.colors.includes(color.name)}
                        onClick={() => handleColorToggle(color.name)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}
            </div>
          </aside>
          
          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-serif text-[#2C3E2B] mb-2">No products found</h3>
                <p className="text-[#7A8E6A] mb-6">Try adjusting your filters or search term</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-[#777E5C] text-white rounded-lg hover:bg-[#5A6E4A] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onWishlistToggle={(id) => {
                        setWishlist(prev =>
                          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                        );
                      }}
                      isWishlisted={wishlist.includes(product._id)}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-[#DFE0DC] rounded-lg text-sm disabled:opacity-50 hover:border-[#777E5C] transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#777E5C] text-white'
                              : 'bg-white border border-[#DFE0DC] hover:border-[#777E5C]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-[#DFE0DC] rounded-lg text-sm disabled:opacity-50 hover:border-[#777E5C] transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white z-[101] lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-[#DFE0DC] p-4 flex items-center justify-between">
                <h3 className="text-lg font-serif font-medium text-[#2C3E2B]">Filters</h3>
                <div className="flex items-center gap-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-[#777E5C]"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-2">
                {/* Mobile Filters - Same as Desktop */}
                <FilterSection title="Category">
                  <div className="space-y-2">
                    {filterOptions.categories.map((category) => (
                      <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category-mobile"
                          checked={filters.category === category.name}
                          onChange={() => handleFilterChange('category', category.name)}
                          className="w-4 h-4 accent-[#777E5C]"
                        />
                        <span className="text-sm text-[#5A6E4A]">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
                
                <FilterSection title="Price">
                  <PriceRangeSlider
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    onChange={handlePriceChange}
                    minLimit={filterOptions.priceRange?.min?.discountedPrice || 0}
                    maxLimit={filterOptions.priceRange?.max?.discountedPrice || 50000}
                  />
                </FilterSection>
                
                <FilterSection title="Size">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                          filters.sizes.includes(size)
                            ? 'bg-[#777E5C] text-white border-[#777E5C]'
                            : 'border-[#DFE0DC] text-[#2C3E2B]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </FilterSection>
                
                <FilterSection title="Color">
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.colors.map((color) => (
                      <ColorCircle
                        key={color.name}
                        color={color.name}
                        hexCode={color.hexCode}
                        selected={filters.colors.includes(color.name)}
                        onClick={() => handleColorToggle(color.name)}
                      />
                    ))}
                  </div>
                </FilterSection>
                
                <FilterSection title="Product Type">
                  <div className="space-y-2">
                    {filterOptions.productTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.productType === type}
                          onChange={() => handleFilterChange('productType', filters.productType === type ? '' : type)}
                          className="w-4 h-4 accent-[#777E5C]"
                        />
                        <span className="text-sm text-[#5A6E4A]">{type}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
                
                <FilterSection title="Fabric Type">
                  <div className="space-y-2">
                    {filterOptions.fabricTypes.map((fabric) => (
                      <label key={fabric} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fabricType === fabric}
                          onChange={() => handleFilterChange('fabricType', filters.fabricType === fabric ? '' : fabric)}
                          className="w-4 h-4 accent-[#777E5C]"
                        />
                        <span className="text-sm text-[#5A6E4A]">{fabric}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
              
              <div className="sticky bottom-0 bg-white border-t border-[#DFE0DC] p-4">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-3 bg-[#777E5C] text-white rounded-lg font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;