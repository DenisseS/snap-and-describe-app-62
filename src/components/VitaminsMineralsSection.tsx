
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useNumberFormatter } from '@/hooks/useNumberFormatter';

interface VitaminsMineralsSectionProps {
  vitamins: string[];
  minerals: string[];
  sodium?: number;
  cholesterol?: number;
}

const VitaminsMineralsSection: React.FC<VitaminsMineralsSectionProps> = ({ 
  vitamins, 
  minerals, 
  sodium, 
  cholesterol 
}) => {
  const { t } = useTranslation();
  const { translateVitamins, translateMinerals } = useProductTranslation();
  const { formatNumber } = useNumberFormatter();

  const translatedVitamins = translateVitamins(vitamins);
  const translatedMinerals = translateMinerals(minerals);

  return (
    <div className="bg-purple-50 p-4 rounded-xl">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{t('vitaminsAndMinerals')}</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600 font-medium">{t('vitaminsLabel')}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {translatedVitamins.map((vitamin, index) => (
                  <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {vitamin}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600 font-medium">{t('mineralsLabel')}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {translatedMinerals.map((mineral, index) => (
                  <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {mineral}
                  </span>
                ))}
              </div>
            </div>
            {sodium && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('sodium')}</span>
                <span className="text-sm font-medium">{formatNumber(sodium)}mg</span>
              </div>
            )}
            {cholesterol && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('cholesterol')}</span>
                <span className="text-sm font-medium">{formatNumber(cholesterol)}mg</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitaminsMineralsSection;
