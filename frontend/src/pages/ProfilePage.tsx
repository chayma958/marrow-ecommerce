import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/api/auth';
import { isStrongPassword } from '@/utils/passwordPolicy';
import { fetchMyOrders } from '@/api/orders';
import { Order } from '@/types';
import Message from '@/components/Message';
import Loader from '@/components/Loader';

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .finally(() => setOrdersLoading(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password && password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }
    if (password && !isStrongPassword(password)) {
      setError(t('auth.passwordRequirements'));
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({ name, email, ...(password && { password }) });
      updateUser({ ...updated, token: user?.token });
      setSuccess(t('profile.profileUpdated'));
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('profile.errorUpdate'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-[280px_1fr] gap-10">
      <div>
        <h1 className="text-xl font-bold mb-6">{t('profile.myProfile')}</h1>
        {error && <div className="mb-4"><Message variant="error">{error}</Message></div>}
        {success && <div className="mb-4"><Message variant="success">{success}</Message></div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('profile.name')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('profile.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('profile.newPassword')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('profile.newPasswordPlaceholder')}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
            {password && <p className="text-xs text-ink/40 mt-1.5">{t('auth.passwordRequirements')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('profile.confirmPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
          </div>
          <button
            disabled={saving}
            className="w-full bg-ink text-white py-2.5 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {saving ? t('profile.saving') : t('profile.saveChanges')}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6">{t('profile.orderHistory')}</h2>
        {ordersLoading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <Message>
            {t('profile.noOrdersPre')} <Link to="/products" className="font-medium text-brand-600">{t('profile.startShopping')}</Link>
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink/40 text-xs uppercase tracking-wider border-b border-ink/8">
                  <th className="pb-3 font-medium">{t('profile.tableOrder')}</th>
                  <th className="pb-3 font-medium">{t('profile.tableDate')}</th>
                  <th className="pb-3 font-medium">{t('profile.tableTotal')}</th>
                  <th className="pb-3 font-medium">{t('profile.tablePaid')}</th>
                  <th className="pb-3 font-medium">{t('profile.tableDelivered')}</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-ink/8">
                    <td className="py-3 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 text-ink/60">{new Date(order.createdAt).toLocaleDateString(locale)}</td>
                    <td className="py-3 font-medium">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3">
                      {order.isPaid ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400" />}
                    </td>
                    <td className="py-3">
                      {order.isDelivered ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400" />}
                    </td>
                    <td className="py-3">
                      <Link to={`/orders/${order._id}`} className="text-brand-600 font-medium">{t('profile.view')}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
