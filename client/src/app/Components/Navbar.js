"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaRegEdit, FaPencilAlt, FaCartPlus, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {useRouter} from "next/navigation"
const NAV_ITEMS = [
  { name: 'WOMEN', categories: { 
      'Western': ['Topwear', 'Dresses', 'Jeans', 'Skirts'],
      'Ethnic': ['Kurtas', 'Sarees', 'Lehenga', 'Suits'],
      'Brands': ['Aurelia', 'W', 'Biba', 'Libas']
    } 
  },
  { name: 'MEN', categories: { 
      'Topwear': ['T-Shirts', 'Shirts', 'Jackets'],
      'Bottomwear': ['Jeans', 'Trousers', 'Shorts'],
      'Footwear': ['Casual Shoes', 'Sneakers', 'Boots']
    } 
  },
  { name: 'KIDS' },
  { name: 'HOME' },
  { name: 'OFFERS' },
  { name: 'VMART' },
];

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter()
 useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);
  return (
    <>
    {/* 1. FULL SCREEN SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex flex-col"
          >
            {/* White Search Header */}
            <div className="bg-white w-full p-4 shadow-lg">
              <div className="max-w-[1460px] mx-auto flex items-center gap-4">
                {/* Close/Back Button */}
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-xl text-gray-600" />
                </button>

                {/* Search Input Container */}
                <div className="flex-1 flex items-center border border-green-500 rounded-lg overflow-hidden h-[45px] shadow-sm">
                  <div className="px-4  h-full flex justify-center items-center hover:cursor-pointer " style={{boxShadow: " rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}}>
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="What are you looking for?" 
                    className="w-full h-full px-4 outline-none text-gray-700"
                  />
                </div>
              </div>
              
              {/* Help Text */}
              <div className="max-w-[1460px] mx-auto mt-3 px-14 text-xs text-gray-500 font-medium">
                Enter 3 or more characters
              </div>
            </div>

            {/* Clickable area to close search */}
            <div 
              className="flex-1 w-full cursor-pointer" 
              onClick={() => setIsSearchOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Background Overlay (Modal effect) */}
      <AnimatePresence>
        {(isProfileOpen || activeTab) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(40,44,63,0.55)] z-40 mt-[60px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-[70] md:hidden"
          />
        )}
      </AnimatePresence>

      <nav className="w-full fixed top-0 bg-white border-b border-gray-200 z-[60] shadow-md ">
        <div className="max-w-[1460px] mx-auto px-4 flex items-center justify-between h-[60px]">
          
          {/* Left Side: Logo and Hamburger Menu */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu - Visible only on mobile/tablet */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-700 hover:text-[#5A9E4E] transition-colors"
            >
              <FaBars className="text-2xl" />
            </button>

            <div className="logo flex text-2xl font-bold font-serif tracking-wide hover:cursor-pointer">
              AVILINE
            </div>

            {/* Desktop Navigation Links - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center justify-between space-x-8 ml-12 gap-3">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="relative h-full flex items-center group cursor-pointer"
                  onMouseEnter={() => {
                    setActiveTab(item.name);
                    setIsProfileOpen(false);
                  }}
                  onMouseLeave={() => setActiveTab(null)}
                >
                  <span className={`text-sm font-bold tracking-wide transition-colors duration-200 
                    ${activeTab === item.name ? 'text-[#5A9E4E]' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  
                  {activeTab === item.name && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5A9E4E]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Tools */}
          <div className="flex items-center gap-6 md:gap-9 text-gray-500">
            {/* Search Icon - Hide on very small screens */}
            <div className="hidden sm:flex flex-col items-center cursor-pointer hover:text-black transition-colors" onClick={() => setIsSearchOpen(true)}>
              <FaSearch className="text-xl text-black" />
              <span className="text-[10px] font-medium mt-1 uppercase text-black hidden md:block">Search</span>
            </div>
            
            {/* Scrapbook Icon - Hide on tablets */}
            <div className="hidden md:flex flex-col items-center cursor-pointer hover:text-black transition-colors">
              <FaPencilAlt className="text-xl text-black" />
              <span className="text-[10px] font-medium mt-1 uppercase text-black">Scrapbook</span>
            </div>
            
            {/* Cart Icon - Always visible */}
            <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors relative">
              <FaCartPlus className="text-xl text-black" />
              <span className="text-[10px] font-medium mt-1 uppercase text-black hidden sm:block">Cart</span>
              {/* Optional: Cart Badge */}
              <span className="absolute -top-2 -right-2 bg-[#6dd85a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </div>
            
            {/* Profile Dropdown */}
            <div 
              className="relative flex flex-col items-center h-full justify-center cursor-pointer hover:text-black transition-colors group"
              onMouseEnter={() => {
                setIsProfileOpen(true);
                setActiveTab(null);
              }}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <FaUser className="text-xl text-black" />
              <span className="text-[10px] font-medium mt-1 uppercase text-black hidden sm:block">Profile</span>
              
              {isProfileOpen && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5A9E4E]" />
              )}

              {/* Profile Dropdown Modal */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="z-60 absolute top-[60px] right-0 w-[280px] bg-white shadow-2xl border border-gray-200 text-left overflow-hidden cursor-default"
                    onMouseEnter={() => setIsProfileOpen(true)}
                  >
                    <div className="p-5 border-b border-gray-100">
                      <p className="text-[13px] font-bold text-gray-800">WELCOME!</p>
                      <p className="text-[12px] text-gray-500 mt-1">To view account details</p>
                      <button className="mt-4 bg-[#1A4D3E]   text-white  hover:cursor-pointer text-[12px] font-bold py-2 px-6 rounded-sm uppercase tracking-wider  transition-colors hover:bg-[#1A4D3E] bg-[#8BC34A]> " onClick={() => {router.push("/Login")}} >
                    
                        Login
                      </button>
                    </div>

                    <div className="p-5 space-y-3 border-b border-gray-100">
                      <p className="text-[12px] font-semibold text-gray-600 cursor-pointer hover:text-black uppercase transition-colors">Orders</p>
                      <p className="text-[12px] font-semibold text-gray-600 cursor-pointer hover:text-black uppercase transition-colors">Return Replacement</p>
                      <p className="text-[12px] font-semibold text-gray-600 cursor-pointer hover:text-black uppercase transition-colors">Lr Credits</p>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-[12px] font-semibold text-gray-600 cursor-pointer hover:text-black uppercase transition-colors">Customer Support</p>
                      <p className="text-[12px] font-semibold text-gray-600 cursor-pointer hover:text-black uppercase transition-colors">Faq & Help</p>
                      
                      <div className="pt-2">
                        <button className="bg-gray-600 hover:bg-gray-700 transition-colors text-white text-[11px] px-3 py-1 rounded-full font-medium">
                          हिन्दी
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {activeTab && NAV_ITEMS.find(i => i.name === activeTab)?.categories && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseEnter={() => setActiveTab(activeTab)}
              onMouseLeave={() => setActiveTab(null)}
              className="absolute top-[60px] left-0 w-full bg-white shadow-xl border-t border-gray-100 py-8 z-[55] hidden lg:block"
            >
              <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-5 gap-8">
                {Object.entries(NAV_ITEMS.find(i => i.name === activeTab).categories).map(([title, links]) => (
                  <div key={title} className="flex flex-col">
                    <h3 className="text-[#5a9a4f] font-bold text-sm mb-4 uppercase">
                      {title}
                    </h3>
                    <ul className="space-y-2">
                      {links.map((link) => (
                        <li key={link} className="text-gray-600 text-[13px] hover:text-black cursor-pointer">
                          {link}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
         
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 w-[280px] h-full bg-white z-[80] shadow-2xl lg:hidden overflow-y-auto"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-xl font-bold font-serif">AVILINE</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-600 hover:text-[#d41d40] transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-4">
              {/* Search Bar for Mobile */}
              <div className="mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                  <FaSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <div key={item.name} className="border-b border-gray-100">
                    <button
                      onClick={() => setActiveMobileTab(activeMobileTab === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                      {item.categories && (
                        <span className="text-gray-400 text-lg">
                          {activeMobileTab === item.name ? '−' : '+'}
                        </span>
                      )}
                    </button>
                    
                    {/* Mobile Submenu */}
                    {activeMobileTab === item.name && item.categories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 pb-3 space-y-3"
                      >
                        {Object.entries(item.categories).map(([title, links]) => (
                          <div key={title} className="space-y-2">
                            <h3 className="text-[#d41d40] font-semibold text-xs uppercase mt-2">
                              {title}
                            </h3>
                            <ul className="space-y-1.5">
                              {links.map((link) => (
                                <li key={link} className="text-gray-600 text-xs hover:text-[#d41d40] cursor-pointer">
                                  {link}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Profile Section in Sidebar */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <button className="w-full  bg-[#8BC34A] text-white text-sm font-bold py-2.5 rounded-md uppercase tracking-wider hover:bg-[#5A9E4E] transition-colors ">
                    Login
                  </button>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-black uppercase">Orders</p>
                    <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-black uppercase">Return Replacement</p>
                    <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-black uppercase">Lr Credits</p>
                    <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-black uppercase">Customer Support</p>
                    <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-black uppercase">Faq & Help</p>
                  </div>
                  
                  <div className="pt-2">
                    <button className="bg-gray-600 hover:bg-gray-700 transition-colors text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      हिन्दी
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
     

          

        

      
    </>
  );
};

export default Navbar;