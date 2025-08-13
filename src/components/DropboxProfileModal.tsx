
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/userData';
import BaseEditModal from './BaseEditModal';

interface DropboxProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => Promise<void>;
}

const DropboxProfileModal: React.FC<DropboxProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdate
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  // Sincronizar el input con el perfil actual cuando se abre el modal
  useEffect(() => {
    if (isOpen && userProfile?.name) {
      setName(userProfile.name);
    } else if (isOpen) {
      setName('');
    }
  }, [isOpen, userProfile?.name]);

  const handleSave = async () => {
    if (!name.trim() || !userProfile) return;
    
    await onProfileUpdate({ 
      ...userProfile,
      name: name.trim()
    });
  };

  const texts = {
    title: t('editProfile'),
    description: t('updatePersonalInfo'),
    cancel: t('cancel'),
    save: t('save'),
    saving: t('saving')
  };

  return (
    <BaseEditModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      texts={texts}
      canSave={!!name.trim()}
    >
      <Label htmlFor="name">{t('name')}</Label>
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('enterYourName')}
        autoFocus
      />
    </BaseEditModal>
  );
};

export default DropboxProfileModal;
