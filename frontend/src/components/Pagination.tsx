import React from 'react';
import { Link } from 'react-router-dom';

interface PaginationProps {
  page: number;
  pages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

const Pagination: React.FC<PaginationProps> = ({ page, pages, basePath, queryParams = {} }) => {
  if (pages <= 1) return null;

  const buildLink = (p: number) => {
    const params = new URLSearchParams({ ...queryParams, page: String(p) });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          to={buildLink(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
            p === page ? 'bg-ink text-white' : 'bg-white text-ink/70 hover:bg-ink/5 border border-ink/10'
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;
