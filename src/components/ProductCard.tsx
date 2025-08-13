import React from 'react';

interface ProductItem {
  id: string;
  name: string;
  image: string;
  status: string;
}

interface ProductCardProps {
  item: ProductItem;
  onClick: (item: ProductItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
      onClick={() => onClick(item)}
    >
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            {item.name}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;