"use client";
import React from 'react';
import BestSellers from './products/BestSellers';
import NewArrivals from './products/NewArrivals';
import VideoTicker from './products/VideoTicker';

const HeroBanners = () => {
  const banners = [
    {
      id: 1,
      title: "FOUNDER'S",
      subtitle: "FAVOURITES",
      image: "/productsection1.png", // Replace with your image
      link: "#"
    },
    {
      id: 2,
      title: "YOUR FAVOURITES",
      subtitle: "ARE BACK",
      image: "/productsection2.png", // Replace with your image
      link: "#"
    }
  ];

  return (
    <div className="max-w-[1460px] mx-auto px-4 py-8 max-sm:py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:gap-2">
        {banners.map((banner) => (
          <div 
            key={banner.id} 
            className="relative group overflow-hidden cursor-pointer h-[300px] sm:h-[500px] lg:h-[600px]"
          >
            {/* Background Image */}
            <img 
              src={banner.image}
              alt={banner.title} 
              className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-105"
            />
            
           
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductSection = () => {
  return (
    <main>
      <BestSellers />
      <HeroBanners />
      <NewArrivals/>
      <VideoTicker/>
    </main>
  );
};

export default ProductSection;