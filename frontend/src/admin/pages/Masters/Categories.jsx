import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch categories error:', err);
      setError('Failed to load categories. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  // Fill form when editing
  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      description: cat.description || ''
    });
    setIsEditing(true);
    setEditingId(cat._id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError('Category name is required');
      return;
    }

    // Client-side duplicate check (skip for edit if same name)
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === trimmedName.toLowerCase() && c._id !== editingId
    );
    if (isDuplicate) {
      setError('This category name already exists');
      return;
    }

    try {
      let res;
      if (isEditing) {
        // Update
        res = await api.put(`/categories/${editingId}`, {
          name: trimmedName,
          description: formData.description.trim()
        });
        setSuccess('Category updated successfully!');
      } else {
        // Create
        res = await api.post('/categories', {
          name: trimmedName,
          description: formData.description.trim()
        });
        setSuccess('Category added successfully!');
      }

      // Refresh list
      await fetchCategories();

      // Reset form
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || (isEditing ? 'Failed to update' : 'Failed to add') + ' category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products may lose their category assignment.')) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      setSuccess('Category deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-900">Categories Master</h1>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setEditingId(null);
            setFormData({ name: '', description: '' });
            setError('');
            setSuccess('');
          }}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {/* Form - Add or Edit */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. herbicide"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="3"
                placeholder="Brief description (optional)"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({ name: '', description: '' });
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm"
              >
                {isEditing ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-600 mb-3">
            No categories yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add your first category to start organizing products
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            + Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat._id} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold text-teal-800 mb-2 capitalize">
                {cat.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {cat.description || 'No description provided'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {cat.count || 0} products
                </span>
                <div className="space-x-3">
                  <button 
                    onClick={() => handleEdit(cat)}
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}