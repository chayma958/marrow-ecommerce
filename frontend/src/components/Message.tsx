import React from 'react';

const variants = {
  error: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-brand-50 text-brand-700 border-brand-200',
};

const Message: React.FC<{ variant?: keyof typeof variants; children: React.ReactNode }> = ({
  variant = 'info',
  children,
}) => (
  <div className={`border rounded-xl px-4 py-3 text-sm ${variants[variant]}`}>{children}</div>
);

export default Message;
