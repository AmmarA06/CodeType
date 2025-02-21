/**
 * Achievements Panel Component
 *
 * NOTE: This component is not yet integrated with the Supabase version.
 * Achievement tracking will be re-enabled in a future update.
 *
 * TODO: Implement achievements table in Supabase and sync logic
 */

export const AchievementsPanel = () => {
  // Temporary: Return placeholder until achievements are re-implemented
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-xl font-bold mb-2">Achievements Coming Soon!</h2>
        <p className="text-dark-muted">
          Achievement tracking will be re-enabled in a future update.
        </p>
      </div>
    </div>
  );
};
