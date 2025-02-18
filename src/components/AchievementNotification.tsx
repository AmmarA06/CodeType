import { useEffect } from 'react';
import { Achievement } from '../types';
import { useGameStore } from '../store/useGameStore';

export const AchievementNotification = () => {
  const { recentlyUnlocked, clearRecentlyUnlocked } = useGameStore();

  useEffect(() => {
    if (recentlyUnlocked.length > 0) {
      const timer = setTimeout(() => {
        clearRecentlyUnlocked();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, clearRecentlyUnlocked]);

  if (recentlyUnlocked.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3">
      {recentlyUnlocked.map((achievement: Achievement) => (
        <div
          key={achievement.id}
          className="bg-dark-card border-2 border-accent-success rounded-lg p-4 shadow-2xl animate-slide-up min-w-[300px]"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">{achievement.icon}</div>
            <div className="flex-1">
              <div className="text-accent-success font-semibold text-sm mb-1">
                🎉 Achievement Unlocked!
              </div>
              <div className="text-dark-text font-bold">{achievement.name}</div>
              <div className="text-dark-muted text-xs">{achievement.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
