"use client";
import React from 'react';
import { FaRegHeart, FaShareAlt } from 'react-icons/fa';

const products = [
  { id: 1, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", sideImgs: ["https://images.unsplash.com/photo-1554412930-c74f639c8a7b?w=200", "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=200"], count: "+27" },
  { id: 2, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1539109132381-3151b8a77dd3?w=500", sideImgs: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200"], count: "+28" },
  { id: 3, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500", sideImgs: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=200", "https://images.unsplash.com/photo-1598533123413-82c597c75825?w=200"], count: "+25" },
  { id: 4, author: "Ankita Manot", mainImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500", sideImgs: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200", "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=200"], count: "+27" },
];

const ProductSection = () => {
  return (
    <div className="max-w-[1460px] mx-auto px-4 py-10 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        {products.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col ">
            
            {/* 1. Header: Author Info */}
            <div className="p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                <img src="/api/placeholder/32/32" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                By <span className="text-black">{item.author}</span>
              </div>
            </div>

            {/* 2. Image Collage Section */}
            <div className="flex px-3 gap-1 h-[320px]">
              {/* Main Image */}
              <div className="w-[70%] h-full bg-gray-100 overflow-hidden">
                <img src={item.mainImg} alt="main product" className="w-full h-full object-cover" />
              </div>
              
              {/* Side Images Stack */}
              <div className="w-[30%] flex flex-col gap-1 h-full">
                {item.sideImgs.map((img, idx) => (
                  <div key={idx} className="h-1/3 bg-gray-100 overflow-hidden">
                    <img src={img} alt="variant" className="w-full h-full object-cover" />
                  </div>
                ))}
                {/* Last Box with Count Overlay */}
                <div className="h-1/3 bg-gray-800/60 relative overflow-hidden group cursor-pointer">
                   <img src={item.sideImgs[0]} alt="variant" className="w-full h-full object-cover opacity-50" />
                   <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                    {item.count}
                   </div>
                </div>
              </div>
            </div>

            {/* 3. Footer: Title and Icons */}
            <div className="p-4 mt-auto flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">
                Aviline Exclusive Story
              </h3>
              <div className="flex items-center gap-4 text-gray-600">
                <FaRegHeart className="text-xl cursor-pointer hover:text-[#d41d40] transition-colors" />
                <FaShareAlt className="text-lg cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>

          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-3 ">
        {products.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col ">
            
            {/* 1. Header: Author Info */}
            <div className="p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                <img src="/api/placeholder/32/32" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                By <span className="text-black">{item.author}</span>
              </div>
            </div>

            {/* 2. Image Collage Section */}
            <div className="flex px-3 gap-1 h-[320px]">
              {/* Main Image */}
              <div className="w-[70%] h-full bg-gray-100 overflow-hidden">
                <img src={item.mainImg} alt="main product" className="w-full h-full object-cover" />
              </div>
              
              {/* Side Images Stack */}
              <div className="w-[30%] flex flex-col gap-1 h-full">
                {item.sideImgs.map((img, idx) => (
                  <div key={idx} className="h-1/3 bg-gray-100 overflow-hidden">
                    <img src={img} alt="variant" className="w-full h-full object-cover" />
                  </div>
                ))}
                {/* Last Box with Count Overlay */}
                <div className="h-1/3 bg-gray-800/60 relative overflow-hidden group cursor-pointer">
                   <img src={item.sideImgs[0]} alt="variant" className="w-full h-full object-cover opacity-50" />
                   <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                    {item.count}
                   </div>
                </div>
              </div>
            </div>

            {/* 3. Footer: Title and Icons */}
            <div className="p-4 mt-auto flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">
                Aviline Exclusive Story
              </h3>
              <div className="flex items-center gap-4 text-gray-600">
                <FaRegHeart className="text-xl cursor-pointer hover:text-[#d41d40] transition-colors" />
                <FaShareAlt className="text-lg cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>

          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-3 ">
        {products.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col ">
            
            {/* 1. Header: Author Info */}
            <div className="p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                <img src="/api/placeholder/32/32" alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
                By <span className="text-black">{item.author}</span>
              </div>
            </div>

            {/* 2. Image Collage Section */}
            <div className="flex px-3 gap-1 h-[320px]">
              {/* Main Image */}
              <div className="w-[70%] h-full bg-gray-100 overflow-hidden">
                <img src={item.mainImg} alt="main product" className="w-full h-full object-cover" />
              </div>
              
              {/* Side Images Stack */}
              <div className="w-[30%] flex flex-col gap-1 h-full">
                {item.sideImgs.map((img, idx) => (
                  <div key={idx} className="h-1/3 bg-gray-100 overflow-hidden">
                    <img src={img} alt="variant" className="w-full h-full object-cover" />
                  </div>
                ))}
                {/* Last Box with Count Overlay */}
                <div className="h-1/3 bg-gray-800/60 relative overflow-hidden group cursor-pointer">
                   <img src={item.sideImgs[0]} alt="variant" className="w-full h-full object-cover opacity-50" />
                   <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                    {item.count}
                   </div>
                </div>
              </div>
            </div>

            {/* 3. Footer: Title and Icons */}
            <div className="p-4 mt-auto flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-tight">
                Aviline Exclusive Story
              </h3>
              <div className="flex items-center gap-4 text-gray-600">
                <FaRegHeart className="text-xl cursor-pointer hover:text-[#d41d40] transition-colors" />
                <FaShareAlt className="text-lg cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;