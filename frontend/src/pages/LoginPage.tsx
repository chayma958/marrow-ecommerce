import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import Message from '@/components/Message';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('auth.login.errorInvalid'));
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
      setError(err?.response?.data?.message || t('auth.login.errorGoogle'));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-1">{t('auth.login.title')}</h1>
      <p className="text-ink/50 text-sm mb-8">{t('auth.login.subtitle')}</p>

      {error && <div className="mb-5"><Message variant="error">{error}</Message></div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('auth.login.email')}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder={t('auth.login.emailPlaceholder')}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium">{t('auth.login.password')}</label>
            <Link to="/forgot-password" className="text-xs text-brand-600 font-medium">{t('auth.login.forgotPassword')}</Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder="••••••••"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {loading ? t('auth.login.signingIn') : t('auth.login.signIn')}
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
          onError={() => setError(t('auth.login.errorGoogle'))}
        />
      </div>

      <p className="text-sm text-ink/50 mt-6 text-center">
        {t('auth.login.newToMarrow')}{' '}
        <Link to="/register" className="text-brand-600 font-medium">{t('auth.login.createAccount')}</Link>
      </p>

      <div className="mt-8 bg-brand-50 rounded-xl p-4 text-xs text-ink/60">
        <strong className="text-ink/80">{t('auth.login.demoCredentialsTitle')}</strong> 
        <br />Admin — admin@example.com / admin123
        <br />Customer — jane@example.com / jane1234
      </div>
    </div>
  );
};

export default LoginPage;
