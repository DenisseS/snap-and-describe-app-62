
import React from 'react';
import { Heart, ThumbsDown } from 'lucide-react';

interface ActionButtonsProps {
  isFavorited: boolean;
  isDisliked: boolean;
  isLoading: boolean;
  onHeartClick: () => void;
  onThumbsDownClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFavorited,
  isDisliked,
  isLoading,
  onHeartClick,
  onThumbsDownClick
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onHeartClick}
        disabled={isLoading}
        className="transition-colors duration-200"
      >
        <Heart 
          className={`h-5 w-5 ${
            isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'
          }`} 
        />
      </button>
      <button
        onClick={onThumbsDownClick}
        disabled={isLoading}
        className="transition-colors duration-200"
      >
        <ThumbsDown 
          className={`h-5 w-5 ${
            isDisliked ? 'text-red-500 fill-red-500' : 'text-gray-400'
          }`} 
        />
      </button>
    </div>
  );
};

export default ActionButtons;
