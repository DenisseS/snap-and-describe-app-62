import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useCookiePreferences } from '@/hooks/useCookiePreferences';

interface CookiePreferencesButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const CookiePreferencesButton: React.FC<CookiePreferencesButtonProps> = ({ 
  variant = 'outline', 
  size = 'sm', 
  className = '' 
}) => {
  const { t } = useTranslation();
  const { openPreferences } = useCookiePreferences();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={openPreferences}
      className={className}
    >
      <Settings size={16} className="mr-2" />
      {t('legal:cookieSettings')}
    </Button>
  );
};

export default CookiePreferencesButton;