// src/components/admin/CarouselManagement.js
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaImage, 
  FaUpload, FaGripVertical, FaEye, FaEyeSlash, FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { CarouselApi } from '../../lib/CarouselApi';
import Image from 'next/image';

const CarouselManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    leftImage: null,
    rightImage: null,
    mobileImage: null,
    order: 0,
    backgroundColor: '#F0F7E6'
  });
  const [imagePreviews, setImagePreviews] = useState({
    left: null,
    right: null,
    mobile: null
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const data = await CarouselApi.getAllCarouselSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error fetching slides:', error);
      
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (type, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('backgroundColor', formData.backgroundColor);
      
      if (formData.leftImage instanceof File) {
        formDataToSend.append('leftImage', formData.leftImage);
      }
      if (formData.rightImage instanceof File) {
        formDataToSend.append('rightImage', formData.rightImage);
      }
      if (formData.mobileImage instanceof File) {
        formDataToSend.append('mobileImage', formData.mobileImage);
      }

      if (editingSlide) {
        await CarouselApi.updateCarouselSlide(editingSlide._id, formDataToSend);
        alert('Slide updated successfully!');
      } else {
        await CarouselApi.addCarouselSlide(formDataToSend);
        alert('Slide added successfully!');
      }

      resetForm();
      fetchSlides();
    } catch (error) {
      console.error('Error saving slide:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        setLoading(true);
        await CarouselApi.deleteCarouselSlide(id);
        alert('Slide deleted successfully!');
        fetchSlides();
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

 // Update the handleEdit function
const handleEdit = (slide) => {
  setEditingSlide(slide);
  setFormData({
    title: slide.title,
    subtitle: slide.subtitle || '',
    buttonText: slide.buttonText,
    buttonLink: slide.buttonLink,
    leftImage: null, // Don't set the image file here
    rightImage: null,
    mobileImage: null,
    order: slide.order,
    backgroundColor: slide.backgroundColor || '#F0F7E6'
  });
  
  // Format image previews with the full URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the NEXT_PUBLIC_IMAGE_URL
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${imagePath}`;
  };
  
  setImagePreviews({
    left: getFullImageUrl(slide.leftImage),
    right: getFullImageUrl(slide.rightImage),
    mobile: getFullImageUrl(slide.mobileImage)
  });
  setShowModal(true);
};

  const resetForm = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      leftImage: null,
      rightImage: null,
      mobileImage: null,
      order: 0,
      backgroundColor: '#F0F7E6'
    });
    setImagePreviews({
      left: null,
      right: null,
      mobile: null
    });
    setShowModal(false);
  };

  const toggleActive = async (slide) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('isActive', !slide.isActive);
      await CarouselApi.updateCarouselSlide(slide._id, formDataToSend);
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide status:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const moveSlide = async (index, direction) => {
    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= slides.length) return;
    
    // Swap orders
    const tempOrder = newSlides[index].order;
    newSlides[index].order = newSlides[newIndex].order;
    newSlides[newIndex].order = tempOrder;
    
    // Update in database
    try {
      await CarouselApi.updateCarouselOrder([
        { id: newSlides[index]._id, order: newSlides[index].order },
        { id: newSlides[newIndex]._id, order: newSlides[newIndex].order }
      ]);
      fetchSlides();
    } catch (error) {
      console.error('Error reordering slides:', error);
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A4D3E]">Hero Carousel Management</h2>
          <p className="text-[#8A9B6E] mt-1">Manage carousel slides displayed on the hero section</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <FaPlus />
          Add Slide
        </button>
      </div>

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl border overflow-hidden transition-all ${
              slide.isActive ? 'border-[#D0E0C0]' : 'border-red-200 bg-gray-50'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Left Image Preview */}
                <div className="w-32 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={slide.leftImage.startsWith('/uploads') 
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${slide.leftImage}` 
                      : slide.leftImage}
                    alt={slide.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Slide Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#1A4D3E]">{slide.title}</h3>
                    {slide.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Inactive</span>
                    )}
                  </div>
                  {slide.subtitle && (
                    <p className="text-sm text-[#8A9B6E] mb-1">{slide.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#8A9B6E]">
                    <span>Order: {slide.order}</span>
                    <span>Button: {slide.buttonText}</span>
                    <span>Link: {slide.buttonLink}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSlide(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-[#8A9B6E] hover:text-[#1A4D3E] disabled:opacity-30"
                    title="Move Up"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() => moveSlide(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 text-[#8A9B6E] hover:text-[#1A4D3E] disabled:opacity-30"
                    title="Move Down"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    onClick={() => toggleActive(slide)}
                    className="p-2 text-[#8A9B6E] hover:text-[#1A4D3E]"
                    title={slide.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {slide.isActive ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 text-[#8BC34A] hover:bg-[#F5F9F0] rounded-lg"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Right and Mobile Image Previews */}
              <div className="flex gap-4 mt-3 pt-3 border-t border-[#D0E0C0]">
                <div className="flex items-center gap-2 text-xs text-[#8A9B6E]">
                  <FaImage />
                  <span>Right Image:</span>
                  <span className="text-[#1A4D3E] truncate max-w-[150px]">
                    {slide.rightImage?.split('/').pop()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8A9B6E]">
                  <FaImage />
                  <span>Mobile Image:</span>
                  <span className="text-[#1A4D3E] truncate max-w-[150px]">
                    {slide.mobileImage?.split('/').pop() || 'Same as left'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {slides.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#D0E0C0]">
          <FaImage className="text-4xl text-[#8A9B6E] mx-auto mb-3" />
          <p className="text-[#1A4D3E] font-semibold">No carousel slides added yet</p>
          <p className="text-sm text-[#8A9B6E] mt-1">Click the "Add Slide" button to get started</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BC34A]"></div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#D0E0C0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1A4D3E]">
                    {editingSlide ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-[#F5F9F0] rounded-xl transition-colors"
                  >
                    <FaTimes className="text-[#8A9B6E]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title and Subtitle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Navratri Collection"
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g., Discover our festive collection"
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    />
                  </div>
                </div>

                {/* Button Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      placeholder="Shop Now"
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      placeholder="/products"
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    />
                  </div>
                </div>

                {/* Order and Background Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1A4D3E] font-semibold mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border border-[#D0E0C0] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        className="flex-1 px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E]"
                      />
                    </div>
                  </div>
                </div>

              {/* Left Image */}
<div>
  <label className="block text-[#1A4D3E] font-semibold mb-2">
    Left Image *
  </label>
  <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
    {imagePreviews.left ? (
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src={imagePreviews.left}
          alt="Left Preview"
          fill
          className="object-cover rounded-lg"
          unoptimized
        />
        <button
          type="button"
          onClick={() => {
            setImagePreviews(prev => ({ ...prev, left: null }));
            setFormData({ ...formData, leftImage: null });
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <FaTimes size={12} />
        </button>
      </div>
    ) : (
      <>
        <FaUpload className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
        <p className="text-[#1A4D3E] mb-2">Click to upload left image</p>
        <p className="text-xs text-[#8A9B6E]">PNG, JPG, GIF up to 5MB</p>
      </>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleImageChange('leftImage', e)}
      className="hidden"
      id="left-image"
    />
    <label
      htmlFor="left-image"
      className="inline-block mt-3 bg-[#8BC34A] text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-[#5A9E4E] transition-colors text-sm"
    >
      {imagePreviews.left ? 'Change Image' : 'Browse Files'}
    </label>
  </div>
</div>

{/* Right Image */}
<div>
  <label className="block text-[#1A4D3E] font-semibold mb-2">
    Right Image *
  </label>
  <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
    {imagePreviews.right ? (
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src={imagePreviews.right}
          alt="Right Preview"
          fill
          className="object-cover rounded-lg"
          unoptimized
        />
        <button
          type="button"
          onClick={() => {
            setImagePreviews(prev => ({ ...prev, right: null }));
            setFormData({ ...formData, rightImage: null });
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <FaTimes size={12} />
        </button>
      </div>
    ) : (
      <>
        <FaUpload className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
        <p className="text-[#1A4D3E] mb-2">Click to upload right image</p>
        <p className="text-xs text-[#8A9B6E]">PNG, JPG, GIF up to 5MB</p>
      </>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleImageChange('rightImage', e)}
      className="hidden"
      id="right-image"
    />
    <label
      htmlFor="right-image"
      className="inline-block mt-3 bg-[#8BC34A] text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-[#5A9E4E] transition-colors text-sm"
    >
      {imagePreviews.right ? 'Change Image' : 'Browse Files'}
    </label>
  </div>
</div>

{/* Mobile Image (Optional) */}
<div>
  <label className="block text-[#1A4D3E] font-semibold mb-2">
    Mobile Image (Optional)
  </label>
  <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
    {imagePreviews.mobile ? (
      <div className="relative w-32 h-32 mx-auto">
        <Image
          src={imagePreviews.mobile}
          alt="Mobile Preview"
          fill
          className="object-cover rounded-lg"
          unoptimized
        />
        <button
          type="button"
          onClick={() => {
            setImagePreviews(prev => ({ ...prev, mobile: null }));
            setFormData({ ...formData, mobileImage: null });
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <FaTimes size={12} />
        </button>
      </div>
    ) : (
      <>
        <FaUpload className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
        <p className="text-[#1A4D3E] mb-2">Click to upload mobile image</p>
        <p className="text-xs text-[#8A9B6E]">Leave empty to use left image on mobile</p>
      </>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => handleImageChange('mobileImage', e)}
      className="hidden"
      id="mobile-image"
    />
    <label
      htmlFor="mobile-image"
      className="inline-block mt-3 bg-[#8BC34A] text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-[#5A9E4E] transition-colors text-sm"
    >
      {imagePreviews.mobile ? 'Change Image' : 'Browse Files'}
    </label>
  </div>
</div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-[#D0E0C0] text-[#1A4D3E] rounded-xl hover:bg-[#F5F9F0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {editingSlide ? 'Update' : 'Add'} Slide
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarouselManagement;