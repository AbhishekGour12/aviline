// src/components/VideoTicker.jsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaGift, FaBoxOpen, FaCommentDots, FaStar, FaGoogle } from 'react-icons/fa';
import { SiGoogle, SiMeta } from 'react-icons/si';

const USPItem = ({ icon: Icon, text, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-center gap-4 group cursor-pointer"
  >
    <div className="w-12 h-12 rounded-full bg-[#F5F9F0] flex items-center justify-center group-hover:bg-[#8BC34A] transition-colors duration-300">
      <Icon className="text-xl max-sm:text-lg text-[#1A4D3E] group-hover:text-white transition-colors duration-300" />
    </div>
    <span className="text-sm max-sm:text-xs font-semibold tracking-wide text-[#1A4D3E] leading-tight">
      {text}
    </span>
  </motion.div>
);

const VideoTicker = () => {
  const uspData = [
    { icon: FaHeart, text: "Over 2 Lakh Happy Customers", delay: 0.1 },
    { icon: FaGift, text: "Free Tote with your First Purchase", delay: 0.2 },
    { icon: FaBoxOpen, text: "60 Days Risk-Free Returns & Exchanges", delay: 0.3 },
    { icon: FaCommentDots, text: "White Glove Customer Support", delay: 0.4 },
  ];

  // Sample clothing/fashion video (replace with your actual video)
  const videoUrl = "https://cdn.pixabay.com/video/2023/06/26/170390-840105573_large.mp4";
  const fallbackImage = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800";

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Video Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="relative max-h-[600px] w-full aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
              {/* Background Video */}
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-fill transition-transform duration-[10s] group-hover:scale-110"
                poster={fallbackImage}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Text Overlay */}
              <div className="absolute bottom-8 left-6 right-6 md:bottom-12 md:left-8 md:right-8">
                <p className="text-white text-sm md:text-base font-light tracking-wide mb-2">
                  We're not in the business of making clothes.
                </p>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  We're in the business of making you<br />
                  <span className="text-[#8BC34A]">look & feel your best.</span>
                </h2>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#8BC34A]/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#1A4D3E]/5 rounded-full blur-2xl -z-10" />
          </motion.div>

          {/* Right Column: Social Proof & USPs */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-10"
          >
            {/* Ratings Section */}
            <div className="flex items-center gap-8 md:gap-12">
              {/* Google Rating */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                 
                  <span className="text-2xl md:text-3xl font-bold text-[#1A4D3E] max-sm:text-xl">4.7</span>
                </div>
                <div className="flex justify-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
                <p className=" flex flex-wrap text-center  item-center text-xs font-semibold tracking-wider uppercase text-[#8A9B6E]">
                  Reviews on Google  <SiGoogle className="text-lg flex justify-center max-sm:w-full max-sm:mt-3 text-[#4285F4] ml-3" /> 
                </p>
              </div>
              
              {/* Meta Rating */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                 
                  <span className="text-xl md:text-3xl font-bold text-[#1A4D3E]">4.3</span>
                </div>
                <div className="flex justify-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
                <p className="flex flex-wrap items-center text-xs font-semibold tracking-wider uppercase text-[#8A9B6E] ">
                 <span className='max-sm:text-xs'>  Reviews on Meta </span> <SiMeta className="text-lg flex justify-between max-sm:w-full max-sm:mt-3 text-[#eb18f2] ml-3" />
                </p>
              </div>
            </div>

            {/* Read Reviews Link */}
            <motion.a 
              href="#" 
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-[#1A4D3E] border-b-2 border-[#1A4D3E] pb-1 hover:text-[#8BC34A] hover:border-[#8BC34A] transition-colors duration-300 group"
            >
              Read Reviews
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </motion.a>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#D0E0C0] to-transparent" />

            {/* Unique Selling Points (USPs) */}
            <div className="grid grid-cols-1 gap-6">
              {uspData.map((usp, index) => (
                <USPItem key={index} icon={usp.icon} text={usp.text} delay={usp.delay}  />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#D0E0C0] to-transparent" />

            {/* CTA Link */}
            <motion.a 
              href="#" 
              whileHover={{ x: 5 }}
              className="inline-flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-[#1A4D3E] border-b-2 border-[#1A4D3E] pb-1 hover:text-[#8BC34A] hover:border-[#8BC34A] transition-colors duration-300 group"
            >
              Pick something to try out
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoTicker;