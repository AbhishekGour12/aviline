// Models/Carousel.js
import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  buttonLink: {
    type: String,
    default: '/products'
  },
  leftImage: {
    type: String,
    required: true
  },
  rightImage: {
    type: String,
    required: true
  },
  mobileImage: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: String,
    default: '#F0F7E6'
  }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);
export default Carousel;