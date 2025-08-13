
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Search } from 'lucide-react';

interface QuickActionsProps {
  onScanClick: () => void;
  onExploreClick: () => void;
  onFavoritesClick: () => void;
  onRecipesClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onScanClick,
  onExploreClick
}) => {
  const { t } = useTranslation();

  const actions = [
    {
      title: t('scan'),
      icon: Camera,
      onClick: onScanClick,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      iconColor: 'text-white'
    },
    {
      title: t('explore'),
      icon: Search,
      onClick: onExploreClick,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-500',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`${action.bgColor} p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-95`}
            >
              <div className={`w-12 h-12 rounded-full ${action.iconBg} flex items-center justify-center mb-2 mx-auto`}>
                <IconComponent className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <p className="text-sm font-medium text-gray-700 text-center">{action.title}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
