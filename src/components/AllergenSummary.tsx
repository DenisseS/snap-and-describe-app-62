
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import AllergenCard from './AllergenCard';
import AllergenSelectionModal from './AllergenSelectionModal';
import { ALLERGENS_CONFIG } from '@/data/allergens';
import { UserProfile, DataState } from '@/types/userData';
import AuthExplanationModal from "@/components/AuthExplanationModal";

interface AllergenSummaryProps {
  userProfile: UserProfile | null;
  userState: DataState;
  onProfileUpdate: (profile: UserProfile) => Promise<void>;
}

const AllergenSummary: React.FC<AllergenSummaryProps> = ({ 
  userProfile, 
  userState,
  onProfileUpdate 
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showLeftScrollIndicator, setShowLeftScrollIndicator] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const allergies = userProfile?.allergies || {};
  const selectedAllergens = Object.keys(allergies).filter(id => allergies[id]?.avoid);

  // Verificar si hay overflow y posición del scroll
  useEffect(() => {
    const checkScrollState = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        const isScrolledToEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 10);
        const isScrolledFromStart = container.scrollLeft > 10;
        
        setShowScrollIndicator(hasOverflow && !isScrolledToEnd);
        setShowLeftScrollIndicator(hasOverflow && isScrolledFromStart);
        setIsAtEnd(isScrolledToEnd);
      }
    };

    checkScrollState();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollState);
      return () => container.removeEventListener('scroll', checkScrollState);
    }

    window.addEventListener('resize', checkScrollState);
    return () => window.removeEventListener('resize', checkScrollState);
  }, [selectedAllergens]);

  const handlePlusClick = () => {
    if (userProfile) {
      setIsModalOpen(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleScrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Scroll horizontalmente por 200px con animación suave
      container.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Scroll horizontalmente hacia la izquierda por 200px con animación suave
      container.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mb-6 min-w-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('allergensToAvoid')}</h3>

      {/* Grid layout: botón fijo + área scrollable */}
      <div className="grid grid-cols-[64px_1fr] gap-3 min-w-0 items-start">
        {/* Botón + fijo a la izquierda - ajustado para centrarse */}
        <div className="flex flex-col items-center">
          <button
            onClick={handlePlusClick}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors flex-shrink-0"
          >
            <Plus className="h-8 w-8 text-gray-600" />
          </button>
        </div>

        {/* Contenedor scrollable que usa el espacio restante */}
        <div className="relative min-w-0 overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-3 overflow-x-auto scrollbar-hide pb-2 min-w-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {selectedAllergens.map((allergenId) => {
              const allergenConfig = ALLERGENS_CONFIG.find(a => a.id === allergenId);
              if (!allergenConfig) return null;

              const IconComponent = allergenConfig.icon;

              return (
                <div
                  key={allergenId}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${allergenConfig.colors.iconBg}`}>
                    <IconComponent className={`h-6 w-6 ${allergenConfig.colors.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-700 mt-1 text-center max-w-[60px] truncate">
                    {allergenConfig.name}
                  </span>
                </div>
              );
            })}
          </div>

          {showLeftScrollIndicator && (
            <div className="absolute left-0 top-0 bottom-0 z-5">
              <div className="w-8 h-full bg-gradient-to-r from-blue-50 to-transparent pointer-events-none absolute left-0 top-0 bottom-0" />
              <button
                onClick={handleScrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-200/80 flex items-center justify-center hover:bg-white/90 transition-colors z-10"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
          {/* Left side: gradient + button */}
          {showLeftScrollIndicator && (
            <div className="absolute left-0 top-0 bottom-0 z-5 pointer-events-none">
              <div className="w-8 h-full bg-gradient-to-r from-blue-50 to-transparent absolute left-0 top-0 bottom-0 pointer-events-none" />
              <button
                onClick={handleScrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-200/80 flex items-center justify-center hover:bg-white/90 transition-colors z-10 pointer-events-auto"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* Right side: gradient + button */}
          {showScrollIndicator && (
            <div className="absolute right-0 top-0 bottom-0 z-5 pointer-events-none">
              <div className="w-8 h-full bg-gradient-to-l from-blue-50 to-transparent absolute right-0 top-0 bottom-0 pointer-events-none" />
              <button
                onClick={handleScrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-gray-200/80 flex items-center justify-center hover:bg-white/90 transition-colors z-10 pointer-events-auto"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AuthExplanationModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <AllergenSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userProfile={userProfile}
        userState={userState}
        onProfileUpdate={onProfileUpdate}
      />
    </div>
  );
};

export default AllergenSummary;
