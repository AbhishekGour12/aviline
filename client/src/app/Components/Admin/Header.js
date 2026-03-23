// app/admin/components/Header.jsx
"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaBell, 
  FaUserCircle,
  FaBars,
  FaChevronDown
} from 'react-icons/fa';

const Header = ({ searchTerm, setSearchTerm, sidebarOpen, setSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: 'New order received #ORD123', time: '2 min ago', type: 'order' },
    { id: 2, message: 'Product "Wool Jumper" is low in stock', time: '15 min ago', type: 'stock' },
    { id: 3, message: 'New customer registered', time: '1 hour ago', type: 'user' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-[#D0E0C0]">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-[#F0F7E6] rounded-xl transition-colors"
          >
            <FaBars className="text-[#1A4D3E] text-xl" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8A9B6E]" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] placeholder-[#8A9B6E]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-[#F0F7E6] rounded-xl transition-colors"
            >
              <FaBell className="text-xl text-[#1A4D3E]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B6B] rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#D0E0C0] overflow-hidden z-50"
              >
                <div className="p-4 border-b border-[#D0E0C0]">
                  <h3 className="font-semibold text-[#1A4D3E]">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-[#F5F9F0] border-b border-[#D0E0C0] last:border-0">
                      <p className="text-sm text-[#1A4D3E]">{notif.message}</p>
                      <p className="text-xs text-[#8A9B6E] mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-[#F0F7E6] rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8BC34A] to-[#5A9E4E] flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-[#1A4D3E]">Admin User</p>
                <p className="text-xs text-[#8A9B6E]">admin@ecostore.com</p>
              </div>
              <FaChevronDown className="text-[#8A9B6E] text-sm" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#D0E0C0] overflow-hidden z-50"
              >
                <button className="w-full px-4 py-3 text-left hover:bg-[#F5F9F0] text-[#1A4D3E]">
                  Profile Settings
                </button>
                <button className="w-full px-4 py-3 text-left hover:bg-[#F5F9F0] text-[#1A4D3E]">
                  Change Password
                </button>
                <hr className="border-[#D0E0C0]" />
                <button className="w-full px-4 py-3 text-left hover:bg-red-50 text-red-600">
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-[#F5F9F0] border-t border-[#D0E0C0] px-6 py-2 flex items-center gap-8 text-sm overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-[#8BC34A] rounded-full"></span>
          <span className="text-[#1A4D3E]">Today's Revenue: <span className="font-bold">₹45,678</span></span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-[#5A9E4E] rounded-full"></span>
          <span className="text-[#1A4D3E]">Orders: <span className="font-bold">234</span></span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-[#FFB347] rounded-full"></span>
          <span className="text-[#1A4D3E]">Products: <span className="font-bold">1,892</span></span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 bg-[#FF6B6B] rounded-full"></span>
          <span className="text-[#1A4D3E]">Low Stock: <span className="font-bold">12</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;