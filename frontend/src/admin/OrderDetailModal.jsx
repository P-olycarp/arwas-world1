import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function OrderDetailModal({ order, onSave, onClose }) {
  const [formData, setFormData] = useState({
    deliveryDetails: {
      estimatedDeliveryDate: '',
      actualDeliveryDate: '',
      trackingNumber: '',
      shippingCompany: '',
      shippingCost: '',
      deliveryInstructions: ''
    },
    internalNotes: '',
    status: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) {
      setFormData({
        deliveryDetails: {
          estimatedDeliveryDate: order.deliveryDetails?.estimatedDeliveryDate?.split('T')[0] || '',
          actualDeliveryDate: order.deliveryDetails?.actualDeliveryDate?.split('T')[0] || '',
          trackingNumber: order.deliveryDetails?.trackingNumber || '',
          shippingCompany: order.deliveryDetails?.shippingCompany || '',
          shippingCost: order.deliveryDetails?.shippingCost || '',
          deliveryInstructions: order.deliveryDetails?.deliveryInstructions || ''
        },
        internalNotes: order.internalNotes || '',
        status: order.status || ''
      });
    }
  }, [order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      deliveryDetails: {
        ...prev.deliveryDetails,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        deliveryDetails: {
          ...formData.deliveryDetails,
          shippingCost: formData.deliveryDetails.shippingCost ? Number(formData.deliveryDetails.shippingCost) : 0
        }
      };
      await onSave(submitData);
    } catch (err) {
      setError(err.message || 'Failed to save order details');
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    'pending', 'confirmed', 'designing', 'printing', 'quality-check',
    'ready-shipping', 'shipped', 'delivered', 'cancelled'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              Order: {order?.orderNumber}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Customer: {order?.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-charcoal transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Order Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              required
            >
              <option value="">Select Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Details Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-charcoal">Delivery Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Shipping Company</label>
                <input
                  type="text"
                  name="shippingCompany"
                  value={formData.deliveryDetails.shippingCompany}
                  onChange={handleDeliveryChange}
                  placeholder="e.g., Feddex, DHL, Local Courier"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Tracking Number</label>
                <input
                  type="text"
                  name="trackingNumber"
                  value={formData.deliveryDetails.trackingNumber}
                  onChange={handleDeliveryChange}
                  placeholder="e.g., 1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Estimated Delivery Date</label>
                <input
                  type="date"
                  name="estimatedDeliveryDate"
                  value={formData.deliveryDetails.estimatedDeliveryDate}
                  onChange={handleDeliveryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Actual Delivery Date</label>
                <input
                  type="date"
                  name="actualDeliveryDate"
                  value={formData.deliveryDetails.actualDeliveryDate}
                  onChange={handleDeliveryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Shipping Cost (KES)</label>
                <input
                  type="number"
                  name="shippingCost"
                  value={formData.deliveryDetails.shippingCost}
                  onChange={handleDeliveryChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Delivery Instructions</label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryDetails.deliveryInstructions}
                onChange={handleDeliveryChange}
                placeholder="Special instructions for delivery..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal resize-none"
              />
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Internal Notes (for admin only)</label>
            <textarea
              name="internalNotes"
              value={formData.internalNotes}
              onChange={handleInputChange}
              placeholder="Add internal notes about this order..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal resize-none"
            />
          </div>

          {/* Shipping Address Display */}
          {order?.shippingAddress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-charcoal mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-700">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-charcoal font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
