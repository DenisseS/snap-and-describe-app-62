
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNumberFormatter } from '@/hooks/useNumberFormatter';

interface CaloriesSectionProps {
  calories: {
    description: string;
    total: number;
    fromCarbs: number;
    fromProtein: number;
    fromFat: number;
  };
}

const CaloriesSection: React.FC<CaloriesSectionProps> = ({ calories }) => {
  const { t } = useTranslation();
  const { formatNumber } = useNumberFormatter();

  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-500 flex-shrink-0"></div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{t('calories')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('totalCalories')}</span>
              <span className="text-sm font-medium">{formatNumber(calories.total)} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('fromCarbs')}</span>
              <span className="text-sm font-medium">{formatNumber(calories.fromCarbs)} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('fromProtein')}</span>
              <span className="text-sm font-medium">{formatNumber(calories.fromProtein)} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('fromFat')}</span>
              <span className="text-sm font-medium">{formatNumber(calories.fromFat)} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaloriesSection;
