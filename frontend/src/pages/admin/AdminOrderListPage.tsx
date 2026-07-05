import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { fetchAllOrders } from '@/api/orders';
import { Order } from '@/types';
import Loader from '@/components/Loader';
import Message from '@/components/Message';

const statusFilters = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'not_delivered', label: 'Not delivered' },
];

const AdminOrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchAllOrders(status || undefined)
      .then(setOrders)
      .catch(() => setError('Could not load orders'))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold">Orders ({orders.length})</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
        >
          {statusFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
      <div className="overflow-x-auto bg-white border border-ink/8 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wider border-b border-ink/8">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Paid</th>
              <th className="p-4 font-medium">Delivered</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-ink/8 last:border-0">
                <td className="p-4 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                <td className="p-4">{typeof order.user === 'object' ? order.user.name : order.user}</td>
                <td className="p-4 text-ink/60">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-medium">${order.totalPrice.toFixed(2)}</td>
                <td className="p-4">{order.isPaid ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400" />}</td>
                <td className="p-4">{order.isDelivered ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400" />}</td>
                <td className="p-4">
                  <Link to={`/orders/${order._id}`} className="text-brand-600 font-medium">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default AdminOrderListPage;
