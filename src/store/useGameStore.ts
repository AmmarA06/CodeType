import { create } from 'zustand';
import { GameStats, SessionStats } from '../types';
import { supabase } from '../lib/supabaseClient';

interface GameStore {
  stats: GameStats;
  loading: boolean;
  error: string | null;
  updateStats: (sessionStats: SessionStats, userId: string) => Promise<void>;
  loadStats: (userId: string) => Promise<void>;
  createInitialStats: (userId: string) => Promise<void>;
  resetProgress: (userId?: string) => Promise<void>;
  getXPForNextLevel: () => number;
  getXPProgress: () => number;
  setStats: (stats: GameStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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

export const useGameStore = create<GameStore>((set, get) => ({
  stats: initialStats,
  loading: false,
  error: null,

  loadStats: async (userId: string) => {
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await get().createInitialStats(userId);
          return;
        }
        throw error;
      }

      const loadedStats: GameStats = {
        totalSnippets: data.total_snippets || 0,
        totalChars: data.total_chars || 0,
        totalLines: data.total_lines || 0,
        averageAccuracy: parseFloat(data.average_accuracy) || 0,
        bestWPM: parseFloat(data.best_wpm) || 0,
        totalXP: data.total_xp || 0,
        level: data.level || 1,
        currentStreak: data.current_streak || 0,
        perfectSnippets: data.perfect_snippets || 0,
        lastSessionWPM: data.last_session_wpm ? parseFloat(data.last_session_wpm) : undefined,
        lastSessionAccuracy: data.last_session_accuracy
          ? parseFloat(data.last_session_accuracy)
          : undefined,
      };

      set({ stats: loadedStats, loading: false });
    } catch (error) {
      set({
        stats: initialStats,
        error: error instanceof Error ? error.message : 'Failed to load stats',
        loading: false,
      });
    }
  },

  createInitialStats: async (userId: string) => {
    try {
      const { error } = await supabase.from('user_stats').insert({
        user_id: userId,
        total_snippets: 0,
        total_chars: 0,
        total_lines: 0,
        best_wpm: 0,
        average_accuracy: 0,
        total_xp: 0,
        level: 1,
        current_streak: 0,
        perfect_snippets: 0,
      }).select().single();

      if (error) {
        throw error;
      }

      set({ stats: initialStats, loading: false });
    } catch (error) {
      set({
        stats: initialStats,
        error: error instanceof Error ? error.message : 'Failed to create initial stats',
        loading: false,
      });
    }
  },

  updateStats: async (sessionStats: SessionStats, userId: string) => {
    const { stats } = get();

    const xpEarned = Math.floor((sessionStats.wpm * sessionStats.accuracy) / 10);
    const newTotalSnippets = stats.totalSnippets + 1;
    const newTotalChars = stats.totalChars + sessionStats.totalChars;
    const newAverageAccuracy =
      (stats.averageAccuracy * stats.totalSnippets + sessionStats.accuracy) / newTotalSnippets;
    const newBestWPM = Math.max(stats.bestWPM, sessionStats.wpm);
    const isPerfect = sessionStats.accuracy === 100;
    const newStreak = isPerfect ? stats.currentStreak + 1 : 0;
    const newPerfectSnippets = isPerfect ? stats.perfectSnippets + 1 : stats.perfectSnippets;
    const newTotalXP = stats.totalXP + xpEarned;
    const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;

    const updatedStats: GameStats = {
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
    };

    set({ stats: updatedStats });

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          total_snippets: newTotalSnippets,
          total_chars: newTotalChars,
          total_lines: stats.totalLines,
          best_wpm: newBestWPM,
          average_accuracy: newAverageAccuracy,
          total_xp: newTotalXP,
          level: newLevel,
          current_streak: newStreak,
          perfect_snippets: newPerfectSnippets,
          last_session_wpm: sessionStats.wpm,
          last_session_accuracy: sessionStats.accuracy,
        })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sync stats',
      });
    }
  },

  resetProgress: async (userId?: string) => {
    set({ stats: initialStats });

    if (userId) {
      try {
        await supabase
          .from('user_stats')
          .update({
            total_snippets: 0,
            total_chars: 0,
            total_lines: 0,
            best_wpm: 0,
            average_accuracy: 0,
            total_xp: 0,
            level: 1,
            current_streak: 0,
            perfect_snippets: 0,
            last_session_wpm: null,
            last_session_accuracy: null,
          })
          .eq('user_id', userId);
      } catch (error) {
        // Silent error handling
      }
    }
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

  setStats: (stats: GameStats) => set({ stats }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
