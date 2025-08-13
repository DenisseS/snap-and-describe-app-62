
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleHomeClick = () => {
    navigate('/');
  };

  const headerProps = {
    title: t('pageNotFound'),
    showBackButton: true,
    showAvatar: false
  };

  return (
    <Layout
      currentView="home"
      headerProps={headerProps}
    >
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">{t('pageNotFoundMessage')}</p>
          <button 
            onClick={handleHomeClick}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {t('returnToHome')}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
