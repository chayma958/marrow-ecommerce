import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendContactMessage } from '@/api/contact';
import Message from '@/components/Message';
import { useAuth } from '@/context/AuthContext';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendContactMessage({ name, email, subject, message });
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('info.contact.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <span className="text-xs font-semibold tracking-widest uppercase text-ink/40">{t('info.contact.eyebrow')}</span>
      <h1 className="text-2xl md:text-3xl font-bold mt-1">{t('info.contact.title')}</h1>
      <p className="text-ink/60 mt-3 leading-relaxed">
        {t('info.contact.intro')}
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {sent ? (
            <Message>{t('info.contact.sentMessage')}</Message>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && <Message variant="error">{error}</Message>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('info.contact.name')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
                    placeholder={t('info.contact.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('info.contact.email')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
                    placeholder={t('info.contact.emailPlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('info.contact.subject')}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
                  placeholder={t('info.contact.subjectPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">{t('info.contact.message')}</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400 resize-none"
                  placeholder={t('info.contact.messagePlaceholder')}
                />
              </div>
              <button
                disabled={loading}
                className="bg-ink text-white px-6 py-3 rounded-full font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
              >
                {loading ? t('info.contact.sending') : t('info.contact.sendMessage')}
              </button>
            </form>
          )}
        </div>

        <div className="text-sm text-ink/60 space-y-4">
          <div>
            <h3 className="text-ink font-semibold text-sm mb-1">{t('info.contact.emailLabel')}</h3>
            <p>{t('info.contact.emailValue')}</p>
          </div>
          <div>
            <h3 className="text-ink font-semibold text-sm mb-1">{t('info.contact.hoursLabel')}</h3>
            <p>{t('info.contact.hoursValue')}</p>
          </div>
          <div>
            <h3 className="text-ink font-semibold text-sm mb-1">{t('info.contact.responseLabel')}</h3>
            <p>{t('info.contact.responseValue')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
