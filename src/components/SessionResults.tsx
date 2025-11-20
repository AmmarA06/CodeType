import { SessionStats } from '../types';
import { SessionChart } from './SessionChart';

interface SessionResultsProps {
  stats: SessionStats;
  onNextSnippet: () => void;
}

export const SessionResults = ({ stats, onNextSnippet }: SessionResultsProps) => {
  const duration = stats.endTime && stats.startTime
    ? ((stats.endTime - stats.startTime) / 1000).toFixed(1)
    : 0;

  const xpEarned = Math.floor((stats.wpm * stats.accuracy) / 10);

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-8 max-w-4xl mx-auto animate-slide-up">
      <h2 className="text-2xl font-bold text-center mb-6 text-accent-success">
        Snippet Complete! 🎉
      </h2>

      {/* Performance Chart */}
      {stats.wpmHistory && stats.wpmHistory.length > 0 && (
        <SessionChart
          wpmHistory={stats.wpmHistory}
          errorHistory={stats.errorHistory || []}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-bg rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-accent-warning">{stats.wpm}</div>
          <div className="text-sm text-dark-muted mt-1">WPM</div>
        </div>
        <div className="bg-dark-bg rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-accent-primary">{stats.accuracy}%</div>
          <div className="text-sm text-dark-muted mt-1">Accuracy</div>
        </div>
        <div className="bg-dark-bg rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-accent-success">+{xpEarned}</div>
          <div className="text-sm text-dark-muted mt-1">XP Earned</div>
        </div>
        <div className="bg-dark-bg rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-dark-text">{duration}s</div>
          <div className="text-sm text-dark-muted mt-1">Time</div>
        </div>
      </div>

      {/* Enhanced Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-6">
        {stats.rawWPM !== undefined && (
          <div className="bg-dark-bg rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-400">{stats.rawWPM}</div>
            <div className="text-xs text-dark-muted mt-1">Raw WPM</div>
          </div>
        )}
        {stats.consistency !== undefined && (
          <div className="bg-dark-bg rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-accent-primary">{stats.consistency}%</div>
            <div className="text-xs text-dark-muted mt-1">Consistency</div>
          </div>
        )}
        <div className="bg-dark-bg rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-success">{stats.correctChars}</div>
          <div className="text-xs text-dark-muted mt-1">Correct</div>
        </div>
        <div className="bg-dark-bg rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-accent-error">{stats.errors}</div>
          <div className="text-xs text-dark-muted mt-1">Errors</div>
        </div>
      </div>

      <button
        onClick={onNextSnippet}
        className="w-full bg-accent-primary hover:bg-accent-primary/80 text-dark-bg font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Next Snippet →
      </button>
    </div>
  );
};
