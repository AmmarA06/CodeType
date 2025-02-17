export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
  unlocked: boolean;
}

export interface GameStats {
  totalSnippets: number;
  totalChars: number;
  totalLines: number;
  averageAccuracy: number;
  bestWPM: number;
  totalXP: number;
  level: number;
  currentStreak: number;
  perfectSnippets: number;
  lastSessionWPM?: number;
  lastSessionAccuracy?: number;
}

export interface SessionStats {
  startTime: number;
  endTime?: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  errors: number;
}

export type Language = 'python' | 'javascript' | 'cpp' | 'rust';
