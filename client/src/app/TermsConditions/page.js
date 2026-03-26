// src/components/TermsConditions.jsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaGavel, 
  FaShoppingCart, 
  FaTruck, 
  FaUndo, 
  FaCreditCard,
  FaFileContract,
  FaShieldAlt,
  FaExclamationTriangle,
  FaUserCheck,
  FaStore,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';
import { MdVerified, MdOutlinePayment, MdDeliveryDining } from 'react-icons/md';
import { TbArrowNarrowRight } from 'react-icons/tb';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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

const TermsConditions = () => {
  const lastUpdated = "March 15, 2025";
  const effectiveDate = "April 1, 2025";

  const sections = [
    {
      icon: FaShoppingCart,
      title: "1. Account Registration",
      content: [
        "You must be at least 18 years old to create an account and make purchases",
        "Provide accurate, current, and complete information during registration",
        "Maintain the security of your account credentials",
        "Notify us immediately of any unauthorized account use",
        "We reserve the right to refuse service or terminate accounts at our discretion"
      ]
    },
    {
      icon: FaCreditCard,
      title: "2. Orders & Payments",
      content: [
        "All orders are subject to acceptance and availability",
        "Prices are displayed in Indian Rupees (INR) and include applicable taxes",
        "We accept major credit cards, debit cards, UPI, and net banking",
        "Payment must be received in full before order processing",
        "We reserve the right to cancel orders due to pricing errors or suspected fraud",
        "Order confirmation emails are sent after successful payment verification"
      ]
    },
    {
      icon: FaTruck,
      title: "3. Shipping & Delivery",
      content: [
        "Orders are typically processed within 1-2 business days",
        "Standard delivery: 5-7 business days across India",
        "Express delivery: 2-3 business days for metro cities",
        "Shipping costs are calculated at checkout based on location and order value",
        "Free shipping on orders above ₹2,499",
        "Delivery timelines are estimates and not guaranteed",
        "Risk of loss passes to you upon delivery"
      ]
    },
    {
      icon: FaUndo,
      title: "4. Returns & Exchanges",
      content: [
        "60-day return policy from date of delivery",
        "Items must be unused, unwashed, with original tags attached",
        "Free returns for all orders within India",
        "Refunds processed within 5-7 business days after quality check",
        "Exchange requests are subject to stock availability",
        "Final sale items cannot be returned or exchanged",
        "For hygiene reasons, innerwear and swimwear are non-returnable"
      ]
    },
    {
      icon: FaGavel,
      title: "5. Intellectual Property",
      content: [
        "All content on this website is the property of AVILINE",
        "This includes logos, designs, images, text, and trademarks",
        "You may not reproduce, distribute, or modify any content without written permission",
        "Unauthorized use may result in legal action",
        "Our designs are protected by copyright and design patents"
      ]
    },
    {
      icon: FaShieldAlt,
      title: "6. Limitation of Liability",
      content: [
        "AVILINE is not liable for indirect or consequential damages",
        "Maximum liability is limited to the purchase price of the product",
        "We do not guarantee that the website will be error-free or uninterrupted",
        "Colors may vary slightly due to screen display settings",
        "Product descriptions are accurate to the best of our knowledge"
      ]
    },
    {
      icon: FaUserCheck,
      title: "7. User Conduct",
      content: [
        "You agree to use the website for lawful purposes only",
        "Do not upload harmful content or attempt to compromise site security",
        "Reviews and feedback must be genuine and respectful",
        "We reserve the right to remove inappropriate content",
        "Commercial use of our platform without authorization is prohibited"
      ]
    }
  ];

  const contactInfo = {
    email: "legal@aviline.com",
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
              <FaGavel className="text-[#777E5C] text-lg" />
              <span className="text-xs uppercase tracking-wider font-medium text-[#5A6E4A]">Legal Agreement</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight mb-5 text-[#2C3E2B]">
              Terms & <span className="font-medium">Conditions</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-[#5A6E4A]">
              Please read these terms carefully before using our website or making a purchase.
              By using AVILINE, you agree to be bound by these terms.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <p className="text-sm text-[#7A8E6A]">Last Updated: {lastUpdated}</p>
              <span className="text-[#7A8E6A]">•</span>
              <p className="text-sm text-[#7A8E6A]">Effective: {effectiveDate}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FaUndo, text: "60-Day Returns", subtext: "Hassle-free returns" },
              { icon: FaTruck, text: "Free Shipping", subtext: "On orders above ₹2,499" },
              { icon: FaCreditCard, text: "Secure Payments", subtext: "100% protected" },
              { icon: FaStore, text: "Genuine Products", subtext: "Quality guaranteed" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all"
                >
                  <Icon className="text-[#777E5C] text-xl mx-auto mb-2" />
                  <p className="text-sm font-medium text-[#2C3E2B]">{item.text}</p>
                  <p className="text-xs text-[#7A8E6A]">{item.subtext}</p>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>
      </section>

      {/* Terms Sections */}
      <section className="py-12 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="space-y-6">
          {sections.map((section, idx) => {
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
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-amber-50/80 rounded-2xl p-6 md:p-8 border border-amber-200">
            <div className="flex gap-4">
              <FaExclamationTriangle className="text-amber-600 text-xl shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-serif font-medium text-[#2C3E2B] mb-2">Important Notice</h2>
                <p className="text-[#5A6E4A] text-sm leading-relaxed mb-3">
                  AVILINE reserves the right to modify these terms at any time. Changes become effective immediately upon posting. 
                  Your continued use of the website constitutes acceptance of the updated terms.
                </p>
                <p className="text-[#5A6E4A] text-sm leading-relaxed">
                  For significant changes, we will notify users via email or a prominent notice on our website.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Dispute Resolution */}
      <section className="py-8 max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F0E0] flex items-center justify-center shrink-0">
                <FaFileContract className="text-[#777E5C] text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-[#2C3E2B] mb-3">Dispute Resolution</h2>
                <p className="text-[#5A6E4A] text-sm leading-relaxed mb-3">
                  Any disputes arising from these terms or your use of AVILINE shall be resolved through binding arbitration 
                  in accordance with the laws of India. The arbitration shall be conducted in New Delhi, India.
                </p>
                <p className="text-[#5A6E4A] text-sm leading-relaxed">
                  By using our services, you agree to submit to the exclusive jurisdiction of the courts in New Delhi, India.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Contact Section */}
      <section className="py-12 pb-20 max-w-4xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="bg-gradient-to-r from-[#777E5C] to-[#8A9B6E] rounded-2xl p-8 md:p-10 text-white">
            <h2 className="text-2xl md:text-3xl font-serif font-light mb-4">Questions About These Terms?</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact our Legal Team.
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
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-xs text-white/60 text-center">
                By continuing to use AVILINE, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms & Conditions.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default TermsConditions;