import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import Message from '@/components/Message';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.register.passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.register.errorCreate'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');
    if (!credentialResponse.credential) return;
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.register.errorGoogle'));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-1">{t('auth.register.title')}</h1>
      <p className="text-ink/50 text-sm mb-8">{t('auth.register.subtitle')}</p>

      {error && <div className="mb-5"><Message variant="error">{error}</Message></div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.register.fullName')}</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder={t('auth.register.fullNamePlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.register.email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder={t('auth.register.emailPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.register.password')}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder={t('auth.register.passwordPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.register.confirmPassword')}</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {loading ? t('auth.register.creatingAccount') : t('auth.register.createAccount')}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="text-xs text-ink/40 uppercase tracking-wide">{t('auth.or')}</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError(t('auth.register.errorGoogle'))}
        />
      </div>

      <p className="text-sm text-ink/50 mt-6 text-center">
        {t('auth.register.alreadyHaveAccount')}{' '}
        <Link to="/login" className="text-brand-600 font-medium">{t('auth.register.signIn')}</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
