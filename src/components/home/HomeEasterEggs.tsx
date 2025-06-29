
import * as React from 'react';
import ClickableEasterEgg from '@/components/easter-eggs/ClickableEasterEgg';
import DeveloperConsole from '@/components/easter-eggs/DeveloperConsole';
import { useEasterEggsIntegration } from '@/hooks/use-easter-eggs-integration';

const HomeEasterEggs: React.FC = () => {
  const { isDevMode, toggleDevMode, showDevConsole, setShowDevConsole } = useEasterEggsIntegration();

  return (
    <>
      {/* Hidden developer console trigger */}
      {isDevMode && (
        <div className="fixed bottom-4 right-4 z-40">
          <ClickableEasterEgg
            requiredClicks={3}
            message="🔧 Developer Console Activated!"
            action={() => setShowDevConsole(true)}
          >
            <div className="w-4 h-4 bg-green-600 rounded-full opacity-50 hover:opacity-100 transition-opacity" />
          </ClickableEasterEgg>
        </div>
      )}
      
      {/* Secret Achievement Unlocked trigger */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ClickableEasterEgg
            requiredClicks={5}
            message="🏆 Secret Achievement Unlocked!"
            action={toggleDevMode}
          >
            <h2 className="text-2xl font-bold mb-8 text-greentrail-800 dark:text-greentrail-200 text-center">
              Earn Achievements
            </h2>
          </ClickableEasterEgg>
        </div>
      </div>

      {showDevConsole && (
        <DeveloperConsole onClose={() => setShowDevConsole(false)} />
      )}
    </>
  );
};

export default HomeEasterEggs;
