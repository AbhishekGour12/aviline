"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  GiSewingNeedle, 
  GiRecycle, 
  GiHeartNecklace, 
  GiDiamondRing,
  GiThreeLeaves 
} from 'react-icons/gi';
import { 
  FaUsers, 
  FaExchangeAlt, 
  FaTshirt, 
  FaTruck, 
  FaStar, 
  FaStarHalfAlt,
  FaArrowRight,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import Image from 'next/image';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -8, transition: { duration: 0.3, ease: "easeOut" } }
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

const About = () => {
  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "The quality of fabrics is exceptional! AVILINE has become my go-to for elegant everyday wear. Their sustainable approach makes me feel good about my choices.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Aditya Mehta",
      location: "Bangalore",
      rating: 5,
      text: "Fast delivery and premium packaging. The linen collection is absolutely stunning. Worth every penny! Customer service is also very responsive.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Neha Kapoor",
      location: "Delhi",
      rating: 4.5,
      text: "Finally a brand that understands modern Indian women. The fits are perfect and the designs are timeless. Love their commitment to quality.",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  // Values data
  const values = [
    {
      icon: GiSewingNeedle,
      title: "Quality Craftsmanship",
      description: "Every stitch tells a story. Our artisans bring decades of expertise to create pieces that last."
    },
    {
      icon: GiThreeLeaves,
      title: "Sustainable Fashion",
      description: "Eco-conscious choices without compromising style. We're committed to reducing fashion's footprint."
    },
    {
      icon: FaUsers,
      title: "Customer First",
      description: "Your experience matters. We're here to make every interaction effortless and memorable."
    },
    {
      icon: GiDiamondRing,
      title: "Affordable Luxury",
      description: "Premium fashion that doesn't break the bank. Elegance should be accessible to all."
    }
  ];

  // Why choose us data
  const whyChoose = [
    { icon: FaUsers, text: "2L+ happy customers", stat: true },
    { icon: FaExchangeAlt, text: "60-day easy returns", stat: true },
    { icon: FaTshirt, text: "Premium quality fabrics", stat: true },
    { icon: FaTruck, text: "Fast delivery across India", stat: true }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-amber-400 text-sm" />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-400 text-sm" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7E6] to-[#E0EBD0]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fashion Model"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E2B]/70 via-[#2C3E2B]/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-white/80 text-sm uppercase tracking-wider mb-4 font-light">Est. 2022</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white leading-[1.2] mb-6">
              We Don’t Just Sell Fashion — <span className="font-medium">We Create Identity</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-xl leading-relaxed font-light">
              Where timeless elegance meets contemporary design. Every piece tells a story of craftsmanship, sustainability, and the modern spirit.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-[#2C3E2B] px-8 py-3 rounded-full font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
            >
              Explore Collection
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection direction="left">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                alt="AVILINE Studio"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E2B]/20 to-transparent" />
            </div>
          </AnimatedSection>
          
          <AnimatedSection direction="right">
            <div className="space-y-6">
              <span className="text-[#4A6A3B] text-sm uppercase tracking-wider font-medium">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-[#2C3E2B] leading-tight">
                Born from a passion for <span className="font-medium">authentic expression</span>
              </h2>
              <div className="space-y-4 text-[#4A5B3E] leading-relaxed">
                <p>
                  AVILINE began in a small atelier in Jaipur, where founder Meera Agarwal noticed a gap in the market — fashion that felt personal, sustainable, and truly timeless. What started as a desire to create pieces that celebrate individuality has grown into a community of conscious fashion lovers across India.
                </p>
                <p>
                  We believe that what you wear should reflect who you are. Every fabric is thoughtfully sourced, every design meticulously crafted, and every piece carries the warmth of human hands. Our journey is driven by a simple mission: to create fashion that doesn't just look good, but feels good — for you and for the planet.
                </p>
                <p className="font-medium text-[#2C3E2B]">
                  Today, AVILINE stands for quiet confidence, effortless elegance, and a commitment to doing fashion differently.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection direction="up" className="text-center mb-16">
            <span className="text-[#4A6A3B] text-sm uppercase tracking-wider font-medium">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C3E2B] mt-2">Our Values</h2>
            <p className="text-[#5A6E4A] max-w-2xl mx-auto mt-4">Guiding principles that shape everything we create.</p>
          </AnimatedSection>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.03, transition: { duration: 0.2 } }
                  }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E8F0E0] to-[#D4E2C4] rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="text-3xl text-[#4A6A3B]" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#2C3E2B] mb-2">{value.title}</h3>
                  <p className="text-[#5A6E4A] text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <div>
              <span className="text-[#4A6A3B] text-sm uppercase tracking-wider font-medium">Why AVILINE</span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C3E2B] mt-2 mb-6">
                Because you deserve <span className="font-medium">more than just clothing</span>
              </h2>
              <div className="space-y-4">
                {whyChoose.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl hover:bg-white transition-all"
                    >
                      <div className="w-12 h-12 bg-[#E8F0E0] rounded-full flex items-center justify-center">
                        <Icon className="text-[#4A6A3B] text-xl" />
                      </div>
                      <span className="text-[#2C3E2B] font-medium text-lg">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection direction="right">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Sustainable Fashion"
                width={600}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E2B]/30 to-transparent" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="right" className="order-2 md:order-1">
              <div className="space-y-5">
                <span className="text-[#4A6A3B] text-sm uppercase tracking-wider font-medium">Meet The Founder</span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C3E2B]">Meera Agarwal</h2>
                <p className="text-[#5A6E4A] text-lg italic">"Fashion should empower, not consume."</p>
                <div className="space-y-3 text-[#4A5B3E]">
                  <p>
                    After a decade in luxury fashion retail, Meera realized that the industry needed a reset. She left her corporate role to pursue a dream — creating a brand that values people and planet over fast trends.
                  </p>
                  <p>
                    "AVILINE is my love letter to thoughtful design. Every piece is made to be cherished, not discarded. I wanted to build something that my daughter would be proud to wear, knowing it was made with integrity."
                  </p>
                  <p>
                    Today, Meera works closely with artisan communities across India, ensuring that traditional crafts find a place in contemporary wardrobes. Her vision is simple: fashion that tells a story you want to share.
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <div className="w-12 h-12 bg-[#E8F0E0] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D4E2C4] transition">
                    <FaInstagram className="text-[#4A6A3B]" />
                  </div>
                  <div className="w-12 h-12 bg-[#E8F0E0] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D4E2C4] transition">
                    <FaTwitter className="text-[#4A6A3B]" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left" className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80"
                  alt="Founder Meera Agarwal"
                  width={600}
                  height={700}
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection direction="up" className="text-center mb-12">
          <span className="text-[#4A6A3B] text-sm uppercase tracking-wider font-medium">Loved by Many</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-[#2C3E2B] mt-2">What Our Community Says</h2>
        </AnimatedSection>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-[#2C3E2B]">{testimonial.name}</h4>
                  <p className="text-sm text-[#7A8E6A]">{testimonial.location}</p>
                </div>
                <MdVerified className="text-[#4A6A3B] ml-auto text-xl" />
              </div>
              <div className="flex gap-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-[#4A5B3E] leading-relaxed">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <AnimatedSection direction="up">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#2C3E2B] to-[#3A5535] rounded-3xl p-12 md:p-16 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-4">
              Join the AVILINE Community
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Be the first to discover new collections, exclusive offers, and stories from our design studio.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-[#2C3E2B] px-10 py-4 rounded-full font-medium text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 group"
            >
              Shop Now
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </AnimatedSection>
      </section>

    
    </div>
  );
};

export default About;