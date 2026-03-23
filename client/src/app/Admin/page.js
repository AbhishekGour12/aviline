// app/admin/page.jsx (or src/app/admin/page.jsx)
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../Components/Admin/Sidebar';
import Header from '../Components/Admin/Header';
import Dashboard from '../Components/Admin/Dashboard';

import { PageLoader } from '../Components/Admin/Loading';
import { 
  FaBox, 
  FaShoppingBag, 
  FaUsers, 
  FaClipboardList, 
  FaTags, 
  FaStar, 
  FaCog, 
  FaGift,
  FaChartLine,
  FaBoxes
} from 'react-icons/fa';
import ProductManagement from '../Components/Admin/ProductManagement';

// Dummy data
const dummyData = {
  stats: {
    totalRevenue: 45230,
    totalOrders: 892,
    totalCustomers: 1247,
    totalProducts: 156,
    pendingOrders: 23,
    lowStock: 12,
    avgOrderValue: 50.75,
    conversionRate: 3.2
  },
  products: [
    { 
      _id: '1', 
      name: 'Classic Wool Jumper', 
      price: 89.99,
      offerPrice: 79.99,
      stock: 45, 
      category: 'Wool', 
      subcategory: 'Jumpers',
      isFeatured: true, 
      sales: 89, 
      rating: 4.8,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Red', 'Blue', 'Black'],
      status: 'active'
    },
    { 
      _id: '2', 
      name: 'Slim Fit Denim Jeans', 
      price: 129.99,
      offerPrice: 109.99,
      stock: 30, 
      category: 'Denim', 
      subcategory: 'Jeans',
      isFeatured: true, 
      sales: 145, 
      rating: 4.9,
      sizes: ['30', '32', '34', '36'],
      colors: ['Blue', 'Black'],
      status: 'active'
    },
    { 
      _id: '3', 
      name: 'Cotton Casual Shirt', 
      price: 59.99,
      offerPrice: 49.99,
      stock: 60, 
      category: 'Cotton', 
      subcategory: 'Shirts',
      isFeatured: false, 
      sales: 234, 
      rating: 4.7,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Blue', 'Pink'],
      status: 'active'
    },
    { 
      _id: '4', 
      name: 'Leather Biker Jacket', 
      price: 299.99,
      offerPrice: 249.99,
      stock: 8, 
      category: 'Leather', 
      subcategory: 'Jackets',
      isFeatured: true, 
      sales: 67, 
      rating: 4.9,
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'Brown'],
      status: 'active'
    },
    { 
      _id: '5', 
      name: 'Linen Summer Dress', 
      price: 79.99,
      offerPrice: 69.99,
      stock: 5, 
      category: 'Linen', 
      subcategory: 'Dresses',
      isFeatured: false, 
      sales: 34, 
      rating: 4.6,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['White', 'Pink', 'Blue'],
      status: 'low-stock'
    }
  ],
  categories: {
    'Wool': ['Jumpers', 'Cardigans', 'Scarves', 'Hats'],
    'Cotton': ['T-Shirts', 'Shirts', 'Dresses', 'Pants'],
    'Denim': ['Jeans', 'Jackets', 'Shorts', 'Skirts'],
    'Leather': ['Jackets', 'Bags', 'Belts', 'Shoes'],
    'Linen': ['Shirts', 'Pants', 'Dresses', 'Suits']
  },
  orders: [
    { 
      _id: 'ORD001', 
      customer: { name: 'Alice Johnson', email: 'alice@example.com' }, 
      totalAmount: 149.97, 
      orderStatus: 'delivered', 
      createdAt: '2024-01-15', 
      items: 3,
      paymentMethod: 'Credit Card'
    },
    { 
      _id: 'ORD002', 
      customer: { name: 'Bob Smith', email: 'bob@example.com' }, 
      totalAmount: 84.98, 
      orderStatus: 'shipped', 
      createdAt: '2024-01-14', 
      items: 2,
      paymentMethod: 'PayPal'
    },
    { 
      _id: 'ORD003', 
      customer: { name: 'Carol Davis', email: 'carol@example.com' }, 
      totalAmount: 39.99, 
      orderStatus: 'pending', 
      createdAt: '2024-01-14', 
      items: 1,
      paymentMethod: 'Credit Card'
    },
    { 
      _id: 'ORD004', 
      customer: { name: 'David Wilson', email: 'david@example.com' }, 
      totalAmount: 124.97, 
      orderStatus: 'confirmed', 
      createdAt: '2024-01-13', 
      items: 4,
      paymentMethod: 'UPI'
    },
    { 
      _id: 'ORD005', 
      customer: { name: 'Eva Brown', email: 'eva@example.com' }, 
      totalAmount: 69.98, 
      orderStatus: 'cancelled', 
      createdAt: '2024-01-12', 
      items: 2,
      paymentMethod: 'Cash on Delivery'
    }
  ],
  customers: [
    { 
      _id: '1', 
      name: 'Alice Johnson', 
      email: 'alice@example.com', 
      createdAt: '2024-01-15', 
      status: 'active', 
      orders: 5, 
      totalSpent: 459.85,
      lastActive: '2 hours ago' 
    },
    { 
      _id: '2', 
      name: 'Bob Smith', 
      email: 'bob@example.com', 
      createdAt: '2024-01-10', 
      status: 'active', 
      orders: 12, 
      totalSpent: 1250.75,
      lastActive: '1 day ago' 
    },
    { 
      _id: '3', 
      name: 'Carol Davis', 
      email: 'carol@example.com', 
      createdAt: '2024-01-08', 
      status: 'inactive', 
      orders: 3, 
      totalSpent: 189.97,
      lastActive: '1 week ago' 
    },
    { 
      _id: '4', 
      name: 'David Wilson', 
      email: 'david@example.com', 
      createdAt: '2024-01-05', 
      status: 'active', 
      orders: 8, 
      totalSpent: 678.92,
      lastActive: '3 hours ago' 
    },
    { 
      _id: '5', 
      name: 'Eva Brown', 
      email: 'eva@example.com', 
      createdAt: '2024-01-03', 
      status: 'active', 
      orders: 15, 
      totalSpent: 1567.30,
      lastActive: '30 minutes ago' 
    }
  ],
  coupons: [
    { 
      _id: '1', 
      code: 'WELCOME10', 
      discount: 10, 
      type: 'percentage', 
      minOrder: 99, 
      validUntil: '2024-12-31',
      used: 234,
      status: 'active'
    },
    { 
      _id: '2', 
      code: 'SUMMER50', 
      discount: 50, 
      type: 'flat', 
      minOrder: 199, 
      validUntil: '2024-08-31',
      used: 89,
      status: 'active'
    },
    { 
      _id: '3', 
      code: 'FREESHIP', 
      discount: 0, 
      type: 'shipping', 
      minOrder: 50, 
      validUntil: '2024-06-30',
      used: 567,
      status: 'active'
    }
  ],
  reviews: [
    {
      _id: '1',
      product: 'Classic Wool Jumper',
      customer: 'Alice Johnson',
      rating: 5,
      comment: 'Amazing quality! Very warm and comfortable.',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      _id: '2',
      product: 'Slim Fit Denim Jeans',
      customer: 'Bob Smith',
      rating: 4,
      comment: 'Great fit, but the color faded slightly after first wash.',
      date: '2024-01-14',
      status: 'approved'
    },
    {
      _id: '3',
      product: 'Cotton Casual Shirt',
      customer: 'Carol Davis',
      rating: 5,
      comment: 'Perfect for everyday wear. Very breathable.',
      date: '2024-01-13',
      status: 'pending'
    }
  ]
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(dummyData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Action handlers
  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setData(prev => ({
        ...prev,
        products: prev.products.filter(product => product._id !== productId)
      }));
    }
  };

  const updateOrderStatus = (orderId, status) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: status } : order
      )
    }));
  };

  const deleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setData(prev => ({
        ...prev,
        customers: prev.customers.filter(customer => customer._id !== customerId)
      }));
    }
  };

  const deleteCoupon = (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setData(prev => ({
        ...prev,
        coupons: prev.coupons.filter(coupon => coupon._id !== couponId)
      }));
    }
  };

  const updateReviewStatus = (reviewId, status) => {
    setData(prev => ({
      ...prev,
      reviews: prev.reviews.map(review =>
        review._id === reviewId ? { ...review, status } : review
      )
    }));
  };

  const deleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setData(prev => ({
        ...prev,
        reviews: prev.reviews.filter(review => review._id !== reviewId)
      }));
    }
  };

  if (loading) return <PageLoader />;

  const tabComponents = {
    dashboard: <Dashboard stats={data.stats} orders={data.orders} products={data.products} />,
    products: <ProductManagement 
      products={data.products} 
      categories={data.categories}
      searchTerm={searchTerm} 
      onDeleteProduct={deleteProduct}
    />,
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7E6] via-[#E0EBD0] to-[#F0F7E6]">
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setSidebarOpen(false);
              }
            }}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen lg:ml-0">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Page Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {tabComponents[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;