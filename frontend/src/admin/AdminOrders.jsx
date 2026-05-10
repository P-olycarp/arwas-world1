import { useEffect, useState } from 'react';
import { Search, ChevronRight, Filter, Edit } from 'lucide-react';
import AdminLayout from './AdminLayout';
import OrderDetailModal from './OrderDetailModal';
import { getOrders, updateOrder } from '../services/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  designing: 'bg-purple-100 text-purple-800',
  printing: 'bg-indigo-100 text-indigo-800',
  'quality-check': 'bg-orange-100 text-orange-800',
  'ready-shipping': 'bg-cyan-100 text-cyan-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = [
    'pending', 'confirmed', 'designing', 'printing', 'quality-check',
    'ready-shipping', 'shipped', 'delivered', 'cancelled'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search by order number, customer name, or email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(term) ||
        order.customerInfo?.name?.toLowerCase().includes(term) ||
        order.customerInfo?.email?.toLowerCase().includes(term) ||
        order.customerInfo?.phone?.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleSaveOrderDetails = async (orderData) => {
    try {
      await updateOrder(selectedOrder._id, orderData);
      fetchOrders();
      setShowDetailModal(false);
      setSelectedOrder(null);
      alert('Order updated successfully!');
    } catch (error) {
      console.error('Failed to save order:', error);
      throw error;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Orders Management</h1>
          <p className="text-gray-600 mt-2">View and manage all customer orders</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order #, customer name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-12 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Order #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Contact</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Source</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const total = order.items?.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0) || 0;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-semibold text-charcoal">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-charcoal">{order.customerInfo?.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{order.customerInfo?.country || ''}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-charcoal">{order.customerInfo?.email || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{order.customerInfo?.phone || ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.source === 'whatsapp'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {order.source === 'whatsapp' ? 'WhatsApp' : 'App'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal font-medium">
                          {order.items?.length || 0} item(s)
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-charcoal">
                          KES {total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditOrder(order)}
                              className="text-charcoal hover:text-gray-custom transition text-sm font-semibold bg-blue-100 px-3 py-1 rounded flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onSave={handleSaveOrderDetails}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
