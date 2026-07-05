import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { resetPassword } from '@/api/auth';
import Message from '@/components/Message';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError('');
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success(t('auth.resetPassword.toastSuccess'));
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-1">{t('auth.resetPassword.title')}</h1>
      <p className="text-ink/50 text-sm mb-8">{t('auth.resetPassword.subtitle')}</p>

      <form onSubmit={submit} className="space-y-4">
        {error && <Message variant="error">{error}</Message>}
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.resetPassword.newPassword')}</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.resetPassword.confirmNewPassword')}</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder="••••••••"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.resetPassword')}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6 text-center">
        <Link to="/login" className="text-brand-600 font-medium">{t('auth.resetPassword.backToSignIn')}</Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
