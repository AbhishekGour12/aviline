"use client"
import   React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Sample data for categories and slider
const categories = [
  { name: 'SAREES', image: '/saree.png' },
  { name: 'ETHNIC SETS', image: '/ethnic.png' },
  // ... add other categories
];

const slides = [
  { image: '/slide1.png', alt: 'Jashn-e-Eid' },
  { image: '/slide2.png', alt: 'Havratri' },
  // ... add other slides
];
import { useEffect, useState } from "react";

const BubbleLayer = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();

      const newBubble = {
        id,
        size: Math.random() * 20 + 10, // 10px - 30px
        left: Math.random() * 100, // %
        duration: Math.random() * 6 + 4, // 4s - 10s
      };

      setBubbles((prev) => [...prev, newBubble]);

      // remove after animation
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, newBubble.duration * 1000);

    }, 400); // generate every 0.4s

    return () => clearInterval(interval);
  }, []);

  return (
   <div className="absolute inset-0 z-[999] pointer-events-none overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble-particle"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
const HeroSection = () => {
  return (
    <div className="mt-16  ">
      {/* 1. Top Category Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 py-6">
          <ul className="flex items-center justify-between text-center">
            {categories.map((category) => (
              <li key={category.name} className="flex flex-col items-center">
                <div className="w-15 h-15 relative rounded-full overflow-hidden border-2 border-[#71bc63]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <span className="text-[12px] font-semibold mt-2 text-gray-800 uppercase tracking-tighter">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    {/* 2. Swiper Slider Section */}
<div className="relative max-w-5xl mx-auto">
  {/* 3. Background Bubble Animation (Placeholder) */}
  
  <div className="w-full mx-auto relative z-10  ">
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      breakpoints={{
        // Mobile devices (portrait)
        0: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        // Tablets (portrait and landscape)
        768: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        // Desktop and larger tablets
        1024: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
      }}
      className="mySwiper  !pb-6"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.alt}>
          {/* Desktop/Tablet View - 2 columns */}
          <div className="hidden md:grid md:grid-cols-2 gap-0 w-full">
            
            <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden group">
              <Image
                src={slide.image}
                alt={`${slide.alt} - Left`}
                fill
                className="object-fit transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
              />
              {/* Optional Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg md:text-xl font-semibold">Navratri Collection</h3>
                  <p className="text-sm">Shop Now</p>
                </div>
              </div>
            </div>

            {/* Second Image with Content Overlay */}
            <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden group">
              <Image
                src="/slide2.png"
                alt={`${slide.alt} - Right`}
                fill
                className="object-fit transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Optional Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg md:text-xl font-semibold">Footwear Collection</h3>
                  <p className="text-sm">Explore Now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - Single Image */}
          <div className="block md:hidden w-full">
            <div className="relative w-full h-[300px] sm:h-[350px] overflow-hidden rounded-lg group">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-fit transition-transform duration-700 group-hover:scale-105"
                sizes="100vw"
                priority={index === 0}
              />
              {/* Content Overlay for Mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Navratri Special</h3>
                  <p className="text-sm opacity-90">Discover our festive collection</p>
                  <button className="mt-3 px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
  <BubbleLayer/>

</div>


    </div>
  );
};

export default HeroSection;