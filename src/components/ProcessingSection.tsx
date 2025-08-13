
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProcessingLevel } from '@/data/types';
import { useProductTranslation } from '@/hooks/useProductTranslation';

interface ProcessingSectionProps {
  processingLevel: ProcessingLevel;
}

const ProcessingSection: React.FC<ProcessingSectionProps> = ({ processingLevel }) => {
  const { t } = useTranslation();
  const { 
    translateProcessingCategory, 
    translateProcessingDescription, 
    translateProcessingIndicators 
  } = useProductTranslation();

  const getNovaColor = (nova: number) => {
    switch (nova) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-orange-600 bg-orange-100';
      case 4: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const translatedDescription = translateProcessingDescription(
    processingLevel.descriptionKey, 
    processingLevel.category
  );

  const translatedIndicators = translateProcessingIndicators(
    processingLevel.indicatorsKeys, 
    []
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNovaColor(processingLevel.nova)}`}>
            NOVA {processingLevel.nova}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {translateProcessingCategory(processingLevel.category)}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 leading-relaxed">
        {translatedDescription}
      </p>
      
      {translatedIndicators && translatedIndicators.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-700">{t('indicators')}:</h4>
          <div className="flex flex-wrap gap-1">
            {translatedIndicators.map((indicator, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingSection;
