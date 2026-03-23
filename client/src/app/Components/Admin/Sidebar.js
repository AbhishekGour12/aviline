// app/admin/components/Sidebar.jsx
"use client"
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaShoppingBag,
  FaTags,
  FaClipboardList,
  FaUsers,
  FaBoxes,
  FaGift,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
  { id: 'products', label: 'Products', icon: FaShoppingBag },
  
];

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  return (
    <motion.div
      initial={{ x: -260 }}
      animate={{ x: sidebarOpen ? 0 : -260 }}
      transition={{ duration: 0.3 }}
      className={`fixed lg:static top-0 left-0 h-screen bg-white shadow-lg z-40
      w-64 border-r border-[#D0E0C0] 
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      lg:translate-x-0 lg:block`}
    >
      {/* TOP HEADER WITH CLOSE BUTTON */}
      <div className="p-6 border-b bg-[#E8F0E0] flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1A4D3E]">ECO STORE</h1>
          <p className="text-sm text-[#5A7A4C]">Admin Panel</p>
        </div>

        {/* Close Button - ONLY MOBILE */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-[#1A4D3E] hover:text-red-500 transition text-xl"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id
                  ? "bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white shadow-md"
                  : "hover:bg-[#F0F7E6] text-[#1A4D3E]"
                }`}
            >
              <Icon className={activeTab === item.id ? "text-white" : "text-[#5A7A4C]"} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
        hover:bg-red-50 text-red-600 border border-[#D0E0C0]">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;