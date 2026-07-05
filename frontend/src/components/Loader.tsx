import React from 'react';

const Loader: React.FC<{ full?: boolean }> = ({ full }) => (
  <div className={`flex items-center justify-center ${full ? 'min-h-[60vh]' : 'py-12'}`}>
    <div className="w-8 h-8 border-2 border-ink/10 border-t-brand-500 rounded-full animate-spin" />
  </div>
);

export default Loader;
