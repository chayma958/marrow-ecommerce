import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { fetchCoupons, createCoupon, deleteCoupon } from '@/api/coupons';
import { Coupon, CouponType } from '@/types';
import Loader from '@/components/Loader';
import Message from '@/components/Message';

const typeLabels: Record<CouponType, string> = {
  percentage: '% off',
  fixed: '$ off',
  free_shipping: 'Free shipping',
};

const AdminCouponListPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState<CouponType>('percentage');
  const [value, setValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(0);

  const load = () => {
    setLoading(true);
    fetchCoupons()
      .then(setCoupons)
      .catch(() => setError('Could not load coupons'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setCode('');
    setType('percentage');
    setValue(10);
    setMinOrderValue(0);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCoupon({ code, type, value: type === 'free_shipping' ? 0 : value, minOrderValue });
      toast.success('Coupon created');
      resetForm();
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    await deleteCoupon(id);
    toast.success('Coupon deleted');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Coupons ({coupons.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> New coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-ink/8 rounded-2xl p-5 mb-6 grid sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium mb-1.5">Code</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SAVE10"
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as CouponType)}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
            >
              <option value="percentage">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
              <option value="free_shipping">Free shipping</option>
            </select>
          </div>
          {type !== 'free_shipping' && (
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Value {type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                min={0}
                required
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5">Min order ($)</label>
            <input
              type="number"
              min={0}
              value={minOrderValue || ''}
              onChange={(e) => setMinOrderValue(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <button
            disabled={submitting}
            className="sm:col-span-4 bg-ink text-white py-2.5 rounded-full text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create coupon'}
          </button>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="overflow-x-auto bg-white border border-ink/8 rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wider border-b border-ink/8">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium">Min order</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-ink/8 last:border-0">
                  <td className="p-4 font-mono font-medium">{c.code}</td>
                  <td className="p-4 text-ink/60">{typeLabels[c.type]}</td>
                  <td className="p-4">{c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `$${c.value.toFixed(2)}` : '—'}</td>
                  <td className="p-4 text-ink/60">${c.minOrderValue.toFixed(2)}</td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-600">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
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

export default AdminCouponListPage;
