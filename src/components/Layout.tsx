import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import NavigationHeader from './NavigationHeader';

import { useNavigationContext, NavigationState } from '@/contexts/NavigationContext';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showAvatar?: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
  currentView?: string;
  showBottomNav?: boolean;
  hideHeader?: boolean;
  headerProps?: HeaderProps | null;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView = 'home',
  showBottomNav = true,
  hideHeader = false,
  headerProps
}) => {
  const location = useLocation();
  const { 
    pushToStack, 
    setBaseRoute, 
    clearStack, 
    navigationState, 
    setNavigationState 
  } = useNavigationContext();

  // Simplified navigation tracking with early returns to prevent loops
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    console.log('🔄 Layout: Route changed to:', currentPath);
    console.log('🔄 Layout: Current navigation state:', navigationState);
    
    // Auto-clear stack when we're on Home page
    if (currentPath.startsWith('/?') || currentPath === '/') {
      if (hideHeader && navigationState !== NavigationState.IDLE) {
        console.log('🏠 Layout: On Home page - clearing stack automatically');
        clearStack();
        setNavigationState(NavigationState.IDLE);
      }
      return; // Early return to prevent further processing on home
    }
    
    // Handle navigation based on current state
    switch (navigationState) {
      case NavigationState.BOTTOM_NAV:
        console.log('🚫 Layout: Bottom nav navigation, not pushing to stack');
        setNavigationState(NavigationState.IDLE);
        break;
      case NavigationState.FROM_HOME:
        if (!hideHeader) {
          console.log('🏠 Layout: Navigation from Home, setting as base route:', currentPath);
          setBaseRoute(currentPath);
        }
        setNavigationState(NavigationState.IDLE);
        break;
      case NavigationState.REGULAR:
        if (!hideHeader) {
          console.log('📍 Layout: Regular navigation, pushing to stack');
          pushToStack(currentPath);
        }
        setNavigationState(NavigationState.IDLE);
        break;
      case NavigationState.IDLE:
        // Default behavior for untracked navigation
        if (!hideHeader) {
          console.log('📍 Layout: Untracked navigation, pushing to stack');
          pushToStack(currentPath);
        }
        break;
    }
  }, [location.pathname, location.search, hideHeader, navigationState]); // Removed function dependencies

  // Determine layout classes based on header and bottom nav visibility
  const getLayoutClasses = () => {
    if (showBottomNav) {
      // With bottom nav - use CSS Grid
      return hideHeader ? "layout-grid-no-header" : "layout-grid";
    } else {
      // Without bottom nav - use flexbox
      return "h-dvh flex flex-col overflow-hidden";
    }
  };

  const getContentClasses = () => {
    if (showBottomNav) {
      return "layout-content";
    } else {
      return "flex-1 min-h-0 overflow-hidden";
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Fixed Header - only show if not hidden and headerProps exist */}
      {!hideHeader && headerProps && (
        <div className={showBottomNav ? "layout-header" : "flex-shrink-0"} style={{ height: 'var(--header-height)' }}>
          <NavigationHeader {...headerProps} />
        </div>
      )}
      
      {/* Content Area */}
      <div className={getContentClasses()}>
        {children}
      </div>
      
      {/* Fixed Bottom Navigation */}
      {showBottomNav && (
        <div className="layout-bottom-nav">
          <BottomNavigation currentView={currentView} />
        </div>
      )}
      
    </div>
  );
};

export default Layout;
