import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, ChevronRight } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getProducts, createProduct, updateProduct, deleteProduct, getSettings } from '../services/api';
import AddProductModal from './AddProductModal';

const DEFAULT_COLLECTIONS = [
  { id: 't-shirt', name: 'T-Shirt' },
  { id: 'hoodie', name: 'Hoodie' },
  { id: 'jersey', name: 'Jersey' },
  { id: 'polo', name: 'Polo Shirt' },
  { id: 'merchandise', name: 'Merchandise' },
  { id: 'mug', name: 'Mug' }
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRINTING_METHODS = ['screen-print', 'dtg', 'embroidery', 'heat-transfer'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [error, setError] = useState('');
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const settings = await getSettings();
      const items = settings?.collections?.items;
      if (items && items.length > 0) {
        setCollections(items);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      setError('');
      console.log('Saving product with data:', productData);
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      fetchProducts();
      setShowModal(false);
      setEditingProduct(null);
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Failed to save product:', error);
      const errorMsg = error.message || 'Failed to save product';
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!categoryFilter || product.category === categoryFilter)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-charcoal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-custom transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 flex-col md:flex-row">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
          >
            <option value="">All Categories</option>
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
            <p className="text-gray-500">No products found. Create your first product!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-charcoal text-lg">{product.name}</h3>
                    <p className="text-xs text-gray-600 capitalize">
                      {product.category.replace('-', ' ')}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">Price</p>
                      <p className="text-xl font-bold text-charcoal">KES {product.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Stock</p>
                      <p className={`text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {product.sizes?.length || 0} sizes
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {product.colors?.length || 0} colors
                    </span>
                  </div>

                  {product.onOffer && (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded ml-2 font-bold text-xs">On Offer</span>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded font-semibold hover:bg-blue-100 transition"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded font-semibold hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <AddProductModal
          product={editingProduct}
          categories={collections}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </AdminLayout>
  );
}
