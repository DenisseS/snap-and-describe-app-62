
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// Simplified navigation state using enum
enum NavigationState {
  IDLE = 'idle',
  BOTTOM_NAV = 'bottom-nav',
  FROM_HOME = 'from-home',
  REGULAR = 'regular'
}

interface NavigationContextType {
  navigationStack: string[];
  navigationState: NavigationState;
  pushToStack: (route: string) => void;
  goBack: () => string | null;
  setBaseRoute: (route: string) => void;
  clearStack: () => void;
  getStackInfo: () => { stack: string[], canGoBack: boolean };
  setNavigationState: (state: NavigationState) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const NAV_STACK_KEY = 'NAV_STACK_V1';
const NAV_STATE_KEY = 'NAV_STATE_V1';

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [navigationStack, setNavigationStack] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(NAV_STACK_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('NavigationProvider: error reading NAV_STACK_KEY from sessionStorage', e);
      return [];
    }
  });
  const [navigationState, setNavigationState] = useState<NavigationState>(() => {
    try {
      const saved = sessionStorage.getItem(NAV_STATE_KEY) as NavigationState | null;
      if (saved && (Object.values(NavigationState) as string[]).includes(saved)) {
        return saved as NavigationState;
      }
    } catch (e) {
      console.error('NavigationProvider: error reading NAV_STATE_KEY from sessionStorage', e);
    }
    return NavigationState.IDLE;
  });

  // Persist to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(navigationStack));
    } catch (e) {
      console.error('NavigationProvider: error persisting NAV_STACK_KEY', e);
    }
  }, [navigationStack]);

  useEffect(() => {
    try {
      sessionStorage.setItem(NAV_STATE_KEY, navigationState);
    } catch (e) {
      console.error('NavigationProvider: error persisting NAV_STATE_KEY', e);
    }
  }, [navigationState]);

  const pushToStack = useCallback((route: string) => {
    setNavigationStack(prev => {
      // Don't push if it's the same as the current top route
      if (prev.length > 0 && prev[prev.length - 1] === route) {
        console.log('🔄 NavigationStack: Not pushing duplicate route:', route);
        return prev;
      }

      const newStack = [...prev, route];
      console.log('📍 NavigationStack: PUSH', route);
      console.log('📚 NavigationStack: Stack now:', newStack);
      return newStack;
    });
  }, []);

  const goBack = useCallback(() => {
    console.log('🔙 NavigationStack: goBack() called');
    console.log('📚 NavigationStack: Current stack before goBack:', navigationStack);

    // Calculate the back route BEFORE modifying the stack
    if (navigationStack.length <= 1) {
      console.log('🚫 NavigationStack: Cannot go back, stack too small:', navigationStack);
      return null;
    }

    // Get the route we should go back to (second to last item)
    const backRoute = navigationStack[navigationStack.length - 2];
    console.log('⬅️ NavigationStack: Calculated back route:', backRoute);

    // Now update the stack by removing the current route (last item)
    setNavigationStack(prev => {
      const newStack = prev.slice(0, -1);
      console.log('📚 NavigationStack: Stack after goBack:', newStack);
      return newStack;
    });

    console.log('✅ NavigationStack: Returning back route:', backRoute);
    return backRoute;
  }, [navigationStack]);

  const setBaseRoute = useCallback((route: string) => {
    console.log('🏠 NavigationStack: SET BASE ROUTE:', route);
    setNavigationStack([route]);
    console.log('📚 NavigationStack: Stack now:', [route]);
  }, []);

  const clearStack = useCallback(() => {
    console.log('🗑️ NavigationStack: CLEAR STACK');
    setNavigationStack([]);
    console.log('📚 NavigationStack: Stack now: []');
  }, []);

  const getStackInfo = useCallback(() => {
    return {
      stack: navigationStack,
      canGoBack: navigationStack.length > 1
    };
  }, [navigationStack]);

  return (
    <NavigationContext.Provider value={{
      navigationStack,
      navigationState,
      pushToStack,
      goBack,
      setBaseRoute,
      clearStack,
      getStackInfo,
      setNavigationState
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Export the enum for use in other components
export { NavigationState };
