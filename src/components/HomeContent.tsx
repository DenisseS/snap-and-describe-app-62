
import React from 'react';
import HomeGreeting from './HomeGreeting';
import QuickActions from './QuickActions';
import AllergenSummary from './AllergenSummary';
import WeeklyList from './WeeklyList';
import RecipesSection from './RecipesSection';
import { UserProfile, DataState } from '@/types/userData';

interface HomeContentProps {
  onRecipesClick: () => void;
  userProfile: UserProfile | null;
  userState: DataState;
  onProfileUpdate: (profile: UserProfile) => Promise<void>;
}

const HomeContent: React.FC<HomeContentProps> = ({
  onRecipesClick,
  userProfile,
  userState,
  onProfileUpdate
}) => {
  return (
    <div className="flex-1 overflow-auto p-4">
      <HomeGreeting 
        userProfile={userProfile}
        userState={userState}
      />
      <AllergenSummary 
        userProfile={userProfile}
        userState={userState}
        onProfileUpdate={onProfileUpdate}
      />
      <WeeklyList />
      <RecipesSection onRecipesClick={onRecipesClick} />
    </div>
  );
};

export default HomeContent;
