import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getOrder, updateOrderStatus } from '../services/api';

const STATUS_FLOW = [
  'pending', 'confirmed', 'designing', 'printing', 
  'quality-check', 'ready-shipping', 'shipped', 'delivered'
];

const STATUS_ICONS = {
  pending: '⏱️',
  confirmed: '✓',
  designing: '🎨',
  printing: '🖨️',
  'quality-check': '🔍',
  'ready-shipping': '📦',
  shipped: '🚚',
  delivered: '✅',
  cancelled: '✗'
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrder(id);
      setOrder(data);
      setNewStatus(data.status);
      setInternalNotes(data.internalNotes || '');
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) {
      alert('Please select a different status');
      return;
    }

    try {
      setUpdating(true);
      const updatedOrder = await updateOrderStatus(id, {
        status: newStatus,
        internalNotes
      });
      setOrder(updatedOrder);
      alert('Order updated successfully!');
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading order...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Order not found</p>
        </div>
      </AdminLayout>
    );
  }

  const total = order.items?.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0) || 0;
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-charcoal hover:text-gray-custom transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-charcoal">{order.orderNumber}</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Created {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-charcoal mb-4">Order Status Timeline</h2>
              <div className="space-y-3">
                {STATUS_FLOW.map((status, index) => (
                  <div
                    key={status}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index <= currentStatusIndex ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{STATUS_ICONS[status]}</span>
                    <span className={index <= currentStatusIndex ? 'font-semibold text-green-800' : 'text-gray-600'}>
                      {status.replace('-', ' ').toUpperCase()}
                    </span>
                    {order.status === status && (
                      <span className="ml-auto text-xs font-semibold text-green-600">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-charcoal mb-4">Order Items</h2>
              <div className="divide-y divide-gray-200">
                {order.items?.map((item, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-charcoal">{item.productName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="inline-block mr-4">Size: <strong>{item.size}</strong></span>
                          <span className="inline-flex items-center gap-2">
                            Color: <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          </span>
                        </p>
                        {item.printingMethod && (
                          <p className="text-sm text-gray-600">Printing: <strong>{item.printingMethod}</strong></p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-charcoal">KES {(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Customer Notes</h3>
                <p className="text-blue-800 text-sm">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-charcoal mb-4">Customer Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-semibold text-charcoal">{order.customerInfo?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold text-charcoal">{order.customerInfo?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold text-charcoal">{order.customerInfo?.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Country</p>
                  <p className="font-semibold text-charcoal">{order.customerInfo?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-charcoal mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({order.items?.length || 0})</span>
                  <span className="font-semibold text-charcoal">KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-charcoal">Pending</span>
                </div>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-charcoal">Total</span>
                <span className="font-semibold text-charcoal">KES {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-charcoal">Update Status</h2>
              
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              >
                <option value="">Select Status</option>
                {STATUS_FLOW.map(status => (
                  <option key={status} value={status}>
                    {status.replace('-', ' ').toUpperCase()}
                  </option>
                ))}
              </select>

              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add internal notes (only visible to admin)..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal resize-none"
              />

              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.status}
                className="w-full bg-charcoal text-white py-2 rounded-lg font-semibold hover:bg-gray-custom transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {updating ? 'Updating...' : 'Update Order'}
              </button>
            </div>

            {/* Contact Customer */}
            <a
              href={`https://wa.me/${order.customerInfo?.phone?.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(order.customerInfo?.name || 'Customer')}%2C%20your%20order%20${order.orderNumber}%20status%20has%20been%20updated.`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition text-center text-sm"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
