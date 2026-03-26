"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaHeadset, 
  FaClock, 
  FaExchangeAlt, 
  FaUsers,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaRegClock,
  FaRegSmile,
  FaRegHeart,
  FaRegStar,
  FaGift,
  FaShieldAlt,
  FaTruck,
  FaCreditCard,
  FaUserCheck,
  FaChartLine,
  FaPalette,
  FaLeaf
} from 'react-icons/fa';
import { MdVerified, MdOutlineSupportAgent, MdOutlineEmail, MdOutlineLocationOn } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';
import { TbArrowNarrowRight } from 'react-icons/tb';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } }
};

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Section wrapper with animation
const AnimatedSection = ({ children, className, direction = "up", delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating social icons component
const FloatingSocialIcons = () => {
  const socials = [
    { icon: FaInstagram, color: "#E4405F", delay: 0, label: "Instagram" },
    { icon: FaFacebookF, color: "#1877F2", delay: 0.2, label: "Facebook" },
    { icon: FaTwitter, color: "#1DA1F2", delay: 0.4, label: "Twitter" },
    { icon: FaYoutube, color: "#FF0000", delay: 0.6, label: "YouTube" },
    { icon: FaWhatsapp, color: "#25D366", delay: 0.8, label: "WhatsApp" }
  ];

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-3">
        {socials.map((social, idx) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={idx}
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: social.delay, duration: 0.4 }}
              whileHover={{ scale: 1.2, x: 5 }}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:shadow-lg transition-all duration-300 group relative"
              style={{ color: social.color }}
            >
              <Icon className="text-lg" />
              <span className="absolute left-12 whitespace-nowrap bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {social.label}
              </span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

// Animated decorative element
const AnimatedDecor = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={floatAnimation}
        className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-white/5 to-transparent blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 left-10 w-40 h-40 rounded-full border border-white/10"
      />
      <motion.div
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-white/20"
      />
      <motion.div
        animate={{ 
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-white/15"
      />
    </div>
  );
};

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);
  
  const faqs = [
    {
      id: 1,
      question: "How long does delivery take?",
      answer: "We offer standard delivery within 5-7 business days across India. Metro cities typically receive orders within 3-4 days. You'll receive a tracking link via SMS and email once your order ships. Express shipping is also available at checkout for 1-2 day delivery."
    },
    {
      id: 2,
      question: "How can I return a product?",
      answer: "Returns are easy! You have 60 days from delivery to initiate a return through your account dashboard or by contacting our support team. We offer free pickup for most pin codes. Refunds are processed within 5-7 business days after quality check. Items must be unused with original tags attached."
    },
    {
      id: 3,
      question: "Do you offer international shipping?",
      answer: "Currently we ship across India. International shipping is coming soon! Subscribe to our newsletter to be the first to know when we launch global shipping. We're working hard to bring AVILINE to fashion lovers worldwide."
    },
    {
      id: 4,
      question: "How do I track my order?",
      answer: "Once your order is dispatched, you'll receive an email and SMS with tracking details. You can also track your order by logging into your AVILINE account and visiting the 'My Orders' section. Our support team is also available 24/7 to help with any tracking issues."
    }
  ];
  
  // Support highlights with icons and descriptions
  const supportHighlights = [
    { icon: FaHeadset, title: "24/7 Customer Support", description: "Round-the-clock assistance", color: "from-blue-500/10 to-cyan-500/10" },
    { icon: FaRegClock, title: "Quick Response", description: "Avg reply within 2 hours", color: "from-emerald-500/10 to-teal-500/10" },
    { icon: FaExchangeAlt, title: "Easy Returns", description: "60-day hassle-free returns", color: "from-amber-500/10 to-orange-500/10" },
    { icon: FaUsers, title: "Dedicated Team", description: "Experts ready to help", color: "from-purple-500/10 to-pink-500/10" },
    { icon: FaGift, title: "VIP Support", description: "For our loyal customers", color: "from-rose-500/10 to-red-500/10" },
    { icon: FaShieldAlt, title: "Secure Shopping", description: "100% payment protection", color: "from-indigo-500/10 to-blue-500/10" }
  ];
  
  // Contact information with enhanced styling
  const contactInfo = [
    { 
      icon: FaEnvelope, 
      title: "Email Support", 
      detail: "hello@aviline.com", 
      subdetail: "We reply within 24 hours", 
      action: "mailto:hello@aviline.com",
      gradient: "from-rose-50 to-pink-50",
      iconGradient: "from-rose-500 to-pink-500"
    },
    { 
      icon: FaPhoneAlt, 
      title: "Phone Number", 
      detail: "+91 124 456 7890", 
      subdetail: "Mon-Fri, 10am - 7pm", 
      action: "tel:+911244567890",
      gradient: "from-blue-50 to-indigo-50",
      iconGradient: "from-blue-500 to-indigo-500"
    },
    { 
      icon: FaMapMarkerAlt, 
      title: "Office Location", 
      detail: "AVILINE House, 42 Fashion Street", 
      subdetail: "New Delhi, India - 110016", 
      action: "#",
      gradient: "from-emerald-50 to-teal-50",
      iconGradient: "from-emerald-500 to-teal-500"
    }
  ];
  
  // Additional brand badges
  const brandBadges = [
    { icon: FaRegStar, text: "4.9/5 Customer Rating", count: "2,500+ reviews" },
    { icon: FaTruck, text: "Free Shipping", count: "On orders above ₹2,499" },
    { icon: FaCreditCard, text: "Secure Payments", count: "PCI compliant" },
    { icon: FaLeaf, text: "Carbon Neutral", count: "Eco-friendly shipping" }
  ];
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone && !/^[0-9+\-\s]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Please select a subject";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };
  
  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Floating Social Icons */}
      <FloatingSocialIcons />
      
      {/* Animated Background Decorations */}
      <AnimatedDecor />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm"
            >
              <HiOutlineSparkles className="text-amber-500" />
              <span className="text-xs uppercase tracking-wider font-medium">We're here for you 24/7</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-light leading-tight mb-5">
              We’d Love to <span className="font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Hear From You</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed opacity-80">
              Have a question, feedback, or just want to say hello? Our team is here to help you with style and care.
            </p>
            
            {/* Quick Stats */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              {brandBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-full px-5 py-2"
                  >
                    <Icon className="text-lg" />
                    <div className="text-left">
                      <p className="text-xs font-medium">{badge.text}</p>
                      <p className="text-xs opacity-60">{badge.count}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Information Section */}
      <section className="py-12 pb-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Card */}
          <AnimatedSection direction="left">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 md:p-8 border border-white/20"
            >
              <div className="mb-6">
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4"
                >
                  <MdOutlineSupportAgent className="text-2xl" />
                </motion.div>
                <h2 className="text-2xl font-serif font-medium mb-2">Send us a message</h2>
                <p className="text-sm opacity-70">We'll get back to you within 24 hours</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <motion.div
                    animate={focusedField === 'fullName' ? { scale: 1.01 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        errors.fullName 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-gray-300 focus:ring-gray-200'
                      }`}
                      placeholder="Aarav Sharma"
                    />
                  </motion.div>
                  {errors.fullName && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </motion.p>
                  )}
                </div>
                
                {/* Email and Phone - Row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <motion.div animate={focusedField === 'email' ? { scale: 1.01 } : { scale: 1 }}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                          errors.email 
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-gray-300 focus:ring-gray-200'
                        }`}
                        placeholder="hello@example.com"
                      />
                    </motion.div>
                    {errors.email && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <motion.div animate={focusedField === 'phone' ? { scale: 1.01 } : { scale: 1 }}>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                          errors.phone 
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-gray-300 focus:ring-gray-200'
                        }`}
                        placeholder="+91 98765 43210"
                      />
                    </motion.div>
                    {errors.phone && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>
                </div>
                
                {/* Subject Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none bg-white ${
                      errors.subject 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-gray-300 focus:ring-gray-200'
                    }`}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5rem' }}
                  >
                    <option value="">Select a topic</option>
                    <option value="order">📦 Order Inquiry</option>
                    <option value="returns">🔄 Returns & Exchange</option>
                    <option value="product">👗 Product Question</option>
                    <option value="feedback">💬 Feedback</option>
                    <option value="other">✨ Other</option>
                  </select>
                  {errors.subject && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <motion.div animate={focusedField === 'message' ? { scale: 1.01 } : { scale: 1 }}>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none ${
                        errors.message 
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-gray-300 focus:ring-gray-200'
                      }`}
                      placeholder="Tell us how we can help..."
                    />
                  </motion.div>
                  {errors.message && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </motion.p>
                  )}
                </div>
                
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-lg hover:from-gray-900 hover:to-black'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <TbArrowNarrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
                
                {/* Success Message */}
                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-emerald-700 text-sm flex items-center justify-center gap-2"
                    >
                      <MdVerified className="text-emerald-500" />
                      Message sent successfully! We'll get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </AnimatedSection>
          
          {/* Contact Information Cards */}
          <AnimatedSection direction="right">
            <div className="space-y-5">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={idx}
                    href={info.action}
                    whileHover={{ x: 8, scale: 1.01 }}
                    className={`bg-gradient-to-r ${info.gradient} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex items-start gap-5 group cursor-pointer block border border-white/30 backdrop-blur-sm`}
                  >
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.iconGradient} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <Icon className="text-xl text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{info.title}</h3>
                      <p className="text-base font-medium">{info.detail}</p>
                      {info.subdetail && <p className="text-sm opacity-70 mt-1">{info.subdetail}</p>}
                    </div>
                    <TbArrowNarrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xl" />
                  </motion.a>
                );
              })}
              
              {/* Social Media Row */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-sm"
              >
                <p className="text-sm font-medium mb-4">Connect with us on social media</p>
                <div className="flex justify-center gap-4">
                  {[
                    { icon: FaInstagram, color: "#E4405F", label: "Instagram" },
                    { icon: FaFacebookF, color: "#1877F2", label: "Facebook" },
                    { icon: FaTwitter, color: "#1DA1F2", label: "Twitter" },
                    { icon: FaYoutube, color: "#FF0000", label: "YouTube" },
                    { icon: FaWhatsapp, color: "#25D366", label: "WhatsApp" }
                  ].map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={idx}
                        href="#"
                        whileHover={{ y: -5, scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:shadow-lg transition-all"
                        style={{ color: social.color }}
                      >
                        <Icon className="text-lg" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Map Section with Enhanced Styling */}
      <AnimatedSection direction="up">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
          >
            <div className="relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.152313185536!2d77.21337431508115!3d28.56651698244297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce26d2b2c5b5f%3A0x8b8e2e9e2e9e2e9e!2sNew%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AVILINE Location Map"
                className="w-full"
              />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs shadow-md">
                📍 AVILINE House, New Delhi
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Support Highlights - Enhanced Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up" className="text-center mb-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block bg-white/60 rounded-full px-4 py-1 mb-4"
          >
            <span className="text-xs uppercase tracking-wider font-medium">✨ Premium Support</span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-serif font-light mt-2">We're Here to Help, Always</h2>
          <p className="max-w-2xl mx-auto mt-3 opacity-70">Experience support that's as thoughtful as our designs</p>
        </AnimatedSection>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {supportHighlights.map((highlight, idx) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${highlight.color} bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 border border-white/30`}
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-sm"
                >
                  <Icon className="text-2xl" />
                </motion.div>
                <h3 className="font-medium mb-2">{highlight.title}</h3>
                <p className="text-sm opacity-70">{highlight.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-16 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection direction="up" className="text-center mb-12">
            <span className="text-sm uppercase tracking-wider font-medium">📖 Quick Answers</span>
            <h2 className="text-2xl md:text-3xl font-serif font-light mt-2">Frequently Asked Questions</h2>
            <p className="max-w-2xl mx-auto mt-3 opacity-70">Find answers to common questions about ordering, shipping, and returns</p>
          </AnimatedSection>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-gray-50 transition-colors group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                      {faq.id}
                    </span>
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openFaq === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-sm opacity-60 group-hover:opacity-100" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4 text-sm leading-relaxed opacity-80 border-t border-gray-100"
                    >
                      <div className="pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 lg:px-8">
        <AnimatedSection direction="up">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="max-w-5xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center shadow-xl relative overflow-hidden group"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl"
            />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white mb-4 relative z-10">
              Still have questions?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Explore our comprehensive help center for detailed guides and answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 group"
              >
                Browse Help Center
                <TbArrowNarrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="border border-white/30 text-white px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                Shop Now
                <FaGift className="text-sm" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

    
    </div>
  );
};

export default ContactUs;