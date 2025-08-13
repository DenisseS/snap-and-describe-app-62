
import React from 'react';

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  isExpanded,
  onClick,
  children
}) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      
      {isExpanded && children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
