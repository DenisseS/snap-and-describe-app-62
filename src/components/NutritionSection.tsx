
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNutritionColors } from '@/hooks/useNutritionColors';
import { useNumberFormatter } from '@/hooks/useNumberFormatter';

interface NutritionSectionProps {
  title: string;
  data: {
    description: string;
    total: number;
    caloriesFrom: number;
    dailyPercentage: number;
    healthRanking: number;
  };
  additionalFields?: { label: string; value: number }[];
}

const NutritionSection: React.FC<NutritionSectionProps> = ({ title, data, additionalFields = [] }) => {
  const { t } = useTranslation();
  const { getColorFromRanking } = useNutritionColors();
  const { formatNumber } = useNumberFormatter();
  
  const colors = getColorFromRanking(data.healthRanking);

  return (
    <div className={`${colors.bg} p-4 rounded-xl`}>
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 rounded-full ${colors.icon} flex-shrink-0`}></div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-700 text-sm mb-3">{data.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('total')} {title}</span>
              <span className="text-sm font-medium">{formatNumber(data.total)}g</span>
            </div>
            {additionalFields.map((field, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600">{field.label}</span>
                <span className="text-sm font-medium">{formatNumber(field.value)}g</span>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('caloriesFrom')} {title}</span>
              <span className="text-sm font-medium">{formatNumber(data.caloriesFrom)} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{t('dailyValue')}</span>
              <span className="text-sm font-medium">{data.dailyPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSection;
