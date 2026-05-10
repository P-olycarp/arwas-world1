import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

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
const COLOR_OPTIONS = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#FFFFFF' },
  { name: 'Red', code: '#FF0000' },
  { name: 'Blue', code: '#0000FF' },
  { name: 'Green', code: '#00AA00' },
  { name: 'Yellow', code: '#FFFF00' },
  { name: 'Gray', code: '#808080' },
  { name: 'Navy', code: '#000080' },
];

export default function AddProductModal({ product, onSave, onClose, categories = DEFAULT_COLLECTIONS }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    basePrice: '',
    category: 't-shirt',
    image: '',
    sizes: [],
    colors: [],
    stock: '',
    printingMethods: [],
    minOrderQuantity: 1,
    customizable: true,
    bulkDiscounts: [],
    mugDetails: {
      material: '',
      capacity: '',
      printPlacement: '',
      dishwasherSafe: false,
      microwave: false
    },
    onOffer: false, // New field for shirts on offer
    offerOrder: 0, // New field for On Offer display order
    currency: 'KES' // New field for currency
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        offerOrder: product.offerOrder ?? 0
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (warn if > 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is larger than 5MB. Compressing image...');
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Compress image using canvas
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Reduce size if image is larger than 1200px
          if (width > 1200) {
            height = height * (1200 / width);
            width = 1200;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression (0.8 quality)
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, image: base64 }));
          setImagePreview(base64);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.some(c => c.code === color.code)
        ? prev.colors.filter(c => c.code !== color.code)
        : [...prev.colors, color]
    }));
  };

  const handlePrintingMethodToggle = (method) => {
    setFormData(prev => ({
      ...prev,
      printingMethods: prev.printingMethods.includes(method)
        ? prev.printingMethods.filter(m => m !== method)
        : [...prev.printingMethods, method]
    }));
  };

  const handleMugDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      mugDetails: {
        ...prev.mugDetails,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.description || !formData.image) {
      alert('Please fill in all required fields: Name, Price, Category, Description, Image');
      return;
    }

    // Auto-fill basePrice with price if empty
    const submitData = {
      ...formData,
      basePrice: formData.basePrice || formData.price,
      price: Number(formData.price),
      stock: Number(formData.stock) || 0,
      minOrderQuantity: Number(formData.minOrderQuantity) || 1
    };

    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-charcoal">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-charcoal transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Product Image *</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
                <p className="text-xs text-gray-600 mt-1">Upload JPG, PNG (or paste URL below)</p>
              </div>
              {imagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Or paste image URL here..."
              value={formData.image}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, image: e.target.value }));
                setImagePreview(e.target.value);
              }}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal text-sm"
              required
            />
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Category (Shop Section) *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                required
              >
                <option value="gift-boxes">Customised Gift Boxes</option>
                <option value="caps">Customised Caps</option>
                <option value="mugs">Mugs</option>
                <option value="bottles">Water Bottles</option>
                <option value="hoodies">Hoodies</option>
                <option value="polo-shirts">Polo Shirts</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="jerseys">Jerseys</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Price ({formData.currency}) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Min Order Quantity</label>
              <input
                type="number"
                name="minOrderQuantity"
                value={formData.minOrderQuantity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal resize-none"
              placeholder="Product description..."
              required
            />
          </div>

          {/* Mug Details (if category is mug) */}
          {formData.category === 'mug' && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-charcoal">Mug Details</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.mugDetails.material}
                    onChange={handleMugDetailChange}
                    placeholder="e.g., Ceramic, Stainless Steel, Enamel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Capacity</label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.mugDetails.capacity}
                    onChange={handleMugDetailChange}
                    placeholder="e.g., 11oz, 15oz, 20oz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Print Placement</label>
                  <input
                    type="text"
                    name="printPlacement"
                    value={formData.mugDetails.printPlacement}
                    onChange={handleMugDetailChange}
                    placeholder="e.g., Wrap Around, Front, Handle"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-charcoal mb-2">Care Instructions</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="dishwasherSafe"
                      checked={formData.mugDetails.dishwasherSafe}
                      onChange={handleMugDetailChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-charcoal">Dishwasher Safe</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="microwave"
                      checked={formData.mugDetails.microwave}
                      onChange={handleMugDetailChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-charcoal">Microwave Safe</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Sizes (only for apparel items, not mugs) */}
          {formData.category !== 'mug' && (
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    formData.sizes.includes(size)
                      ? 'bg-charcoal text-white'
                      : 'bg-gray-200 text-charcoal hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>          )}
          {/* Colors */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">Available Colors</label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color.code}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border-2 transition ${
                    formData.colors.some(c => c.code === color.code)
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-gray-300 bg-white text-charcoal hover:border-charcoal'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: color.code }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Printing Methods */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">Printing Methods</label>
            <div className="flex flex-wrap gap-2">
              {PRINTING_METHODS.map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handlePrintingMethodToggle(method)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    formData.printingMethods.includes(method)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-charcoal hover:bg-gray-300'
                  }`}
                >
                  {method.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Customizable */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="customizable"
              checked={formData.customizable}
              onChange={handleInputChange}
              id="customizable"
              className="w-4 h-4"
            />
            <label htmlFor="customizable" className="text-sm font-semibold text-charcoal cursor-pointer">
              Customizable (allow custom printing)
            </label>
          </div>


          {/* On Offer + Offer Order */}
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              name="onOffer"
              checked={formData.onOffer}
              onChange={handleInputChange}
              id="onOffer"
              className="w-4 h-4"
            />
            <label htmlFor="onOffer" className="text-sm font-semibold text-charcoal cursor-pointer">
              Mark as "On Offer" (show in On Offer section)
            </label>
          </div>
          {formData.onOffer && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-charcoal mb-2">On Offer Display Order</label>
              <input
                type="number"
                name="offerOrder"
                value={formData.offerOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                placeholder="Lower numbers appear first"
              />
              <p className="text-xs text-gray-600 mt-1">Set the order for this product in the On Offer slider. Lower numbers appear first.</p>
            </div>
          )}

          {/* Currency */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Currency *</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              required
            >
              <option value="KES">KES (Kenyan Shilling)</option>
              <option value="OMR">OMR (Omani Rial)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-charcoal hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-charcoal text-white rounded-lg font-semibold hover:bg-gray-custom transition"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
