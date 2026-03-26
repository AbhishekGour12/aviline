"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaRegEdit, FaPencilAlt, FaCartPlus, FaUser, FaBars, FaTimes, FaSignOutAlt, FaUserCircle, FaHeart, FaClipboardList } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { logoutSuccess } from '../store/features/authSlice';

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
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get user data from Redux store
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  
  // Get username or email for display
  const getUserDisplayName = () => {
    if (!user) return "Hi!";
    
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.email) return user.email.split('@')[0];
    return "Hi!";
  };
  
  const getInitials = () => {
    const name = getUserDisplayName();
    if (name === "Hi!") return "H";
    return name.charAt(0).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutSuccess());
    localStorage.removeItem('token');
    setIsProfileOpen(false);
    router.push('/');
  };

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
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-xl text-gray-600" />
                </button>

                <div className="flex-1 flex items-center border border-[#777E5C] rounded-lg overflow-hidden h-[45px] shadow-sm">
                  <div className="px-4 h-full flex justify-center items-center bg-[#F0F7E6]">
                    <FaSearch className="text-[#777E5C]" />
                  </div>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="What are you looking for?" 
                    className="w-full h-full px-4 outline-none text-gray-700"
                  />
                </div>
              </div>
              
              <div className="max-w-[1460px] mx-auto mt-3 px-14 text-xs text-[#777E5C] font-medium">
                Enter 3 or more characters
              </div>
            </div>

            <div 
              className="flex-1 w-full cursor-pointer" 
              onClick={() => setIsSearchOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Overlay */}
      <AnimatePresence>
        {(isProfileOpen || activeTab) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(119,126,92,0.25)] z-40 mt-[60px] pointer-events-none"
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

      <nav className={`w-full fixed top-0 bg-white border-b transition-shadow duration-300 z-[60] ${
        isScrolled ? 'shadow-lg border-[#DFE0DC]' : 'shadow-md border-[#E0EBD0]'
      }`}>
        <div className="max-w-[1460px] mx-auto px-4 flex items-center justify-between h-[60px]">
          
          {/* Left Side: Logo and Hamburger Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-[#777E5C] hover:text-[#5A6E4A] transition-colors"
            >
              <FaBars className="text-2xl" />
            </button>

            <div 
              className="logo flex text-2xl font-bold font-serif tracking-wide hover:cursor-pointer text-[#777E5C]"
              onClick={() => router.push('/')}
            >
              AVILINE
            </div>

            {/* Desktop Navigation Links */}
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
                    ${activeTab === item.name ? 'text-[#777E5C]' : 'text-gray-700 hover:text-[#777E5C]'}`}>
                    {item.name}
                  </span>
                  
                  {activeTab === item.name && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#777E5C]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Tools */}
          <div className="flex items-center gap-6 md:gap-9 text-gray-500">
            {/* Search Icon */}
            <div className="hidden sm:flex flex-col items-center cursor-pointer transition-colors group" onClick={() => setIsSearchOpen(true)}>
              <FaSearch className="text-xl text-[#777E5C] group-hover:text-[#5A6E4A]" />
              <span className="text-[10px] font-medium mt-1 uppercase text-[#777E5C] hidden md:block group-hover:text-[#5A6E4A]">Search</span>
            </div>
            
            {/* Cart Icon */}
            <div className="flex flex-col items-center cursor-pointer transition-colors group relative">
              <FaCartPlus className="text-xl text-[#777E5C] group-hover:text-[#5A6E4A]" />
              <span className="text-[10px] font-medium mt-1 uppercase text-[#777E5C] hidden sm:block group-hover:text-[#5A6E4A]">Cart</span>
              <span className="absolute -top-2 -right-2 bg-[#D1D88D] text-[#777E5C] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                0
              </span>
            </div>
            
            {/* Profile Dropdown */}
            <div 
              className="relative flex flex-col items-center h-full justify-center cursor-pointer transition-colors group"
              onMouseEnter={() => {
                setIsProfileOpen(true);
                setActiveTab(null);
              }}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <div className="flex-col items-center gap-2">
                <FaUser className="text-xl text-[#777E5C] group-hover:text-[#5A6E4A] w-full" />
                <span className="text-[10px] mt-1 flex justify-center w-full font-medium uppercase text-[#777E5C] hidden md:block group-hover:text-[#5A6E4A]">
                  {isAuthenticated ? getUserDisplayName() : "Profile"}
                </span>
              </div>
              <span className="text-[10px] font-medium mt-2 uppercase text-[#777E5C] hidden sm:block md:hidden">
                {isAuthenticated ? "Profile" : "Account"}
              </span>
              
              {isProfileOpen && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#777E5C]" />
              )}

              {/* Profile Dropdown Modal */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[60px] right-0 w-[300px] bg-white shadow-2xl border border-[#DFE0DC] text-left overflow-hidden cursor-default rounded-lg"
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    {isAuthenticated ? (
                      <>
                        {/* User Info Section */}
                        <div className="p-5 border-b border-[#DFE0DC] bg-gradient-to-r from-[#F0F7E6] to-white">
                          <div className="flex items-center gap-3">
                            {user?.avatar ? (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#777E5C]">
                                <Image
                                  src={user.avatar}
                                  alt={getUserDisplayName()}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#777E5C] to-[#8A9B6E] flex items-center justify-center text-white font-bold text-xl">
                                {getInitials()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-bold text-gray-800">{getUserDisplayName()}</p>
                              {user?.phone && (
                                <p className="text-xs text-gray-500">{user.phone.slice(3, 13)}</p>
                              )}
                              <p className="text-xs text-[#777E5C] font-medium mt-1">
                                {user?.membership || "Standard Member"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Account Links */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0F7E6] transition-colors cursor-pointer group">
                            <FaUserCircle className="text-[#777E5C] text-lg group-hover:text-[#5A6E4A]" />
                            <span className="text-sm text-gray-700 group-hover:text-[#777E5C]">My Account</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0F7E6] transition-colors cursor-pointer group">
                            <FaClipboardList className="text-[#777E5C] text-lg group-hover:text-[#5A6E4A]" />
                            <span className="text-sm text-gray-700 group-hover:text-[#777E5C]">My Orders</span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F0F7E6] transition-colors cursor-pointer group">
                            <FaHeart className="text-[#777E5C] text-lg group-hover:text-[#5A6E4A]" />
                            <span className="text-sm text-gray-700 group-hover:text-[#777E5C]">Wishlist</span>
                          </div>
                        </div>

                        {/* Logout Button */}
                        <div className="p-4 border-t border-[#DFE0DC]">
                          <button
                            onClick={handleLogout}
                            className="w-full bg-[#F0F7E6] hover:bg-[#E0EBD0] text-[#777E5C] text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <FaSignOutAlt className="text-sm" />
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Not Logged In Section */}
                        <div className="p-5 border-b border-[#DFE0DC]">
                          <p className="text-sm font-bold text-gray-800">WELCOME!</p>
                          <p className="text-xs text-gray-500 mt-1">To view account details</p>
                          <button 
                            className="mt-4 bg-[#777E5C] hover:bg-[#5A6E4A] text-white text-xs font-bold py-2 px-6 rounded-sm uppercase tracking-wider transition-colors w-full"
                            onClick={() => {
                              setIsProfileOpen(false);
                              router.push("/Login");
                            }}
                          >
                            Login
                          </button>
                          
                        </div>

                        <div className="p-4 space-y-3">
                          <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                            Orders
                          </p>
                          <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                            Return Replacement
                          </p>
                          <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                            Lr Credits
                          </p>
                        </div>

                        <div className="p-4 space-y-3 border-t border-[#DFE0DC]">
                          <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                            Customer Support
                          </p>
                          <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                            Faq & Help
                          </p>
                          
                          <div className="pt-2">
                            <button className="bg-[#777E5C] hover:bg-[#5A6E4A] transition-colors text-white text-xs px-3 py-1 rounded-full font-medium">
                              हिन्दी
                            </button>
                          </div>
                        </div>
                      </>
                    )}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onMouseEnter={() => setActiveTab(activeTab)}
              onMouseLeave={() => setActiveTab(null)}
              className="absolute top-[60px] left-0 w-full bg-white shadow-xl border-t border-[#DFE0DC] py-8 z-[55] hidden lg:block"
            >
              <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-5 gap-8">
                {Object.entries(NAV_ITEMS.find(i => i.name === activeTab).categories).map(([title, links]) => (
                  <div key={title} className="flex flex-col">
                    <h3 className="text-[#777E5C] font-bold text-sm mb-4 uppercase">
                      {title}
                    </h3>
                    <ul className="space-y-2">
                      {links.map((link) => (
                        <li key={link} className="text-gray-600 text-[13px] hover:text-[#777E5C] cursor-pointer transition-colors">
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
            <div className="flex items-center justify-between p-4 border-b border-[#DFE0DC]">
              <span className="text-xl font-bold font-serif text-[#777E5C]">AVILINE</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-[#777E5C] hover:text-[#5A6E4A] transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* User Profile Section in Sidebar */}
            <div className="p-4 border-b border-[#DFE0DC] bg-gradient-to-r from-[#F0F7E6] to-white">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {user?.avatar ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#777E5C]">
                      <Image
                        src={user.avatar}
                        alt={getUserDisplayName()}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#777E5C] to-[#8A9B6E] flex items-center justify-center text-white font-bold text-lg">
                      {getInitials()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-800">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.phone || "Member"}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">Welcome!</p>
                  <p className="text-xs text-gray-500">Login to access your account</p>
                  <button 
                    className="mt-3 bg-[#777E5C] hover:bg-[#5A6E4A] text-white text-xs font-bold py-2 px-4 rounded-md w-full transition-colors"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      router.push("/Login");
                    }}
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="p-4">
              {/* Search Bar for Mobile */}
              <div className="mb-6">
                <div className="flex items-center border border-[#DFE0DC] rounded-lg px-3 py-2 focus-within:border-[#777E5C] focus-within:ring-1 focus-within:ring-[#777E5C] transition-all">
                  <FaSearch className="text-[#777E5C] mr-2" />
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
                  <div key={item.name} className="border-b border-[#DFE0DC]">
                    <button
                      onClick={() => setActiveMobileTab(activeMobileTab === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-gray-800 hover:text-[#777E5C]">{item.name}</span>
                      {item.categories && (
                        <span className="text-[#777E5C] text-lg">
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
                            <h3 className="text-[#777E5C] font-semibold text-xs uppercase mt-2">
                              {title}
                            </h3>
                            <ul className="space-y-1.5">
                              {links.map((link) => (
                                <li key={link} className="text-gray-600 text-xs hover:text-[#777E5C] cursor-pointer">
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

              {/* Profile Section in Sidebar for Authenticated Users */}
              {isAuthenticated && (
                <div className="mt-6 pt-4 border-t border-[#DFE0DC]">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        My Account
                      </p>
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        My Orders
                      </p>
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        Wishlist
                      </p>
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        Return Replacement
                      </p>
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        Lr Credits
                      </p>
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        Customer Support
                      </p>
                      <p className="text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#777E5C] uppercase transition-colors">
                        Faq & Help
                      </p>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full bg-[#F0F7E6] hover:bg-[#E0EBD0] text-[#777E5C] text-xs font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaSignOutAlt className="text-xs" />
                      Logout
                    </button>
                    
                    <div className="pt-2">
                      <button className="bg-[#777E5C] hover:bg-[#5A6E4A] transition-colors text-white text-xs px-3 py-1.5 rounded-full font-medium">
                        हिन्दी
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;