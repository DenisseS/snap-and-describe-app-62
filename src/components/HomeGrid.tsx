
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Scan, Search } from 'lucide-react';

interface HomeGridProps {
  onScanStart: () => void;
  onExploreClick: () => void;
}

const HomeGrid: React.FC<HomeGridProps> = ({ onScanStart, onExploreClick }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center p-2 xs:p-4 overflow-hidden min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 xs:gap-4 md:gap-6 w-full max-w-4xl">
        {/* Scan Food Card */}
        <div className="bg-white rounded-2xl xs:rounded-3xl p-3 xs:p-4 md:p-6 shadow-lg flex flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 xs:w-12 xs:h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 xs:mb-3 md:mb-4">
              <Scan className="h-4 w-4 xs:h-6 xs:w-6 md:h-8 md:w-8 text-blue-500" />
            </div>
            
            <h2 className="text-sm xs:text-lg md:text-xl font-bold text-gray-800 mb-1 xs:mb-2 md:mb-3">
              {t('scanFood')}
            </h2>
            
            <p className="text-gray-600 mb-2 xs:mb-4 md:mb-6 leading-relaxed text-xs xs:text-sm md:text-base hidden xs:block">
              {t('takePhotoInstant')}
            </p>
            
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 xs:py-3 rounded-xl xs:rounded-2xl text-xs xs:text-sm md:text-base font-medium"
              onClick={onScanStart}
            >
              <Scan className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5" />
              {t('scan')}
            </Button>
          </div>
        </div>

        {/* Explore Products Card */}
        <div className="bg-white rounded-2xl xs:rounded-3xl p-3 xs:p-4 md:p-6 shadow-lg flex flex-col">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 xs:w-12 xs:h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-2 xs:mb-3 md:mb-4">
              <Search className="h-4 w-4 xs:h-6 xs:w-6 md:h-8 md:w-8 text-green-500" />
            </div>
            
            <h2 className="text-sm xs:text-lg md:text-xl font-bold text-gray-800 mb-1 xs:mb-2 md:mb-3">
              {t('exploreProducts')}
            </h2>
            
            <p className="text-gray-600 mb-2 xs:mb-4 md:mb-6 leading-relaxed text-xs xs:text-sm md:text-base hidden xs:block">
              {t('browseHealthyOptions')}
            </p>
            
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 xs:py-3 rounded-xl xs:rounded-2xl text-xs xs:text-sm md:text-base font-medium"
              onClick={onExploreClick}
            >
              <Search className="mr-1 xs:mr-2 h-3 w-3 xs:h-4 xs:w-4 md:h-5 md:w-5" />
              {t('explore')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeGrid;
