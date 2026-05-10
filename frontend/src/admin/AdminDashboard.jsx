import { useEffect, useState } from 'react';
import { TrendingUp, Package, CheckCircle, AlertCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getOrders } from '../services/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg p-6 border-l-4" style={{ borderColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-charcoal mt-2">{value}</p>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      
      // Calculate stats
      const pending = data.filter(o => o.status === 'pending').length;
      const confirmed = data.filter(o => o.status === 'confirmed').length;
      const completed = data.filter(o => 
        ['ready-shipping', 'shipped', 'delivered'].includes(o.status)
      ).length;
      const cancelled = data.filter(o => o.status === 'cancelled').length;
      
      const totalRevenue = data.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
          return sum + (order.items?.reduce((itemSum, item) => itemSum + (item.price * item.quantity || 0), 0) || 0);
        }
        return sum;
      }, 0);

      setStats({
        totalOrders: data.length,
        pending,
        confirmed,
        completed,
        cancelled,
        totalRevenue,
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin panel. Manage orders and track business metrics.</p>
        </div>

        {/* Stats Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={Package}
              label="Total Orders"
              value={stats.totalOrders}
              color="#3B4F65"
            />
            <StatCard
              icon={AlertCircle}
              label="Pending Orders"
              value={stats.pending}
              color="#F59E0B"
            />
            <StatCard
              icon={CheckCircle}
              label="Confirmed Orders"
              value={stats.confirmed}
              color="#10B981"
            />
            <StatCard
              icon={TrendingUp}
              label="Completed"
              value={stats.completed}
              color="#8B5CF6"
            />
            <StatCard
              icon={AlertCircle}
              label="Cancelled"
              value={stats.cancelled}
              color="#EF4444"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Revenue"
              value={`KES ${stats.totalRevenue.toLocaleString()}`}
              color="#06B6D4"
            />
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-charcoal">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-charcoal font-semibold hover:text-gray-custom">
              View All →
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Order #</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <a href={`/admin/orders/${order._id}`} className="text-charcoal font-semibold hover:underline">
                          {order.orderNumber}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.customerInfo?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        KES {order.items?.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0).toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
