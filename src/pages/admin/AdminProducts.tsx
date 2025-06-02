import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description?: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    description: ''
  });
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      image: '',
      description: ''
    });
  };
  
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };
  
  const closeAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };
  
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
      description: product.description || ''
    });
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentProduct(null);
    resetForm();
  };
  
  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentProduct(null);
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category || !formData.stock || !formData.image) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Create new product
    const newProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image,
      description: formData.description
    };
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setProducts([...products, response.data]);
        toast.success('Product added successfully!');
        closeAddModal();
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Failed to add product');
      }
    };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category || !formData.stock || !formData.image) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Update product
    const updatedProduct = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      image: formData.image,
      description: formData.description
    };
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/products/${currentProduct._id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setProducts(products.map(p => p._id === currentProduct._id ? response.data : p));
        toast.success('Product updated successfully!');
        closeEditModal();
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product');
      }
    };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${currentProduct._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setProducts(products.filter(p => p._id !== currentProduct._id));
        toast.success('Product deleted successfully!');
        closeDeleteModal();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-neutral-800">Products</h1>
            <p className="text-neutral-600">Manage your candle inventory</p>
          </div>
          <button
            onClick={openAddModal}
            className="mt-4 sm:mt-0 btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Product
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or category"
              value={searchTerm}
              onChange={handleSearch}
              className="input pl-10"
            />
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-6">
              <p className="text-neutral-600">No products found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={closeAddModal}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-neutral-900">Add New Product</h3>
                  <button onClick={closeAddModal} className="text-neutral-400 hover:text-neutral-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleAddProduct}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
                        Price (Rs.)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-neutral-700 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="input"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Cozy">Cozy</option>
                      <option value="Fresh">Fresh</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Floral">Floral</option>
                      <option value="Refreshing">Refreshing</option>
                      <option value="Woody">Woody</option>
                      <option value="Energizing">Energizing</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-neutral-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="input"
                    ></textarea>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Add Product
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline mt-3 sm:mt-0"
                      onClick={closeAddModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={closeEditModal}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-neutral-900">Edit Product</h3>
                  <button onClick={closeEditModal} className="text-neutral-400 hover:text-neutral-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleUpdateProduct}>
                  <div className="mb-4">
                    <label htmlFor="edit-name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="edit-price" className="block text-sm font-medium text-neutral-700 mb-1">
                        Price (Rs.)
                      </label>
                      <input
                        type="number"
                        id="edit-price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-stock" className="block text-sm font-medium text-neutral-700 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        id="edit-stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="input"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="edit-category" className="block text-sm font-medium text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      id="edit-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Cozy">Cozy</option>
                      <option value="Fresh">Fresh</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Floral">Floral</option>
                      <option value="Refreshing">Refreshing</option>
                      <option value="Woody">Woody</option>
                      <option value="Energizing">Energizing</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="edit-image" className="block text-sm font-medium text-neutral-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="edit-image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="edit-description" className="block text-sm font-medium text-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="input"
                    ></textarea>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Update Product
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline mt-3 sm:mt-0"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={closeDeleteModal}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-neutral-900">Delete Product</h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        Are you sure you want to delete "{currentProduct.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteProduct}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;