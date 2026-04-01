"use client";
import React, { useRef, useState, useEffect } from 'react';
import { FaRegHeart, FaHeart, FaShareAlt, FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { ProductApi } from '../../../lib/ProductApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const BestSellers = () => {
  const scrollRef = useRef(null);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Fetch featured products (isFeatured = true)
      const response = await ProductApi.getProducts({ 
        isFeatured: true, 
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setProducts(response.products);
      
      // After fetching products, get their like status and counts
      await fetchProductsLikeStatus(response.products);
      await fetchProductsLikeCounts(response.products);
      
      setError(null);
    } catch (err) {
     // console.error('Failed to fetch featured products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch like status for all products
  const fetchProductsLikeStatus = async (productsList) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // User not logged in

      const likeStatusPromises = productsList.map(async (product) => {
        try {
          const response = await ProductApi.checkUserInterest(product._id);
          return { productId: product._id, isLiked: response.isLiked };
        } catch (error) {
          //console.error(`Failed to fetch like status for product ${product._id}:`, error);
          return { productId: product._id, isLiked: false };
        }
      });

      const results = await Promise.all(likeStatusPromises);
      const likedMap = {};
      results.forEach(({ productId, isLiked }) => {
        likedMap[productId] = isLiked;
      });
      setLikedProducts(likedMap);
    } catch (error) {
      //console.error('Error fetching like statuses:', error);
    }
  };

  // Fetch like counts for all products
  const fetchProductsLikeCounts = async (productsList) => {
    try {
      const countPromises = productsList.map(async (product) => {
        try {
          const response = await ProductApi.getProductLikesCount(product._id);
          return { productId: product._id, count: response.count };
        } catch (error) {
          //console.error(`Failed to fetch like count for product ${product._id}:`, error);
          return { productId: product._id, count: 0 };
        }
      });

      const results = await Promise.all(countPromises);
      const countsMap = {};
      results.forEach(({ productId, count }) => {
        countsMap[productId] = count;
      });
      setLikeCounts(countsMap);
    } catch (error) {
     // console.error('Error fetching like counts:', error);
    }
  };

  // Handle like/unlike
  const handleWishlistClick = async (e, productId) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login or show login modal
        router.push('/Login');
        return;
      }

      const isCurrentlyLiked = likedProducts[productId] || false;
      
      // Optimistic update
      setLikedProducts(prev => ({
        ...prev,
        [productId]: !isCurrentlyLiked
      }));
      
      // Optimistic update for count
      setLikeCounts(prev => ({
        ...prev,
        [productId]: isCurrentlyLiked 
          ? (prev[productId] || 0) - 1 
          : (prev[productId] || 0) + 1
      }));

      // API call
      if (!isCurrentlyLiked) {
        await ProductApi.addUserInterest(productId);
      } else {
        await ProductApi.removeUserInterest(productId);
      }
      
    } catch (error) {
      // Revert on error
      
      
      // Revert optimistic updates
      const isCurrentlyLiked = likedProducts[productId] || false;
      setLikedProducts(prev => ({
        ...prev,
        [productId]: isCurrentlyLiked
      }));
      
      setLikeCounts(prev => ({
        ...prev,
        [productId]: isCurrentlyLiked 
          ? (prev[productId] || 0) + 1 
          : (prev[productId] || 0) - 1
      }));
      
      alert('Failed to update like status. Please try again.');
    }
  };

  const handleShareClick = (e, product) => {
    e.stopPropagation();
    // Handle share functionality
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: `${window.location.origin}/products?type=${encodeURIComponent(product.productType)}`
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/products?type=${encodeURIComponent(product.productType)}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 1.5 
        : scrollLeft + clientWidth / 1.5;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleProductClick = (product) => {
    const queryParams = new URLSearchParams();
    
    if (product.productType) {
      queryParams.set('type', product.productType);
    }
    
    if (product.category) {
      queryParams.set('category', product.category);
    }
    
    if (product.subcategory) {
      queryParams.set('subcategory', product.subcategory);
    }
    
    const queryString = queryParams.toString();
    const redirectUrl = queryString ? `/products?${queryString}` : '/products';
    
    router.push(redirectUrl);
  };

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-xs" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300 text-xs" />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="max-w-[1460px] mx-auto py-10">
        <div className="text-3xl font-serif font-thin text-gray-800 mb-4">#Best Sellers</div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#777E5C]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1460px] mx-auto py-10">
        <div className="text-3xl font-serif font-thin text-gray-800 mb-4">#Best Sellers</div>
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
          <button 
            onClick={fetchFeaturedProducts}
            className="mt-4 px-4 py-2 bg-[#777E5C] text-white rounded-lg hover:bg-[#5A6E4A] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-[1460px] mx-auto py-10">
        <div className="text-3xl font-serif font-thin text-gray-800 mb-4">#Best Sellers</div>
        <div className="text-center py-10 text-gray-500">
          No featured products available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1460px] mx-auto py-10 relative group">
      
      {/* Desktop Navigation Arrows */}
      <button 
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 shadow-lg rounded-full items-center justify-center text-gray-800 hover:bg-[#4ccb35] hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
      >
        <FaChevronLeft />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 shadow-lg rounded-full items-center justify-center text-gray-800 hover:bg-[#4ccb35] hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
      >
        <FaChevronRight />
      </button>
      
      <div className="text-3xl font-serif font-thin text-gray-800 mb-4 max-sm:text-2xl max-md:p-3">
        #Best Sellers
      </div>
      
      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {products.map((item) => (
          <div 
            key={item._id} 
            onClick={() => handleProductClick(item)}
            className="flex-none w-[280px] sm:w-[330px] bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col snap-start shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
          >
            {/* 1. Header: Product Name */}
            <div className="p-3 flex items-center gap-2 border-b border-gray-50">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1">
                  {item.name}
                </h3>
                {item.productType && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {item.productType}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Image Collage Section */}
            <div className="flex px-2 gap-1 h-[320px] sm:h-[380px]">
              <div className="w-[68%] h-full bg-gray-50 overflow-hidden rounded-l-md">
                {item.imageUrls && item.imageUrls[0] ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.imageUrls[0]}`}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="w-[32%] flex flex-col gap-1 h-full">
                {/* First side image */}
                <div className="h-1/3 bg-gray-50 overflow-hidden rounded-tr-md">
                  {item.imageUrls && item.imageUrls[1] ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.imageUrls[1]}`}
                        alt={`${item.name} view 2`}
                        fill
                        unoptimized
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Second side image */}
                <div className="h-1/3 bg-gray-50 overflow-hidden">
                  {item.imageUrls && item.imageUrls[2] ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.imageUrls[2]}`}
                        alt={`${item.name} view 3`}
                        fill
                        unoptimized
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Count badge */}
                <div className="h-1/3 bg-gray-900 relative overflow-hidden rounded-br-md">
                  {item.imageUrls && item.imageUrls[0] ? (
                    <>
                      <div className="relative w-full h-full">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.imageUrls[0]}`}
                          alt={`${item.name} overlay`}
                          fill
                          unoptimized
                          className="object-cover opacity-40"
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <span className="text-lg font-bold">
                          {item.colors?.length || 0}
                        </span>
                        <span className="text-[8px] uppercase font-medium">Colors</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold">
                        {item.sizes?.length || 0}
                      </span>
                      <span className="text-[8px] uppercase font-medium">Variants</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Footer */}
            <div className="p-4 mt-auto space-y-2">
              {/* Price Section */}
              <div className="flex items-center justify-between">
                <div>
                  {item.offerPercent > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#777E5C]">
                        {formatPrice(item.discountedPrice || item.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        -{item.offerPercent}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-[#777E5C]">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Like button with count */}
                  <div className="flex items-center gap-1  p-1">
                    <button
                      onClick={(e) => handleWishlistClick(e, item._id)}
                      className="text-gray-400 hover:text-[#d41d40] transition-colors hover:cursor-pointer"
                    >
                      {likedProducts[item._id] ? (
                        <FaHeart className="text-lg text-[#d41d40] overflow-hidden" />
                      ) : (
                        <FaRegHeart className="text-lg" />
                      )}
                    </button>
                    {likeCounts[item._id] > 0 && (
                      <span className="text-xs text-gray-500 ml-2">
                        {likeCounts[item._id]}
                      </span>
                    )}
                  </div>
                  <FaShareAlt 
                    className="text-md cursor-pointer hover:text-black transition-colors" 
                    onClick={(e) => handleShareClick(e, item)}
                  />
                </div>
              </div>
              
              {/* Rating Section */}
              {item.rating > 0 && (
                <div className="flex items-center justify-between">
                  {renderRatingStars(item.rating)}
                  {item.stock > 0 ? (
                    <span className="text-xs text-green-600">In Stock</span>
                  ) : (
                    <span className="text-xs text-red-500">Out of Stock</span>
                  )}
                </div>
              )}
              
              {/* Category Info */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span>{item.category}</span>
                <span>•</span>
                <span>{item.subcategory}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;