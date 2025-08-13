
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface HomeHeaderProps {
  onLanguageToggle: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onLanguageToggle }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center p-3 xs:p-4 md:p-6 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg xs:text-xl md:text-3xl font-bold text-gray-800">
          NutriScan Beta
        </h1>
        <p className="text-xs xs:text-sm md:text-base text-gray-600 mt-0.5 xs:mt-1 hidden xs:block">
          {t('scanAnalyzeExplore')}
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onLanguageToggle}
        className="bg-white/80 backdrop-blur-sm flex-shrink-0 h-8 w-8 xs:h-10 xs:w-10 md:h-12 md:w-12"
      >
        <Globe className="h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5" />
      </Button>
    </div>
  );
};

export default HomeHeader;
