import { useGameStore } from '../store/useGameStore';

export const AchievementsPanel = () => {
  const { achievements } = useGameStore();

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Achievements</h2>
        <div className="text-sm text-dark-muted">
          {unlockedCount} / {achievements.length} unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`
              p-4 rounded-lg border transition-all
              ${
                achievement.unlocked
                  ? 'bg-accent-success/10 border-accent-success/50'
                  : 'bg-dark-bg border-dark-border opacity-50'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className={`font-semibold ${achievement.unlocked ? 'text-accent-success' : 'text-dark-muted'}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-dark-muted mt-1">{achievement.description}</div>
              </div>
              {achievement.unlocked && (
                <div className="text-accent-success text-xl">✓</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
