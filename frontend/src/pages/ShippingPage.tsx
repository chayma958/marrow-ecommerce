import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import CheckoutSteps from '@/components/CheckoutSteps';
import PhoneInput from '@/components/PhoneInput';
import { countries } from '@/utils/countries';

const ShippingPage: React.FC = () => {
  const { t } = useTranslation();
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country, phone });
    navigate('/payment');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <CheckoutSteps current={1} />
      <h1 className="text-2xl font-bold mb-8">{t('shipping.title')}</h1>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('shipping.streetAddress')}</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
            placeholder={t('shipping.streetAddressPlaceholder')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('shipping.city')}</label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
              placeholder={t('shipping.cityPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('shipping.postalCode')}</label>
            <input
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400"
              placeholder={t('shipping.postalCodePlaceholder')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('shipping.country')}</label>
          <select
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3.5 py-2.5 outline-none focus:border-brand-400 bg-white"
          >
            <option value="" disabled>{t('shipping.selectCountry')}</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">{t('shipping.phoneNumber')}</label>
          <PhoneInput value={phone} onChange={setPhone} required />
        </div>
        <button className="w-full bg-ink text-white py-3 rounded-full font-medium hover:bg-brand-600 transition-colors">
          {t('shipping.continueToPayment')}
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
