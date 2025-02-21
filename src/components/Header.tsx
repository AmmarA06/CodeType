import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { stats, getXPProgress } = useGameStore();
  const { user, signOut, authLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut();
    }
  };

  const userEmail = user?.email || '';
  const displayEmail = userEmail.length > 25 ? `${userEmail.substring(0, 22)}...` : userEmail;

  return (
    <header className="bg-dark-card border-b border-dark-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⌨️</div>
          <div>
            <h1 className="text-xl font-bold text-accent-primary">CodeType</h1>
            <p className="text-xs text-dark-muted">Gamified typing for programmers</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-dark-muted">Level</div>
            <div className="text-2xl font-bold text-accent-warning">{stats.level}</div>
          </div>

          <div className="w-64">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-dark-muted">XP Progress</span>
              <span className="text-xs text-accent-primary font-semibold">{stats.totalXP} XP</span>
            </div>
            <div className="h-3 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
              <div
                className="h-full bg-gradient-to-r from-accent-primary to-accent-success transition-all duration-300"
                style={{ width: `${getXPProgress()}%` }}
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-bg hover:bg-dark-border rounded-lg transition-colors text-sm border border-dark-border"
            >
              <span className="text-lg">👤</span>
              <span className="text-dark-text hidden md:inline">{displayEmail}</span>
              <svg
                className={`w-4 h-4 text-dark-muted transition-transform ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />

                <div className="absolute right-0 mt-2 w-64 bg-dark-card border border-dark-border rounded-lg shadow-2xl py-2 z-20">
                  <div className="px-4 py-3 border-b border-dark-border">
                    <p className="text-xs text-dark-muted mb-1">Signed in as</p>
                    <p className="text-sm text-dark-text font-medium break-all">{userEmail}</p>
                  </div>

                  <div className="px-4 py-3 border-b border-dark-border">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-dark-muted">Snippets</p>
                        <p className="text-dark-text font-semibold">{stats.totalSnippets}</p>
                      </div>
                      <div>
                        <p className="text-dark-muted">Best WPM</p>
                        <p className="text-dark-text font-semibold">{stats.bestWPM.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-dark-muted">Accuracy</p>
                        <p className="text-dark-text font-semibold">
                          {stats.averageAccuracy.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-dark-muted">Total XP</p>
                        <p className="text-dark-text font-semibold">{stats.totalXP}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-2">
                    <button
                      onClick={handleLogout}
                      disabled={authLoading}
                      className="w-full px-4 py-2 text-left text-sm text-accent-error hover:bg-accent-error/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {authLoading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
