import { useGameStore } from '../store/useGameStore';

export const StatsDisplay = () => {
  const { stats } = useGameStore();

  const statCards = [
    { label: 'Snippets Completed', value: stats.totalSnippets, icon: '📝' },
    { label: 'Characters Typed', value: stats.totalChars.toLocaleString(), icon: '⌨️' },
    { label: 'Best WPM', value: stats.bestWPM, icon: '⚡' },
    { label: 'Avg Accuracy', value: `${stats.averageAccuracy.toFixed(1)}%`, icon: '🎯' },
    { label: 'Perfect Snippets', value: stats.perfectSnippets, icon: '💎' },
    { label: 'Current Streak', value: stats.currentStreak, icon: '🔥' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-dark-card border border-dark-border rounded-lg p-4 text-center hover:border-accent-primary/50 transition-colors"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-accent-primary mb-1">{stat.value}</div>
          <div className="text-xs text-dark-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
