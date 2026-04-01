// src/components/admin/HeroCategoryManagement.js
"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaImage, FaUpload, FaGripVertical } from 'react-icons/fa';
import { HeroCategoryApi } from '../../lib/HeroCategoryApi';
import Image from 'next/image';

const HeroCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    order: 0
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await HeroCategoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('order', formData.order);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingCategory) {
        await HeroCategoryApi.updateCategory(editingCategory._id, formDataToSend);
        alert('Category updated successfully!');
      } else {
        await HeroCategoryApi.addCategory(formDataToSend);
        alert('Category added successfully!');
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLoading(true);
        await HeroCategoryApi.deleteCategory(id);
        alert('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: null,
      order: category.order
    });
    setImagePreview(category.image);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: null,
      order: 0
    });
    setImagePreview(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A4D3E]">Hero Section Categories</h2>
          <p className="text-[#8A9B6E] mt-1">Manage categories displayed on the hero section</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-[#8BC34A] to-[#5A9E4E] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 border border-[#D0E0C0] hover:shadow-lg transition-all group"
          >
            {/* Category Image */}
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#777E5C] mb-3">
              <Image
                src={category.image.startsWith('/uploads') 
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${category.image}` 
                  : category.image}
                alt={category.name}
                unoptimized
                fill
                className="object-fit"
              />
            </div>
            
            {/* Category Name */}
            <h3 className="text-center font-semibold text-[#1A4D3E] text-sm uppercase">
              {category.name}
            </h3>
            
            {/* Order Number */}
            <p className="text-center text-xs text-[#8A9B6E] mt-1">
              Order: {category.order}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-[#8BC34A] hover:bg-[#F5F9F0] rounded-lg transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#D0E0C0]">
          <FaImage className="text-4xl text-[#8A9B6E] mx-auto mb-3" />
          <p className="text-[#1A4D3E] font-semibold">No categories added yet</p>
          <p className="text-sm text-[#8A9B6E] mt-1">Click the "Add Category" button to get started</p>
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
              className="bg-white rounded-3xl w-full max-w-md"
            >
              <div className="p-6 border-b border-[#D0E0C0]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#1A4D3E]">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                {/* Category Name */}
                <div>
                  <label className="block text-[#1A4D3E] font-semibold mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., SAREES, ETHNIC SETS"
                    className="w-full px-4 py-3 bg-[#F5F9F0] border border-[#D0E0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8BC34A] text-[#1A4D3E] uppercase"
                  />
                </div>

                {/* Order */}
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
                  <p className="text-xs text-[#8A9B6E] mt-1">Lower numbers appear first</p>
                </div>

                {/* Category Image */}
                <div>
                  <label className="block text-[#1A4D3E] font-semibold mb-2">
                    Category Image *
                  </label>
                  <div className="border-2 border-dashed border-[#D0E0C0] rounded-2xl p-6 text-center bg-[#F5F9F0]">
                    {imagePreview ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FaUpload className="text-3xl text-[#8A9B6E] mx-auto mb-3" />
                        <p className="text-[#1A4D3E] mb-2">Click to upload category image</p>
                        <p className="text-xs text-[#8A9B6E]">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="category-image"
                    />
                    <label
                      htmlFor="category-image"
                      className="inline-block mt-3 bg-[#8BC34A] text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-[#5A9E4E] transition-colors text-sm"
                    >
                      {imagePreview ? 'Change Image' : 'Browse Files'}
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
                        {editingCategory ? 'Update' : 'Add'} Category
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

export default HeroCategoryManagement;