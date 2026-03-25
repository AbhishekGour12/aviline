"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {  FaShoppingBag, FaBoxOpen, FaStar } from 'react-icons/fa';

const TickerItem = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 px-12 max-sm:px-3 shrink-0">
    <Icon className="text-xl text-gray-600 max-sm:text-sm" />
    <span className="text-sm max-sm:text-[10px] font-thin max-sm:font-normal tracking-[0.2em] uppercase text-gray-500 whitespace-nowrap">
      {text}
    </span>
  </div>
);

const Ticker = () => {
  const tickerData = [
    { icon: FaBoxOpen, text: "Personalized Packaging" },
    { icon: FaStar, text: "White Glove Customer Support" },
    { icon: FaShoppingBag, text: "Free Tote with your first purchase" },
  ];

  // We duplicate the array to ensure there are no gaps during the infinite loop
  const duplicatedData = [...tickerData, ...tickerData, ...tickerData];

  return (
    <div className="w-full bg-white border-y border-gray-100 py-6 overflow-hidden relative">
      <motion.div 
        className="flex"
        animate={{
          x: [0, -1000], // Adjust distance based on content width
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedData.map((item, index) => (
          <TickerItem key={index} icon={item.icon} text={item.text} />
        ))}
      </motion.div>
    </div>
  );
};

export default Ticker;