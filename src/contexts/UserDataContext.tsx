import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, DataState } from '../types/userData';
import { AuthState } from '../types/auth';
import { useAuth } from './AuthContext';
import UserDataService from '../services/UserDataService';
import { USER_PROFILE_EVENTS } from '../constants/events';

interface UserDataContextType {
  // Estado de datos de usuario
  profile: UserProfile | null;
  state: DataState;
  
  // Operaciones
  updateProfile: (profile: UserProfile) => Promise<boolean>;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { authState, userInfo, sessionService } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<DataState>(DataState.IDLE);
  
  const service = UserDataService.getInstance();

  // Configure service once when available
  useEffect(() => {
    if (sessionService) {
      service.setDropboxService(sessionService);
    }
  }, [sessionService]);

  // Transform userInfo to UserProfile when available - Direct mapping without extra calls
  useEffect(() => {
    if (authState === AuthState.AUTHENTICATED && userInfo) {
      console.log('👤 UserDataContext: Using transformed userInfo as profile', userInfo);
      // userInfo from AuthContext is already a UserProfile, no need to transform
      setProfile(userInfo);
      setState(DataState.READY);
    } else if (authState === AuthState.LOADING) {
      console.log('👤 UserDataContext: Loading state from auth');
      setState(DataState.LOADING);
    } else if (authState === AuthState.IDLE) {
      console.log('👤 UserDataContext: Clearing profile data');
      setProfile(null);
      setState(DataState.IDLE);
    } else if (authState === AuthState.ERROR) {
      console.log('👤 UserDataContext: Error state from auth');
      setProfile(null);
      setState(DataState.ERROR);
    }
  }, [authState, userInfo]);

  // Subscribe to service events for optimistic updates
  useEffect(() => {
    const handleProfileUpdated = (updatedProfile: UserProfile) => {
      console.log('👤 UserDataContext: Profile updated via event', updatedProfile);
      setProfile(updatedProfile);
      setState(DataState.READY);
    };
    
    const handleSyncStart = () => {
      console.log('👤 UserDataContext: Sync started');
      setState(DataState.PROCESSING);
    };
    
    const handleSyncEnd = () => {
      console.log('👤 UserDataContext: Sync ended');
      setState(DataState.READY);
    };
    
    const handleError = () => {
      console.log('👤 UserDataContext: Error received');
      setState(DataState.ERROR);
    };

    service.addEventListener(USER_PROFILE_EVENTS.UPDATED, handleProfileUpdated);
    service.addEventListener(USER_PROFILE_EVENTS.SYNC_START, handleSyncStart);
    service.addEventListener(USER_PROFILE_EVENTS.SYNC_END, handleSyncEnd);
    service.addEventListener(USER_PROFILE_EVENTS.ERROR, handleError);

    return () => {
      service.removeEventListener(USER_PROFILE_EVENTS.UPDATED, handleProfileUpdated);
      service.removeEventListener(USER_PROFILE_EVENTS.SYNC_START, handleSyncStart);
      service.removeEventListener(USER_PROFILE_EVENTS.SYNC_END, handleSyncEnd);
      service.removeEventListener(USER_PROFILE_EVENTS.ERROR, handleError);
    };
  }, []);

  const updateProfile = useCallback(async (newProfile: UserProfile): Promise<boolean> => {
    if (authState !== AuthState.AUTHENTICATED) return false;

    setState(DataState.PROCESSING);
    
    try {
      const result = await service.updateUserProfile(
        newProfile, 
        (updatedProfile) => {
          // Optimistic update callback
          setProfile(updatedProfile);
          setState(DataState.READY);
        }
      );
      return result.success;
    } catch (error) {
      console.error('👤 UserDataContext: Error updating profile:', error);
      setState(DataState.ERROR);
      return false;
    }
  }, [authState]);

  const refetch = useCallback(async () => {
    if (authState !== AuthState.AUTHENTICATED) return;

    setState(DataState.LOADING);
    
    try {
      const result = await service.getUserProfile();
      setProfile(result.data);
      setState(result.state);
    } catch (error) {
      console.error('👤 UserDataContext: Error refetching profile:', error);
      setProfile(null);
      setState(DataState.ERROR);
    }
  }, [authState]);

  const clearCache = useCallback(() => {
    console.log('👤 UserDataContext: Clearing cache');
    service.clearUserCache();
    setProfile(null);
    setState(DataState.IDLE);
  }, []);

  const contextValue: UserDataContextType = {
    profile,
    state,
    updateProfile,
    refetch,
    clearCache
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};