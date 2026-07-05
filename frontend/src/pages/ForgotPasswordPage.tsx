import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { forgotPassword } from '@/api/auth';
import Message from '@/components/Message';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-1">{t('auth.forgotPassword.title')}</h1>
      <p className="text-ink/50 text-sm mb-8">{t('auth.forgotPassword.subtitle')}</p>

      {sent ? (
        <Message>
          {t('auth.forgotPassword.sentMessage')}
        </Message>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Message variant="error">{error}</Message>}
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('auth.forgotPassword.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetLink')}
          </button>
        </form>
      )}

      <p className="text-sm text-ink/50 mt-6 text-center">
        <Link to="/login" className="text-brand-600 font-medium">{t('auth.forgotPassword.backToSignIn')}</Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
