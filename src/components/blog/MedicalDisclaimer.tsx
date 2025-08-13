import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MedicalDisclaimerProps {
  authorName: string;
  className?: string;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ 
  authorName, 
  className = "" 
}) => {
  const { t } = useTranslation('blog');

  return (
    <Alert className={`border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-sm leading-relaxed">
        <strong>{t('medicalDisclaimer.title')}:</strong> {t('medicalDisclaimer.content')}
        <br /><br />
        <strong>Author Disclaimer:</strong> {t('medicalDisclaimer.authorDisclaimer', { authorName })}
        <br /><br />
        <em>{t('medicalDisclaimer.consultAdvice')}</em>
      </AlertDescription>
    </Alert>
  );
};