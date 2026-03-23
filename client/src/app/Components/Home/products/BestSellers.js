"use client";
import React, { useRef } from 'react';
import { FaRegHeart, FaShareAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const products = [
  { id: 1, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", sideImgs: ["https://images.unsplash.com/photo-1554412930-c74f639c8a7b?w=200", "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=200"], count: "+27" },
  { id: 2, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1539109132381-3151b8a77dd3?w=500", sideImgs: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200"], count: "+28" },
  { id: 3, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500", sideImgs: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=200", "https://images.unsplash.com/photo-1598533123413-82c597c75825?w=200"], count: "+25" },
  { id: 4, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500", sideImgs: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200", "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=200"], count: "+27" },
  { id: 5, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", sideImgs: ["https://images.unsplash.com/photo-1554412930-c74f639c8a7b?w=200", "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=200"], count: "+12" },
  { id: 6, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1539109132381-3151b8a77dd3?w=500", sideImgs: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200"], count: "+15" },
];

const BestSellers = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 1.5 
        : scrollLeft + clientWidth / 1.5;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1460px] mx-auto py-10 relative group">
      
      {/* Desktop Navigation Arrows */}
      <button 
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 shadow-lg rounded-full items-center justify-center text-gray-800 hover:bg-[#d41d40] hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
      >
        <FaChevronLeft />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 shadow-lg rounded-full items-center justify-center text-gray-800 hover:bg-[#d41d40] hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
      >
        <FaChevronRight />
      </button>
       <div className="text-3xl font-serif font-thin text-gray-800 mb-4 max-sm:text-2xl max-md:p-3">#Best Sellers</div>
      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
       
        {products.map((item) => (
          <div 
            key={item.id} 
            className="flex-none w-[280px] sm:w-[330px] bg-white border border-gray-100 rounded-xl overflow-hidden flex flex-col snap-start shadow-sm"
          >
            {/* 1. Header: Author Info */}
            <div className="p-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${item.id}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase">
                By <span className="text-black">{item.author}</span>
              </div>
            </div>

            {/* 2. Image Collage Section */}
            <div className="flex px-2 gap-1 h-[320px] sm:h-[380px]">
              <div className="w-[68%] h-full bg-gray-50 overflow-hidden rounded-l-md">
                <img src={item.mainImg} alt="main" className="w-full h-full object-cover" />
              </div>
              <div className="w-[32%] flex flex-col gap-1 h-full">
                {item.sideImgs.slice(0, 2).map((img, idx) => (
                  <div key={idx} className="h-1/3 bg-gray-50 overflow-hidden rounded-tr-md">
                    <img src={img} alt="variant" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="h-1/3 bg-gray-900 relative overflow-hidden rounded-br-md">
                   <img src={item.sideImgs[0]} alt="variant" className="w-full h-full object-cover opacity-40" />
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-lg font-bold">{item.count}</span>
                    <span className="text-[8px] uppercase font-medium">Products</span>
                   </div>
                </div>
              </div>
            </div>

            {/* 3. Footer */}
            <div className="p-4 mt-auto flex items-center justify-between border-t border-gray-50">
              <h3 className="text-[11px] font-bold text-gray-800 uppercase">
                Aviline Exclusive Story
              </h3>
              <div className="flex items-center gap-3 text-gray-400">
                <FaRegHeart className="text-lg cursor-pointer hover:text-[#d41d40] transition-colors" />
                <FaShareAlt className="text-md cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;