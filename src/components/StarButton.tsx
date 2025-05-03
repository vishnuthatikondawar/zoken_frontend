import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarButtonProps {
  initialState?: boolean;
  onChange?: (isStarred: boolean) => void;
}

export function StarButton({ initialState = false, onChange }: StarButtonProps) {
  const [isStarred, setIsStarred] = useState(initialState);

  const handleClick = () => {
    const newState = !isStarred;
    setIsStarred(newState);
    onChange?.(newState);
  };

  return (
    <button
      className="p-1 hover:bg-gray-50 rounded-full transition-colors"
      onClick={handleClick}
      aria-label={isStarred ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isStarred}
    >
      <Star
        className={`w-6 h-6 transition-colors ${
          isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    </button>
  );
}