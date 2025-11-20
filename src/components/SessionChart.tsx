import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { WPMSnapshot, ErrorEvent } from '../types';

interface SessionChartProps {
  wpmHistory: WPMSnapshot[];
  errorHistory: ErrorEvent[];
}

export const SessionChart = ({ wpmHistory, errorHistory }: SessionChartProps) => {
  if (!wpmHistory || wpmHistory.length === 0) {
    return null;
  }

  // Convert time from milliseconds to seconds
  const chartData = wpmHistory.map((snapshot) => ({
    time: snapshot.time / 1000,
    wpm: snapshot.wpm,
    rawWpm: snapshot.rawWpm,
  }));

  // Create error markers aligned with chart data
  const errorMarkers = errorHistory.map((error) => ({
    time: error.time / 1000,
    wpm: wpmHistory.find(s => Math.abs(s.time - error.time) < 500)?.wpm || 0,
  }));

  const maxWpm = Math.max(...chartData.map(d => Math.max(d.wpm, d.rawWpm))) + 20;

  return (
    <div className="w-full h-64 bg-dark-bg rounded-lg p-4 mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            domain={[0, maxWpm]}
            label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#E5E7EB',
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />

          {/* Raw WPM line (gray) */}
          <Line
            type="monotone"
            dataKey="rawWpm"
            stroke="#6B7280"
            strokeWidth={2}
            dot={false}
            name="Raw WPM"
          />

          {/* Net WPM line (yellow/gold) */}
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#FBBF24"
            strokeWidth={3}
            dot={false}
            name="WPM"
          />

          {/* Error markers (red dots) */}
          {errorMarkers.map((error, index) => (
            <ReferenceDot
              key={index}
              x={error.time}
              y={error.wpm}
              r={4}
              fill="#EF4444"
              stroke="#DC2626"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
