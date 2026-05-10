import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../services/api';
import { Clock, CheckCircle, XCircle, Truck, RefreshCw, MessageCircle } from 'lucide-react';

const ORDER_STATUSES = {
  pending: { label: 'Pending', icon: Clock, color: 'text-orange-600' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600' },
  designing: { label: 'Designing', icon: Clock, color: 'text-purple-600' },
  printing: { label: 'Printing', icon: Clock, color: 'text-indigo-600' },
  'quality-check': { label: 'Quality Check', icon: CheckCircle, color: 'text-cyan-600' },
  'ready-shipping': { label: 'Ready for Shipping', icon: Truck, color: 'text-green-600' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-green-600' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-700' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600' }
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-orders');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh order status every 15 seconds
  useEffect(() => {
    if (!order) return;

    const interval = setInterval(async () => {
      try {
        const updatedOrder = await getOrder(order._id);
        setOrder(updatedOrder);
      } catch (err) {
        console.error('Failed to refresh order:', err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [order]);

  if (!user) {
    return (
      <div className="min-h-screen bg-off-white py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-4 sm:mb-6">Your Orders</h1>
          <div className="bg-white p-6 sm:p-12 rounded-lg">
            <p className="text-lg sm:text-xl text-gray-custom mb-6 sm:mb-8">
              Please log in to view your orders
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-block bg-charcoal text-white px-6 sm:px-8 py-3 font-semibold hover:bg-gray-custom transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await getOrder(orderId);
      setOrder(data);
    } catch (err) {
      setError('Order not found. Please check the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshOrder = async () => {
    if (!order) return;
    setRefreshing(true);
    try {
      const updatedOrder = await getOrder(order._id);
      setOrder(updatedOrder);
    } catch (err) {
      setError('Failed to refresh order');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelingId(id);
    try {
      await updateOrderStatus(id, 'cancelled', 'Cancelled by customer');
      setOrder(prev => prev && prev._id === id ? { ...prev, status: 'cancelled' } : prev);
    } catch (err) {
      alert('Failed to cancel order');
    } finally {
      setCancelingId(null);
    }
  };

  const canCancel = order && ['pending', 'confirmed', 'designing'].includes(order.status);

  return (
    <div className="min-h-screen bg-off-white py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-8 sm:mb-12">Your Orders</h1>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`py-3 px-4 sm:px-6 font-semibold transition text-left sm:text-center ${
              activeTab === 'my-orders'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-gray-custom'
            }`}
          >
            Account Orders
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`py-3 px-4 sm:px-6 font-semibold transition text-left sm:text-center ${
              activeTab === 'track'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-gray-custom'
            }`}
          >
            Track Order (No Account)
          </button>
        </div>

        {/* WhatsApp Orders Message */}
        {activeTab === 'my-orders' && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 p-6 sm:p-8 rounded-lg mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <MessageCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-3">Orders Now on WhatsApp!</h2>
                <p className="text-gray-custom mb-4">
                  We've simplified our ordering process! All orders are now placed directly through WhatsApp for a faster and more personal experience.
                </p>
                <div className="space-y-2 mb-4 text-sm text-gray-700">
                  <p>✓ No account needed</p>
                  <p>✓ Quick communication with our team</p>
                  <p>✓ Instant confirmation and updates</p>
                </div>
                <a
                  href="https://wa.me/254112126757?text=Hi, I'd like to place an order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-semibold hover:bg-green-700 transition rounded-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Track Order Tab */}
        {activeTab === 'track' && (
          <div className="bg-white p-6 sm:p-8 rounded-lg mb-8">
            <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-4 sm:mb-6">Track Your Order</h2>
            <p className="text-gray-custom mb-6">
              Don't have an account? Enter your order number to track your status
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORD-1712591234567"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
              />
              <button
                onClick={handleTrackOrder}
                disabled={loading}
                className="bg-charcoal text-white px-6 sm:px-8 py-3 font-semibold hover:bg-gray-custom transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="bg-white p-6 sm:p-8 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-charcoal mb-2">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-gray-custom">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left sm:text-right space-y-4 w-full sm:w-auto">
                <button
                  onClick={handleRefreshOrder}
                  disabled={refreshing}
                  className="flex items-center gap-2 sm:ml-auto text-charcoal font-semibold hover:text-gray-custom transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Status'}
                </button>
                <div className="flex items-center gap-2 sm:justify-end">
                  {ORDER_STATUSES[order.status] && (
                    <>
                      {(() => {
                        const Status = ORDER_STATUSES[order.status].icon;
                        return <Status className={`w-5 h-5 ${ORDER_STATUSES[order.status].color}`} />;
                      })()}
                      <span className={`font-semibold ${ORDER_STATUSES[order.status].color}`}>
                        {ORDER_STATUSES[order.status].label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-semibold text-charcoal mb-4">Items</h3>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-charcoal">{item.productName}</p>
                    <p className="text-sm text-gray-custom">
                      Qty: {item.quantity} | Size: {item.size} | Printing: {item.printingMethod}
                    </p>
                  </div>
                  <p className="font-semibold text-charcoal">
                    KES {item.totalPrice?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Customer Details */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-semibold text-charcoal mb-4">Customer & Delivery Details</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm text-gray-custom font-semibold mb-3">Delivery Address</h4>
                  <p><span className="text-gray-custom">Name:</span> {order.customerName}</p>
                  <p><span className="text-gray-custom">Email:</span> {order.customerEmail}</p>
                  <p><span className="text-gray-custom">Phone:</span> {order.customerPhone}</p>
                  <p><span className="text-gray-custom">Country:</span> {order.customerCountry}</p>
                </div>
              </div>
            </div>

            {/* Order Summary and Shipping Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-charcoal mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-custom">Subtotal</span>
                    <span>KES {order.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-custom">Shipping</span>
                    <span>{order.deliveryDetails?.shippingCost ? `KES ${order.deliveryDetails.shippingCost.toLocaleString()}` : 'To be confirmed'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-charcoal">KES {order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Information */}
              <div>
                <h3 className="font-semibold text-charcoal mb-4">Shipping & Delivery</h3>
                <div className="space-y-3">
                  {order.deliveryDetails?.shippingCompany && (
                    <div>
                      <p className="text-sm text-gray-custom">Shipping Company</p>
                      <p className="font-semibold text-charcoal">{order.deliveryDetails.shippingCompany}</p>
                    </div>
                  )}
                  {order.deliveryDetails?.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-custom">Tracking Number</p>
                      <p className="font-semibold text-charcoal font-mono text-sm">{order.deliveryDetails.trackingNumber}</p>
                    </div>
                  )}
                  {order.deliveryDetails?.estimatedDeliveryDate && (
                    <div>
                      <p className="text-sm text-gray-custom">Estimated Delivery</p>
                      <p className="font-semibold text-charcoal">
                        {new Date(order.deliveryDetails.estimatedDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {order.deliveryDetails?.actualDeliveryDate && (
                    <div>
                      <p className="text-sm text-gray-custom">Delivered On</p>
                      <p className="font-semibold text-charcoal">
                        {new Date(order.deliveryDetails.actualDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {order.deliveryDetails?.deliveryInstructions && (
                    <div>
                      <p className="text-sm text-gray-custom">Special Instructions</p>
                      <p className="text-charcoal text-sm">{order.deliveryDetails.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="font-semibold text-charcoal mb-4">Payment Information</h3>
              {order.source === 'whatsapp' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-3">
                    <strong>WhatsApp Order</strong>
                  </p>
                  <p className="text-sm text-blue-800">
                    Our team will contact you via WhatsApp to arrange payment and confirm the final details of your order. You can expect to hear from us within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-green-700"><strong>Payment Method:</strong> M-Pesa</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700"><strong>Order Amount:</strong> KES {order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700"><strong>Status:</strong> {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}</p>
                  </div>
                  {order.paymentStatus === 'pending' && (
                    <p className="text-sm text-green-800 mt-2">
                      Please complete your M-Pesa payment. Once we receive your payment, we'll update your order status.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="font-semibold text-charcoal mb-2">Order Notes</h3>
                <p className="text-gray-custom">{order.notes}</p>
              </div>
            )}

            {/* Internal Notes (if available) */}
            {order.internalNotes && (
              <div className="mb-8 pb-8 border-b border-gray-200 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-charcoal mb-2">Our Notes</h3>
                <p className="text-gray-custom">{order.internalNotes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              {canCancel && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={cancelingId === order._id}
                  className="bg-red-600 text-white px-6 sm:px-8 py-3 font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {cancelingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              <button
                onClick={() =>
                  window.open(
                    `https://wa.me/254112126757?text=Hi, I have a question about order ${order.orderNumber}`,
                    '_blank'
                  )
                }
                className="border-2 border-charcoal text-charcoal px-6 sm:px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition"
              >
                Contact Support on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
