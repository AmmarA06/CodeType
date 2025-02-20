import { useEffect, ReactNode, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGameStore } from '../store/useGameStore';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { loadStats, loading: statsLoading, stats } = useGameStore();
  const hasLoadedStats = useRef(false);

  useEffect(() => {
    const loadUserStats = async () => {
      if (user && !hasLoadedStats.current && stats.totalSnippets === 0 && stats.totalXP === 0) {
        hasLoadedStats.current = true;
        try {
          await loadStats(user.id);
        } catch (error) {
          hasLoadedStats.current = false;
        }
      }
    };

    loadUserStats();
  }, [user, loadStats, stats]);

  if (authLoading || (user && statsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-5xl">⚡</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CodeType
            </h1>
          </div>
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-300 text-lg">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
