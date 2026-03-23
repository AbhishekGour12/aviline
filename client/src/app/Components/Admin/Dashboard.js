// src/components/admin/Dashboard.js
"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaShoppingBag,
  FaUsers,
  FaClipboardList,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaDollarSign
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const stats = [
    { label: 'Total Revenue', value: '₹2,45,678', change: '+12.5%', icon: FaDollarSign, color: 'from-[#8BC34A] to-[#5A9E4E]' },
    { label: 'Total Orders', value: '1,234', change: '+8.2%', icon: FaClipboardList, color: 'from-[#FFB347] to-[#FF8C42]' },
    { label: 'Total Customers', value: '5,678', change: '+15.3%', icon: FaUsers, color: 'from-[#4ECDC4] to-[#45B7D1]' },
    { label: 'Total Products', value: '1,892', change: '+5.7%', icon: FaShoppingBag, color: 'from-[#FF6B6B] to-[#FF8E8E]' },
  ];

  const recentOrders = [
    { id: '#ORD001', customer: 'John Doe', amount: '₹2,499', status: 'Delivered', date: '2024-01-15' },
    { id: '#ORD002', customer: 'Jane Smith', amount: '₹3,999', status: 'Processing', date: '2024-01-15' },
    { id: '#ORD003', customer: 'Mike Johnson', amount: '₹1,899', status: 'Shipped', date: '2024-01-14' },
    { id: '#ORD004', customer: 'Sarah Wilson', amount: '₹4,299', status: 'Pending', date: '2024-01-14' },
    { id: '#ORD005', customer: 'Tom Brown', amount: '₹2,999', status: 'Delivered', date: '2024-01-13' },
  ];

  const topProducts = [
    { name: 'Cotton T-Shirt', sales: 234, revenue: '₹46,800' },
    { name: 'Denim Jeans', sales: 189, revenue: '₹75,600' },
    { name: 'Wool Sweater', sales: 156, revenue: '₹62,400' },
    { name: 'Leather Jacket', sales: 98, revenue: '₹68,600' },
    { name: 'Sports Shoes', sales: 87, revenue: '₹43,500' },
  ];

  const salesData = [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Apr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 },
  ];

  const categoryData = [
    { name: 'Wool', value: 35 },
    { name: 'Cotton', value: 45 },
    { name: 'Denim', value: 20 },
  ];

  const COLORS = ['#8BC34A', '#5A9E4E', '#FFB347', '#FF6B6B', '#4ECDC4'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A4D3E]">Dashboard</h1>
        <p className="text-[#8A9B6E] mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-[#D0E0C0]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change.startsWith('+') ? <FaArrowUp /> : <FaArrowDown />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1A4D3E]">{stat.value}</h3>
              <p className="text-[#8A9B6E] text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#D0E0C0]"
        >
          <h3 className="text-lg font-semibold text-[#1A4D3E] mb-4">Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8BC34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8D0" />
              <XAxis dataKey="month" stroke="#8A9B6E" />
              <YAxis stroke="#8A9B6E" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F5F9F0', 
                  border: '1px solid #D0E0C0',
                  borderRadius: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#5A9E4E" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#D0E0C0]"
        >
          <h3 className="text-lg font-semibold text-[#1A4D3E] mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F5F9F0', 
                  border: '1px solid #D0E0C0',
                  borderRadius: '12px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#D0E0C0]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A4D3E]">Recent Orders</h3>
            <button className="text-sm text-[#8BC34A] hover:text-[#5A9E4E] font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F5F9F0] rounded-xl">
                <div>
                  <p className="font-semibold text-[#1A4D3E]">{order.id}</p>
                  <p className="text-sm text-[#8A9B6E]">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1A4D3E]">{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-[#D0E0C0]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A4D3E]">Top Products</h3>
            <button className="text-sm text-[#8BC34A] hover:text-[#5A9E4E] font-semibold">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F5F9F0] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8BC34A] to-[#5A9E4E] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A4D3E]">{product.name}</p>
                    <p className="text-sm text-[#8A9B6E]">{product.sales} sales</p>
                  </div>
                </div>
                <p className="font-semibold text-[#1A4D3E]">{product.revenue}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;