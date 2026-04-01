// src/components/HeroSection.js - Updated with dynamic carousel
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { HeroCategoryApi } from '../../lib/HeroCategoryApi';
import { CarouselApi } from '../../lib/CarouselApi';
import { useRouter } from 'next/navigation';

const BubbleLayer = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const newBubble = {
        id,
        size: Math.random() * 20 + 10,
        left: Math.random() * 100,
        duration: Math.random() * 6 + 4,
      };
      setBubbles((prev) => [...prev, newBubble]);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, newBubble.duration * 1000);
    }, 400);
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
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, carouselData] = await Promise.all([
        HeroCategoryApi.getCategories(),
        CarouselApi.getCarouselSlides()
      ]);
      setCategories(categoriesData);
      setCarouselSlides(carouselData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleButtonClick = (link) => {
    router.push(link);
  };

  if (loading) {
    return (
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <div className="max-w-[1100px] mx-auto px-4 py-6">
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#777E5C]"></div>
            </div>
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#777E5C]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* 1. Top Category Section - Dynamic */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 py-6">
          <ul className="flex items-center justify-start md:justify-between gap-6 overflow-x-auto flex-nowrap no-scrollbar pb-2">
            {categories.map((category) => (
              <li 
                key={category._id} 
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center flex-shrink-0 min-w-[80px] cursor-pointer group"
              >
                <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-[#777E5C] shadow-sm transition-transform hover:scale-105 group-hover:shadow-md">
                  <Image
                    src={category.image.startsWith('/uploads') 
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${category.image}` 
                      : category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    className="object-fit"
                  />
                </div>
                <span className="text-[11px] md:text-[12px] font-bold mt-2 text-gray-800 uppercase tracking-tighter whitespace-nowrap group-hover:text-[#777E5C] transition-colors">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Swiper Slider Section - Dynamic Carousel */}
      <div className="relative max-w-5xl mx-auto">
        <div className="w-full mx-auto relative z-10">
          {carouselSlides.length > 0 ? (
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
              className="mySwiper !pb-6"
            >
              {carouselSlides.map((slide, index) => (
                <SwiperSlide key={slide._id}>
                  {/* Desktop/Tablet View - 2 columns */}
                  <div 
                    className="hidden md:grid md:grid-cols-2 gap-0 w-full"
                    style={{ backgroundColor: slide.backgroundColor || '#F0F7E6' }}
                  >
                    {/* Left Image */}
                    <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden group">
                      <Image
                        src={slide.leftImage.startsWith('/uploads') 
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${slide.leftImage}` 
                          : slide.leftImage}
                        alt={`${slide.title} - Left`}
                        fill
                        unoptimized
                        className="object-fit transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                      />
                      {/* Overlay Content */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg md:text-xl font-semibold">{slide.title}</h3>
                          {slide.subtitle && <p className="text-sm">{slide.subtitle}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden group">
                      <Image
                        src={slide.rightImage.startsWith('/uploads') 
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${slide.rightImage}` 
                          : slide.rightImage}
                        alt={`${slide.title} - Right`}
                        fill
                        unoptimized
                        className="object-fit transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Button Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 right-4">
                          <button
                            onClick={() => handleButtonClick(slide.buttonLink)}
                            className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                          >
                            {slide.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile View - Single Image */}
                  <div className="block md:hidden w-full">
                    <div className="relative w-full h-[300px] sm:h-[350px] overflow-hidden rounded-lg group">
                      <Image
                        src={(slide.mobileImage || slide.leftImage).startsWith('/uploads') 
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${slide.mobileImage || slide.leftImage}` 
                          : (slide.mobileImage || slide.leftImage)}
                        alt={slide.title}
                        fill
                        unoptimized
                        className="object-fit transition-transform duration-700 group-hover:scale-105"
                        sizes="100vw"
                        priority={index === 0}
                      />
                      {/* Content Overlay for Mobile */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
                          {slide.subtitle && (
                            <p className="text-sm opacity-90">{slide.subtitle}</p>
                          )}
                          <button
                            onClick={() => handleButtonClick(slide.buttonLink)}
                            className="mt-3 px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                          >
                            {slide.buttonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12 bg-[#F5F9F0] rounded-xl">
              <p className="text-[#8A9B6E]">No carousel slides available. Add some in the admin panel.</p>
            </div>
          )}
        </div>
        <BubbleLayer />
      </div>
    </div>
  );
};

export default HeroSection;