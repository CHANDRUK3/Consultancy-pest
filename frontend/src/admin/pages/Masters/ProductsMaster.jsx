import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ProductsMaster() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ← this will hold real categories
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    category: '',
    manufacturer: '',
    unit: '',
    packSize: '',
    hsnCode: '',
    reorderLevel: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch products & categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')  // ← this fetches real categories
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data); // ← stores them here
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load products or categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fill form for edit
  const handleEdit = (product) => {
    setFormData({
      productCode: product.productCode || '',
      productName: product.productName || '',
      category: product.category || '', // will match lowercase from DB
      manufacturer: product.manufacturer || '',
      unit: product.unit || '',
      packSize: product.packSize || '',
      hsnCode: product.hsnCode || '',
      reorderLevel: product.reorderLevel || '',
      description: product.description || ''
    });
    setIsEditing(true);
    setEditingId(product._id);
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

    if (!formData.productCode.trim() || !formData.productName.trim() || 
        !formData.category || !formData.unit || !formData.hsnCode.trim() || 
        !formData.reorderLevel) {
      setError('All required fields must be filled');
      return;
    }

    try {
      let res;
      if (isEditing) {
        res = await api.put(`/products/${editingId}`, formData);
        setProducts(prev => prev.map(p => p._id === editingId ? res.data.product : p));
        setSuccess('Product updated successfully!');
      } else {
        res = await api.post('/products', formData);
        setProducts(prev => [...prev, res.data.product]);
        setSuccess('Product added successfully!');
      }

      // Reset form
      setFormData({
        productCode: '', productName: '', category: '', manufacturer: '',
        unit: '', packSize: '', hsnCode: '', reorderLevel: '', description: ''
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || (isEditing ? 'Update failed' : 'Add failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      setSuccess('Product deleted');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-900">Product Master</h1>
          <p className="text-gray-600 mt-1">{products.length} products</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setIsEditing(false);
            setEditingId(null);
            setFormData({ productCode: '', productName: '', category: '', manufacturer: '', unit: '', packSize: '', hsnCode: '', reorderLevel: '', description: '' });
            setError('');
            setSuccess('');
          }}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
        >
          + Add New Product
        </button>
      </div>

      {/* Form - Add or Edit */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-semibold text-teal-800 mb-6">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">{error}</div>}
          {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r">{success}</div>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Product Code *</label>
              <input type="text" name="productCode" value={formData.productCode} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
              <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>

            {/* Category Dropdown - FIXED: uses real categories from DB */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} ({cat.count || 0} products)
                  </option>
                ))}
              </select>
              {categories.length === 0 && !loading && (
                <p className="text-sm text-amber-600 mt-1">
                  No categories found. Add some in Categories page first.
                </p>
              )}
            </div>

            {/* Other fields */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Manufacturer</label>
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Unit *</label>
              <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg bg-white" required>
                <option value="">-- Select --</option>
                <option value="Liter">Liter</option>
                <option value="Kg">Kg</option>
                <option value="Gram">Gram</option>
                <option value="ml">ml</option>
                <option value="Packet">Packet</option>
                <option value="Piece">Piece</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Pack Size</label>
              <input type="number" name="packSize" value={formData.packSize} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" min="0" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">HSN Code *</label>
              <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Reorder Level *</label>
              <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" min="0" required />
            </div>

            <div className="md:col-span-3">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 border rounded-lg" />
            </div>

            <div className="md:col-span-3 flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({ productCode: '', productName: '', category: '', manufacturer: '', unit: '', packSize: '', hsnCode: '', reorderLevel: '', description: '' });
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md transition"
              >
                {isEditing ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Code</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Unit</th>
                <th className="px-6 py-4 text-left">Reorder</th>
                <th className="px-6 py-4 text-left">HSN</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{prod.productCode}</td>
                  <td className="px-6 py-4">{prod.productName}</td>
                  <td className="px-6 py-4 capitalize">{prod.category}</td>
                  <td className="px-6 py-4">{prod.unit}</td>
                  <td className="px-6 py-4">{prod.reorderLevel}</td>
                  <td className="px-6 py-4">{prod.hsnCode}</td>
                  <td className="px-6 py-4 flex gap-4">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-teal-600 hover:text-teal-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No products found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}