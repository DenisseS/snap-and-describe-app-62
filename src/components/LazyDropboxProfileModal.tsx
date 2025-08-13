
import React, { lazy, Suspense } from 'react';
import { UserProfile } from '@/types/userData';

// Lazy load del ProfileModal
const DropboxProfileModal = lazy(() => import('./DropboxProfileModal'));

interface LazyDropboxProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => Promise<void>;
}

const LazyDropboxProfileModal: React.FC<LazyDropboxProfileModalProps> = (props) => {
  // Solo renderizar si está abierto
  if (!props.isOpen) {
    return null;
  }

  return (
    <Suspense fallback={<div />}>
      <DropboxProfileModal {...props} />
    </Suspense>
  );
};

export default LazyDropboxProfileModal;
