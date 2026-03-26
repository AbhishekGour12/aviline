// src/components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaApplePay,
  FaGooglePay,
  FaArrowUp,
  FaHeart
} from 'react-icons/fa';
import { SiRazorpay } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/products/new' },
      { name: 'Best Sellers', href: '/products/best-sellers' },
      { name: 'On Sale', href: '/products/sale' },
      { name: 'Featured', href: '/products/featured' },
    ],
    categories: [
      { name: 'Wool', href: '/category/wool' },
      { name: 'Cotton', href: '/category/cotton' },
      { name: 'Denim', href: '/category/denim' },
      { name: 'Leather', href: '/category/leather' },
      { name: 'Linen', href: '/category/linen' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Order Tracking', href: '/track-order' },
      { name: 'Returns & Refunds', href: '/returns' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    company: [
      { name: 'About Us', href: '/About' },
      { name: 'Contact Us', href: '/Contact' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Privacy Policy', href: '/PrivacyPolicy' },
      { name: 'Terms & Conditions', href: '/TermsConditions' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook', color: '#1877f2' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: '#1da1f2' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: '#e4405f' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn', color: '#0077b5' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube', color: '#ff0000' },
  ];

  const paymentMethods = [
    { icon: FaCcVisa, name: 'Visa', color: '#1a1f71' },
    { icon: FaCcMastercard, name: 'Mastercard', color: '#eb001b' },
    { icon: FaCcAmex, name: 'American Express', color: '#006fcf' },
    { icon: FaCcPaypal, name: 'PayPal', color: '#003087' },
    { icon: FaApplePay, name: 'Apple Pay', color: '#000000' },
    { icon: FaGooglePay, name: 'Google Pay', color: '#3cba54' },
    { icon: SiRazorpay, name: 'Razorpay', color: '#0c69c8' },
  ];

  return (
    <footer className="bg-[#777E5C] text-white">
      {/* Scroll to Top Button */}
      <div className="relative">
        <button
          onClick={scrollToTop}
          className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#DFE0DC] hover:bg-[#D1D88D] text-[#777E5C] p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-sm" />
        </button>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold font-serif text-white">AVILINE</h2>
              <p className="text-sm text-[#DFE0DC] mt-1">Sustainable Fashion</p>
            </div>
            <p className="text-sm text-[#DFE0DC] mb-4 leading-relaxed">
              Premium quality clothing crafted with care for the environment. 
              Style that doesn't cost the earth.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-white/10 hover:bg-[#DFE0DC] hover:text-[#777E5C] rounded-full flex items-center justify-center transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="text-sm" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#DFE0DC] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#DFE0DC] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#DFE0DC] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#DFE0DC] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm text-[#DFE0DC] mb-2 hover:text-white transition-colors">
                <FaPhone className="text-xs" />
                <span>+91 12345 67890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#DFE0DC] mb-2 hover:text-white transition-colors">
                <FaEnvelope className="text-xs" />
                <span>support@aviline.com</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-[#DFE0DC] hover:text-white transition-colors">
                <FaMapMarkerAlt className="text-xs mt-0.5" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Subscribe to Newsletter</h3>
              <p className="text-sm text-[#DFE0DC]">
                Get 10% off your first purchase and stay updated with our latest collections.
              </p>
            </div>
            <div>
              <form className="flex gap-2 flex-wrap w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-[#DFE0DC] focus:outline-none focus:ring-2 focus:ring-[#D1D88D] focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#DFE0DC] hover:bg-[#D1D88D] text-[#777E5C] font-semibold rounded-xl transition-all duration-300 whitespace-nowrap hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="group relative cursor-pointer"
                    title={method.name}
                  >
                    <Icon className="text-2xl text-[#DFE0DC] hover:text-white transition-colors duration-200" />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[#DFE0DC]">
              © {currentYear} AVILINE. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[#DFE0DC]">
            <Link href="/PrivacyPolicy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/TermsConditions" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/returns" className="hover:text-white transition-colors">
              Return Policy
            </Link>
          </div>
          <p className="text-center text-xs text-[#C4CBB5] mt-3 flex items-center justify-center gap-1">
            Made with <FaHeart className="inline text-rose-400 text-xs animate-pulse" /> for sustainable fashion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;