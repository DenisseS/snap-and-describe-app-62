
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronRight } from 'lucide-react';

const WeeklyList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleWeeklyListClick = () => {
    console.log('🛒 WeeklyList: Navigating to shopping lists');
    navigate('/shopping-lists');
  };

  return (
    <div className="mb-6">
      <div 
        className="bg-blue-50 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleWeeklyListClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{t('weeklyList')}</h3>
              <p className="text-[10px] text-gray-600">{t('weeklyListDescription')}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default WeeklyList;
