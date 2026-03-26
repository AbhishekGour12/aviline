// src/components/PrivacyPolicy.jsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';

import { useInView } from 'react-intersection-observer';
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserSecret, 
  FaCookie, 
  FaDatabase,
  FaEnvelope,
  FaGlobe,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import { MdVerified, MdPrivacyTip, MdOutlineSecurity } from 'react-icons/md';
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

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

const PrivacyPolicy = () => {
  const lastUpdated = "March 15, 2025";

  const policySections = [
    {
      icon: FaDatabase,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, shipping and billing addresses",
        "Payment Information: Credit/debit card details, UPI IDs, and transaction history",
        "Account Information: Username, password, order history, and preferences",
        "Usage Data: IP address, browser type, device information, and browsing behavior",
        "Communications: Customer service interactions, reviews, and feedback"
      ]
    },
    {
      icon: FaUserSecret,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders, including shipping and delivery updates",
        "Personalize your shopping experience with product recommendations",
        "Send promotional offers, newsletters, and style inspiration (with your consent)",
        "Improve our website functionality and customer service",
        "Prevent fraud, ensure security, and comply with legal obligations"
      ]
    },
    {
      icon: FaCookie,
      title: "Cookies & Tracking Technologies",
      content: [
        "Essential cookies for site functionality and secure checkout",
        "Analytics cookies to understand how visitors interact with our site",
        "Marketing cookies to deliver relevant advertisements",
        "You can manage cookie preferences through your browser settings"
      ]
    },
    {
      icon: FaLock,
      title: "Data Security",
      content: [
        "Industry-standard SSL encryption for all transactions",
        "Regular security audits and vulnerability assessments",
        "Secure data centers with restricted access",
        "Employee training on data protection best practices",
        "No storage of full payment card details on our servers"
      ]
    },
    {
      icon: FaGlobe,
      title: "Third-Party Sharing",
      content: [
        "We never sell your personal information to third parties",
        "Trusted partners: payment processors, shipping carriers, and analytics providers",
        "Service providers are contractually obligated to protect your data",
        "Legal compliance when required by law or to protect rights"
      ]
    },
    {
      icon: FaEnvelope,
      title: "Your Rights",
      content: [
        "Access and review your personal data",
        "Request corrections to inaccurate information",
        "Opt-out of marketing communications anytime",
        "Request deletion of your account and data (subject to legal retention)",
        "Withdraw consent for data processing"
      ]
    }
  ];

  const contactInfo = {
    email: "privacy@aviline.com",
    phone: "+91 124 456 7890",
    address: "AVILINE House, 42 Fashion Street, New Delhi, India - 110016"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7E6] to-[#E0EBD0]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
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
              <MdPrivacyTip className="text-[#777E5C] text-lg" />
              <span className="text-xs uppercase tracking-wider font-medium text-[#5A6E4A]">Your Privacy Matters</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-5 text-[#2C3E2B]">
              Privacy <span className="font-medium">Policy</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-[#5A6E4A]">
              We respect your privacy and are committed to protecting your personal information.
              Learn how we collect, use, and safeguard your data.
            </p>
            <p className="text-sm text-[#7A8E6A] mt-4">Last Updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F0E0] flex items-center justify-center mb-4">
                <FaShieldAlt className="text-[#777E5C] text-xl" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2C3E2B] mb-2">Data Protection</h3>
              <p className="text-sm text-[#5A6E4A]">Your information is protected with industry-standard encryption and security measures.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F0E0] flex items-center justify-center mb-4">
                <FaUserSecret className="text-[#777E5C] text-xl" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2C3E2B] mb-2">Your Control</h3>
              <p className="text-sm text-[#5A6E4A]">You have full control over your data. Update or delete your information anytime.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8F0E0] flex items-center justify-center mb-4">
                <FaCheckCircle className="text-[#777E5C] text-xl" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2C3E2B] mb-2">No Selling</h3>
              <p className="text-sm text-[#5A6E4A]">We never sell your personal information to third parties. Period.</p>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Policy Sections */}
      <section className="py-12 max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {policySections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <AnimatedSection key={idx} direction="up" delay={idx * 0.05}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="border-l-4 border-[#777E5C] p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#E8F0E0] flex items-center justify-center shrink-0">
                        <Icon className="text-[#777E5C] text-lg" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-serif font-medium text-[#2C3E2B]">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-2 ml-14">
                      {section.content.map((item, itemIdx) => (
                        <motion.li 
                          key={itemIdx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: itemIdx * 0.05 }}
                          className="text-[#5A6E4A] text-sm leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-[#777E5C] mt-1">•</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </motion.div>
      </section>

      {/* Children's Privacy */}
      <section className="py-8 max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-[#E8F0E0]/50 rounded-2xl p-6 md:p-8 border border-[#D4E2C4]">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-[#2C3E2B] mb-3 flex items-center gap-2">
              <FaUserSecret className="text-[#777E5C]" />
              Children's Privacy
            </h2>
            <p className="text-[#5A6E4A] text-sm leading-relaxed mb-3">
              AVILINE does not knowingly collect personal information from children under the age of 13. 
              If you believe we have inadvertently collected such information, please contact us immediately.
            </p>
            <p className="text-[#5A6E4A] text-sm leading-relaxed">
              Our services are intended for individuals who are at least 18 years old or have parental consent.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Contact Section */}
      <section className="py-12 pb-20 max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-gradient-to-r from-[#777E5C] to-[#8A9B6E] rounded-2xl p-8 md:p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-serif font-light mb-4">Questions About Privacy?</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your data, 
              please don't hesitate to contact our Privacy Team.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">Email Us</p>
                <a href={`mailto:${contactInfo.email}`} className="text-sm font-medium hover:underline">
                  {contactInfo.email}
                </a>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70">Call Us</p>
                <a href={`tel:${contactInfo.phone}`} className="text-sm font-medium hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-white/70">Mail Us</p>
              <p className="text-sm">{contactInfo.address}</p>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default PrivacyPolicy;