import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  value: number;
  numReviews?: number;
  size?: 'sm' | 'md';
}

const Rating: React.FC<RatingProps> = ({ value, numReviews, size = 'sm' }) => {
  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={iconClass}>
          {value >= star ? (
            <FaStar />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar className="text-ink/20" />
          )}
        </span>
      ))}
      {numReviews !== undefined && (
        <span className="text-xs text-ink/50 ml-1">({numReviews})</span>
      )}
    </div>
  );
};

export default Rating;
