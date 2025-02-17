import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { TypingArea } from './components/TypingArea';
import { StatsDisplay } from './components/StatsDisplay';
import { SessionResults } from './components/SessionResults';
import { useGameStore } from './store/useGameStore';
import { getRandomSnippet } from './data/snippets';
import { Language } from './types';
import { CodeSnippet } from './data/snippets';
import { SessionStats } from './types';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastSessionStats, setLastSessionStats] = useState<SessionStats | null>(null);
  const [activeTab, setActiveTab] = useState<'practice' | 'stats'>('practice');

  const { updateStats, resetProgress } = useGameStore();

  // Load initial snippet
  useEffect(() => {
    loadNewSnippet();
  }, [selectedLanguage]);

  const loadNewSnippet = () => {
    const snippet = getRandomSnippet(selectedLanguage);
    setCurrentSnippet(snippet);
    setShowResults(false);
    setLastSessionStats(null);
  };

  const handleSnippetComplete = (stats: SessionStats) => {
    setLastSessionStats(stats);
    setShowResults(true);
    updateStats(stats);
  };

  const handleNextSnippet = () => {
    loadNewSnippet();
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
      loadNewSnippet();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-dark-border">
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'practice'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-dark-muted hover:text-dark-text'
              }`}
            >
              Stats
            </button>
          </div>

          {/* Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                />
                <button
                  onClick={loadNewSnippet}
                  className="px-4 py-2 bg-dark-card hover:bg-dark-border text-dark-text rounded-lg transition-colors text-sm"
                >
                  🔄 New Snippet
                </button>
              </div>

              {!showResults && currentSnippet && (
                <TypingArea snippet={currentSnippet} onComplete={handleSnippetComplete} />
              )}

              {showResults && lastSessionStats && (
                <SessionResults stats={lastSessionStats} onNextSnippet={handleNextSnippet} />
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Statistics</h2>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-accent-error/20 hover:bg-accent-error/30 text-accent-error rounded-lg transition-colors text-sm"
                >
                  Reset Progress
                </button>
              </div>
              <StatsDisplay />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
