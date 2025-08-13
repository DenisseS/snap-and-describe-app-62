import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface BaseEditModalTexts {
  title: string;
  description: string;
  cancel: string;
  save: string;
  saving: string;
}

interface BaseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  texts: BaseEditModalTexts;
  children: React.ReactNode;
  canSave?: boolean;
  focusOnSave?: boolean;
}

const BaseEditModal: React.FC<BaseEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  texts,
  children,
  canSave = true,
  focusOnSave = false
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const isMobile = useIsMobile();
  const saveButtonRef = React.useRef<HTMLButtonElement>(null);

  // Detectar cambios en el viewport height para manejar el teclado virtual
  useEffect(() => {
    const updateViewportHeight = () => {
      // Usar visualViewport si está disponible (mejor para teclados virtuales)
      const height = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(height);
    };

    updateViewportHeight();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      return () => {
        window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      };
    } else {
      window.addEventListener('resize', updateViewportHeight);
      return () => {
        window.removeEventListener('resize', updateViewportHeight);
      };
    }
  }, []);

  // Focus on save button when modal opens
  useEffect(() => {
    if (isOpen && focusOnSave) {
      setTimeout(() => {
        saveButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen, focusOnSave]);

  const handleSave = async () => {
    if (!canSave) return;
    
    setIsSaving(true);
    
    try {
      await onSave();
      
      // Esperar un momento antes de cerrar para que se vea la confirmación
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 300);
    } catch (error) {
      console.error('Error saving:', error);
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const buttonSection = (
    <div className="flex justify-end space-x-2 pt-4 border-t bg-background sticky bottom-0">
      <Button 
        variant="outline" 
        onClick={handleClose}
        disabled={isSaving}
      >
        {texts.cancel}
      </Button>
      <Button 
        ref={saveButtonRef}
        onClick={handleSave}
        disabled={!canSave || isSaving}
      >
        {isSaving ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {texts.saving}
          </div>
        ) : (
          texts.save
        )}
      </Button>
    </div>
  );

  // En móvil, usar Drawer con altura dinámica
  if (isMobile) {
    const dynamicHeight = viewportHeight > 0 ? `${Math.min(viewportHeight * 0.85, 600)}px` : '85vh';
    
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent 
          className="flex flex-col"
          style={{ 
            height: dynamicHeight,
            maxHeight: dynamicHeight
          }}
        >
          <DrawerHeader className="flex-shrink-0 pb-2">
            <DrawerTitle>{texts.title}</DrawerTitle>
            {texts.description && (
              <DrawerDescription>
                {texts.description}
              </DrawerDescription>
            )}
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto px-4 pb-2">
            <div className="space-y-4">
              {children}
            </div>
          </div>

          <div className="flex-shrink-0 p-4 bg-background border-t">
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isSaving}
              >
                {texts.cancel}
              </Button>
              <Button 
                ref={saveButtonRef}
                onClick={handleSave}
                disabled={!canSave || isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {texts.saving}
                  </div>
                ) : (
                  texts.save
                )}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>
            {texts.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 py-4">
            {children}
          </div>
        </div>

        <div className="flex-shrink-0">
          {buttonSection}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseEditModal;
