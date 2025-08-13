
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ALLERGENS_CONFIG } from '@/data/allergens';
import { DataState, UserProfile } from '@/types/userData';

interface AllergenSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  userState: DataState;
  onProfileUpdate: (profile: UserProfile) => Promise<void>;
}

const AllergenSelectionModal: React.FC<AllergenSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  userState,
  onProfileUpdate 
}) => {
  const { t } = useTranslation();
  const [localSelections, setLocalSelections] = useState<Record<string, { avoid: boolean }>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Obtener alergias del perfil recibido como prop
  const allergies = userProfile?.allergies || {};
  const isProcessing = userState === DataState.PROCESSING;

  // Inicializar selecciones locales cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setLocalSelections(allergies);
      setHasChanges(false);
    }
  }, [isOpen, allergies]);

  const handleCheckboxChange = (allergenId: string, checked: boolean) => {
    if (isProcessing) return; // Prevenir cambios durante procesamiento
    
    const newSelections = { ...localSelections };
    
    if (checked) {
      newSelections[allergenId] = { avoid: true };
    } else {
      delete newSelections[allergenId];
    }
    
    setLocalSelections(newSelections);
    setHasChanges(true);
  };

  const handleClose = async () => {
    if (isProcessing) return; // Prevenir cierre durante procesamiento
    
    // Guardar cambios si los hay
    if (hasChanges && userProfile) {
      await onProfileUpdate({
        ...userProfile,
        allergies: localSelections
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col">
        {isProcessing ? (
          // Vista de procesamiento
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('saving', 'Guardando...')}</h3>
              <p className="text-sm text-gray-600">
                {t('savingYourData', 'Estamos actualizando tus datos')}
              </p>
            </div>
          </div>
        ) : (
          // Vista normal del formulario
          <>
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>{t('selectAllergensTitle')}</DialogTitle>
              <DialogDescription>
                {t('selectAllergensDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-3 pr-2">
                {ALLERGENS_CONFIG.map((allergen) => {
                  const IconComponent = allergen.icon;
                  const isChecked = !!localSelections[allergen.id];

                  return (
                    <div key={allergen.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${allergen.colors.iconBg}`}>
                        <IconComponent className={`h-4 w-4 ${allergen.colors.iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <label
                          htmlFor={allergen.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {t(allergen.translationKey)}
                        </label>
                      </div>

                      <Checkbox
                        id={allergen.id}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCheckboxChange(allergen.id, !!checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2 flex-shrink-0">
              {t('allergensAutoSave')}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AllergenSelectionModal;
