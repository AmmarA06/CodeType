import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameStats, SessionStats } from '../types';

interface GameStore {
  stats: GameStats;
  updateStats: (sessionStats: SessionStats) => void;
  resetProgress: () => void;
  getXPForNextLevel: () => number;
  getXPProgress: () => number;
}

const initialStats: GameStats = {
  totalSnippets: 0,
  totalChars: 0,
  totalLines: 0,
  averageAccuracy: 0,
  bestWPM: 0,
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  perfectSnippets: 0,
};

const XP_PER_LEVEL = 100;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      stats: initialStats,

      updateStats: (sessionStats: SessionStats) => {
        const { stats } = get();

        // Calculate XP earned: (WPM × accuracy%) / 10
        const xpEarned = Math.floor((sessionStats.wpm * sessionStats.accuracy) / 10);

        // Update total stats
        const newTotalSnippets = stats.totalSnippets + 1;
        const newTotalChars = stats.totalChars + sessionStats.totalChars;

        // Calculate new average accuracy
        const newAverageAccuracy =
          (stats.averageAccuracy * stats.totalSnippets + sessionStats.accuracy) / newTotalSnippets;

        // Update best WPM
        const newBestWPM = Math.max(stats.bestWPM, sessionStats.wpm);

        // Update streak
        const isPerfect = sessionStats.accuracy === 100;
        const newStreak = isPerfect ? stats.currentStreak + 1 : 0;
        const newPerfectSnippets = isPerfect ? stats.perfectSnippets + 1 : stats.perfectSnippets;

        // Calculate new level
        const newTotalXP = stats.totalXP + xpEarned;
        const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;

        set({
          stats: {
            ...stats,
            totalSnippets: newTotalSnippets,
            totalChars: newTotalChars,
            averageAccuracy: newAverageAccuracy,
            bestWPM: newBestWPM,
            totalXP: newTotalXP,
            level: newLevel,
            currentStreak: newStreak,
            perfectSnippets: newPerfectSnippets,
            lastSessionWPM: sessionStats.wpm,
            lastSessionAccuracy: sessionStats.accuracy,
          },
        });
      },

      resetProgress: () => {
        set({
          stats: initialStats,
        });
      },

      getXPForNextLevel: () => {
        const { stats } = get();
        return stats.level * XP_PER_LEVEL;
      },

      getXPProgress: () => {
        const { stats } = get();
        const currentLevelXP = (stats.level - 1) * XP_PER_LEVEL;
        const xpIntoCurrentLevel = stats.totalXP - currentLevelXP;
        return (xpIntoCurrentLevel / XP_PER_LEVEL) * 100;
      },
    }),
    {
      name: 'codetype-storage',
    }
  )
);
