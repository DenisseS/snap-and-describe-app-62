import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cookieConsentService } from '@/services/CookieConsentService';
import { cookieCategories } from '@/data/cookieCategories';
import { CookieConsent } from '@/types/cookies';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<Omit<CookieConsent, 'timestamp'>>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const existingConsent = cookieConsentService.getConsent();
    if (existingConsent) {
      setConsent({
        necessary: existingConsent.necessary,
        functional: existingConsent.functional,
        analytics: existingConsent.analytics,
        marketing: existingConsent.marketing
      });
    }
  }, [isOpen]);

  const handleConsentChange = (category: keyof Omit<CookieConsent, 'timestamp'>, value: boolean) => {
    if (category === 'necessary') return; // Cannot change necessary cookies
    setConsent(prev => ({ ...prev, [category]: value }));
  };

  const handleAcceptAll = () => {
    cookieConsentService.acceptAll();
    onClose();
  };

  const handleRejectAll = () => {
    cookieConsentService.rejectAll();
    onClose();
  };

  const handleSaveSettings = () => {
    cookieConsentService.setConsent(consent);
    onClose();
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Filter categories that have cookies
  const categoriesWithCookies = cookieCategories.filter(category => category.cookies.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t('legal:cookiePreferences')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">{t('legal:cookieUsage')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('legal:cookieUsageDescription')}
            </p>
          </div>

          <div className="space-y-4">
            {categoriesWithCookies.map((category) => (
              <div key={category.id} className="border rounded-lg">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{t(`legal:${category.nameKey}`)}</h4>
                        <Switch
                          checked={consent[category.id]}
                          onCheckedChange={(value) => handleConsentChange(category.id, value)}
                          disabled={category.required}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t(`legal:${category.descriptionKey}`)}
                      </p>
                    </div>
                    <Collapsible
                      open={expandedCategories[category.id]}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          {expandedCategories[category.id] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>

                  <Collapsible
                    open={expandedCategories[category.id]}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <CollapsibleContent className="mt-4">
                      <Separator className="mb-4" />
                      <div className="space-y-3">
                        <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground">
                          <span>{t('legal:cookieTable.name')}</span>
                          <span>{t('legal:cookieTable.domain')}</span>
                          <span>{t('legal:cookieTable.expiration')}</span>
                          <span>{t('legal:cookieTable.path')}</span>
                          <span>{t('legal:cookieTable.description')}</span>
                        </div>
                        {category.cookies.map((cookie, index) => (
                          <div key={index} className="grid grid-cols-5 gap-2 text-xs py-2 border-t">
                            <span className="font-mono">{t(`legal:${cookie.nameKey}`)}</span>
                            <span>{cookie.domain}</span>
                            <span>{cookie.expiration}</span>
                            <span>{cookie.path}</span>
                            <span className="text-muted-foreground">{t(`legal:${cookie.descriptionKey}`)}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">{t('legal:moreInformation')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('legal:moreInformationDescription')}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleAcceptAll} className="flex-1 min-w-32">
              {t('legal:acceptAll')}
            </Button>
            <Button onClick={handleRejectAll} variant="outline" className="flex-1 min-w-32">
              {t('legal:rejectAll')}
            </Button>
            <Button onClick={handleSaveSettings} variant="secondary" className="flex-1 min-w-32">
              {t('legal:saveSettings')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferencesModal;