
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Favorites from '@/components/Favorites';
import AuthExplanationModal from '@/components/AuthExplanationModal';
import { useTranslation } from 'react-i18next';
import { useAuthentication } from '@/hooks/useAuthentication.ts';
import { AuthState } from '@/types/auth';

interface FavoriteItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  status: string;
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authState } = useAuthentication();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFavoriteItemSelect = (item: FavoriteItem) => {
    const slug = item.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    navigate(`/product/${slug}`);
  };

  const headerProps = {
    title: t('favorites'),
    showBackButton: true,
    showAvatar: true
  };

  // Show auth modal if user is not authenticated
  React.useEffect(() => {
    if (authState === AuthState.IDLE || authState === AuthState.ERROR) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [authState]);

  return (
    <>
      <Layout
        currentView="favorites"
        headerProps={headerProps}
      >
        <Favorites onItemSelect={handleFavoriteItemSelect} />
      </Layout>

      <AuthExplanationModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          navigate('/'); // Navigate back to home if user closes modal
        }}
      />
    </>
  );
};

export default FavoritesPage;
