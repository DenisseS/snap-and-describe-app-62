
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import HomeHeader from '@/components/HomeHeader';
import HomeContent from '@/components/HomeContent';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/hooks/useUserData';
import { generateWebsiteSchema } from '@/utils/seoUtils';
import '../i18n';

const Home: React.FC = () => {
  const { handleLanguageToggle } = useLanguage();
  const navigate = useNavigate();
  const { profile, state, updateProfile } = useUserData();

  

  const handleRecipesClick = () => {
    navigate('/recipes');
  };

  const handleProfileUpdate = async (updatedProfile: any) => {
    await updateProfile(updatedProfile);
  };

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourapp.com';

  return (
    <>
      <SEOHead
        title="Nutrition Scanner - Instant Food Analysis & Nutritional Information"
        description="Scan and analyze food nutrition information instantly. Get detailed nutritional data, allergen information, and personalized recommendations for a healthier lifestyle."
        canonical="/"
        keywords={['nutrition', 'food scanner', 'health', 'diet', 'calories', 'nutrition facts', 'food analysis']}
        schema={generateWebsiteSchema(siteUrl)}
      />
      <Layout
        currentView="home"
        hideHeader={true}
      >
        <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
          <HomeHeader onLanguageToggle={handleLanguageToggle} />
          <HomeContent 
            onRecipesClick={handleRecipesClick}
            userProfile={profile}
            userState={state}
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      </Layout>
    </>
  );
};

export default Home;
