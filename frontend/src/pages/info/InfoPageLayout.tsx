import React from 'react';

interface InfoPageLayoutProps {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}

const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({ eyebrow, title, intro, children }) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <span className="text-xs font-semibold tracking-widest uppercase text-ink/40">{eyebrow}</span>
    <h1 className="text-2xl md:text-3xl font-bold mt-1">{title}</h1>
    {intro && <p className="text-ink/60 mt-3 leading-relaxed">{intro}</p>}
    <div className="mt-8 space-y-8">{children}</div>
  </div>
);

export const InfoSection: React.FC<{ heading: string; children: React.ReactNode }> = ({ heading, children }) => (
  <section>
    <h2 className="text-lg font-semibold mb-2">{heading}</h2>
    <div className="text-sm text-ink/65 leading-relaxed space-y-3">{children}</div>
  </section>
);

export default InfoPageLayout;
