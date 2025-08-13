
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationContext } from '@/contexts/NavigationContext';

interface NavigationHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  showAvatar?: boolean;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  showAvatar = true
}) => {
  const navigate = useNavigate();
  const { goBack, getStackInfo } = useNavigationContext();

  const handleBack = () => {
    console.log('🔙 NavigationHeader: handleBack() called');

    if (onBack) {
      console.log('🔙 NavigationHeader: Using custom onBack function');
      onBack();
      return;
    }

    console.log('🔙 NavigationHeader: Using navigation stack for back');
    const { stack, canGoBack } = getStackInfo();
    console.log('📚 NavigationHeader: Current stack info:', { stack, canGoBack });

    if (!canGoBack) {
      console.log('🔙 NavigationHeader: Cannot go back, navigating to home');
      navigate('/');
      return;
    }

    const backRoute = goBack();
    console.log('🔙 NavigationHeader: Got back route from goBack():', backRoute);

    if (backRoute) {
      console.log('🔙 NavigationHeader: Navigating to:', backRoute);
      navigate(backRoute);
    } else {
      console.log('🔙 NavigationHeader: No back route available, going to home');
      navigate('/');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between border-b z-50 h-16">
      {showBackButton ? (
        <Button variant="ghost" size="icon" onClick={handleBack} data-testid="back-button">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      ) : (
        <div className="w-10 h-10" />
      )}

      <h1 className="text-lg font-semibold truncate max-w-[200px] md:max-w-[300px]" title={title}>
        {title}
      </h1>

      {showAvatar ? (
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      ) : (
        <div className="w-10 h-10" />
      )}
    </div>
  );
};

export default NavigationHeader;
