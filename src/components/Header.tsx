import { useGameStore } from '../store/useGameStore';

export const Header = () => {
  const { stats, getXPProgress } = useGameStore();

  return (
    <header className="bg-dark-card border-b border-dark-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">⌨️</div>
          <div>
            <h1 className="text-xl font-bold text-accent-primary">CodeType</h1>
            <p className="text-xs text-dark-muted">Gamified typing for programmers</p>
          </div>
        </div>

        {/* Level and XP */}
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
        </div>
      </div>
    </header>
  );
};
