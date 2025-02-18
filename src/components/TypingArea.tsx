import { useState, useEffect, useRef, useCallback } from 'react';
import { CodeSnippet } from '../data/snippets';
import { SessionStats } from '../types';

interface TypingAreaProps {
  snippet: CodeSnippet;
  onComplete: (stats: SessionStats) => void;
}

export const TypingArea = ({ snippet, onComplete }: TypingAreaProps) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);
  const pendingCursorPos = useRef<number | null>(null);

  const targetCode = snippet.code;

  useEffect(() => {
    setUserInput('');
    setStartTime(null);
    setElapsedTime(0);
    setIsComplete(false);
    pendingCursorPos.current = null;
    inputRef.current?.focus();

    // Clear any existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [snippet]);

  // Handle pending cursor position after state updates
  useEffect(() => {
    if (pendingCursorPos.current !== null && inputRef.current) {
      const pos = pendingCursorPos.current;
      inputRef.current.selectionStart = pos;
      inputRef.current.selectionEnd = pos;
      pendingCursorPos.current = null;
    }
  }, [userInput]);

  // Timer effect
  useEffect(() => {
    if (startTime && !isComplete) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startTime, isComplete]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const start = e.currentTarget.selectionStart;
    const end = e.currentTarget.selectionEnd;

    // Handle Tab key (both Tab and Shift+Tab)
    if (e.key === 'Tab') {
      e.preventDefault();

      if (e.shiftKey) {
        // Shift+Tab: Remove indentation (dedent)
        const textBeforeStart = userInput.substring(0, start);

        // Check if there are spaces/tabs before cursor
        const indentMatch = textBeforeStart.match(/(\s+)$/);

        if (indentMatch) {
          const indentToRemove = indentMatch[1];
          let removeCount = 0;

          // Remove up to 4 spaces or 1 tab
          if (indentToRemove.endsWith('\t')) {
            removeCount = 1;
          } else {
            // Remove up to 4 spaces
            removeCount = Math.min(4, indentToRemove.length);
            // If there are 2 spaces, remove 2
            if (indentToRemove.length >= 2 && indentToRemove.length < 4) {
              removeCount = 2;
            }
          }

          const newValue = userInput.substring(0, start - removeCount) + userInput.substring(start);
          setUserInput(newValue);
          pendingCursorPos.current = start - removeCount;
        }
        return;
      }

      // Regular Tab: Add indentation
      // Determine what to insert based on what's expected in the target code
      const remainingTarget = targetCode.substring(start);
      let tabString = '    '; // Default: 4 spaces

      // Check if target code has a tab character at this position
      if (remainingTarget.startsWith('\t')) {
        tabString = '\t';
      } else if (remainingTarget.startsWith('    ')) {
        tabString = '    '; // 4 spaces
      } else if (remainingTarget.startsWith('  ')) {
        tabString = '  '; // 2 spaces
      }

      const newValue = userInput.substring(0, start) + tabString + userInput.substring(end);

      // Only update if within target length
      if (newValue.length <= targetCode.length) {
        setUserInput(newValue);
        pendingCursorPos.current = start + tabString.length;
      }
      return;
    }

    // Handle Enter key - Smart auto-indentation
    if (e.key === 'Enter') {
      e.preventDefault();

      // Get current line to analyze indentation
      const textBeforeCursor = userInput.substring(0, start);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];

      // Measure current indentation
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';

      // Check if current line ends with colon (Python) or opening brace (C++/JS/Rust)
      const trimmedLine = currentLine.trim();
      const needsExtraIndent = trimmedLine.endsWith(':') ||
                               trimmedLine.endsWith('{') ||
                               trimmedLine.endsWith('(');

      // Determine indentation for next line
      let nextIndent = currentIndent;
      if (needsExtraIndent) {
        // Add one level of indentation
        const indentUnit = snippet.language === 'javascript' ? '  ' : '    ';
        nextIndent = currentIndent + indentUnit;
      }

      const newValue = userInput.substring(0, start) + '\n' + nextIndent + userInput.substring(end);

      // Only update if within target length
      if (newValue.length <= targetCode.length) {
        setUserInput(newValue);
        pendingCursorPos.current = start + 1 + nextIndent.length;
      }
      return;
    }

    // Handle Backspace - Smart deletion of auto-paired characters
    if (e.key === 'Backspace' && start === end && start > 0) {
      const charBefore = userInput[start - 1];
      const charAfter = userInput[start];

      // Check if we're deleting an opening bracket/quote with matching closing one
      const pairs: { [key: string]: string } = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'",
        '`': '`'
      };

      if (pairs[charBefore] === charAfter) {
        e.preventDefault();
        // Delete both the opening and closing character
        const newValue = userInput.substring(0, start - 1) + userInput.substring(start + 1);
        setUserInput(newValue);
        pendingCursorPos.current = start - 1;
        return;
      }
    }

    // Prevent paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      return;
    }

    // Prevent cut
    if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
      e.preventDefault();
      return;
    }
  };

  const handleBeforeInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    const data = inputEvent.data;

    if (!data || data.length !== 1) return;

    const start = inputRef.current?.selectionStart ?? userInput.length;
    const end = inputRef.current?.selectionEnd ?? userInput.length;

    const pairs: { [key: string]: string } = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    // Check if user typed an opening bracket/quote
    if (pairs[data]) {
      e.preventDefault();
      const closingChar = pairs[data];

      // Insert both opening and closing characters at cursor position
      const newValue = userInput.substring(0, start) + data + closingChar + userInput.substring(end);

      if (newValue.length <= targetCode.length) {
        setUserInput(newValue);
        pendingCursorPos.current = start + 1; // Cursor between the pair
      }
      return;
    }

    // Check if user typed a closing bracket/quote
    const closingChars = [')', ']', '}', '"', "'", '`'];
    if (closingChars.includes(data)) {
      // If the next character is already the closing character, skip it
      if (userInput[start] === data) {
        e.preventDefault();
        pendingCursorPos.current = start + 1; // Just move cursor forward
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Start timer on first character
    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    // Prevent typing more than target length
    if (value.length <= targetCode.length) {
      setUserInput(value);

      // Check if complete
      if (value.length === targetCode.length && !isComplete) {
        setIsComplete(true);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
        }
        calculateStats(value);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const calculateStats = useCallback(
    (finalInput: string) => {
      if (!startTime) return;

      const endTime = Date.now();
      const timeElapsedMinutes = (endTime - startTime) / 1000 / 60; // in minutes

      let correctChars = 0;
      let errors = 0;

      for (let i = 0; i < targetCode.length; i++) {
        if (i < finalInput.length && finalInput[i] === targetCode[i]) {
          correctChars++;
        } else if (i < finalInput.length) {
          errors++;
        }
      }

      const totalChars = targetCode.length;
      // WPM calculation: (correct_characters / 5) / time_in_minutes
      const wpm = timeElapsedMinutes > 0 ? Math.round((correctChars / 5) / timeElapsedMinutes) : 0;
      // Accuracy: (correct_chars / total_chars) * 100
      const accuracy = Math.round((correctChars / totalChars) * 100);

      const stats: SessionStats = {
        startTime,
        endTime,
        wpm,
        accuracy,
        correctChars,
        totalChars,
        errors,
      };

      setTimeout(() => onComplete(stats), 500);
    },
    [startTime, targetCode, onComplete]
  );

  const getCharClass = (index: number): string => {
    if (index >= userInput.length) {
      return 'text-dark-muted';
    }
    
    return userInput[index] === targetCode[index]
      ? 'text-accent-success bg-accent-success/10'
      : 'text-accent-error bg-accent-error/20';
  };

  const getCurrentWPM = (): number => {
    if (!startTime || userInput.length === 0) return 0;
    const timeElapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    if (timeElapsedMinutes === 0) return 0;
    const correctChars = userInput.split('').filter((char, i) => char === targetCode[i]).length;
    return Math.round((correctChars / 5) / timeElapsedMinutes);
  };

  const getAccuracy = (): number => {
    if (userInput.length === 0) return 100;
    const correctChars = userInput.split('').filter((char, i) => char === targetCode[i]).length;
    return Math.round((correctChars / userInput.length) * 100);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats Display */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <div className="flex gap-6">
          <div>
            <span className="text-dark-muted">Time: </span>
            <span className="text-accent-primary font-semibold font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div>
            <span className="text-dark-muted">WPM: </span>
            <span className="text-accent-warning font-semibold">{getCurrentWPM()}</span>
          </div>
          <div>
            <span className="text-dark-muted">Accuracy: </span>
            <span className={`font-semibold ${getAccuracy() >= 95 ? 'text-accent-success' : 'text-accent-warning'}`}>
              {getAccuracy()}%
            </span>
          </div>
          <div>
            <span className="text-dark-muted">Progress: </span>
            <span className="text-accent-primary font-semibold">
              {userInput.length}/{targetCode.length}
            </span>
          </div>
        </div>
        <div className="text-dark-muted">
          Difficulty: <span className="text-accent-primary capitalize">{snippet.difficulty}</span>
        </div>
      </div>

      {/* Code Display - Non-selectable */}
      <div className="relative bg-dark-card border border-dark-border rounded-lg p-6 mb-4 select-none">
        <div className="absolute top-2 right-2 text-xs text-dark-muted uppercase">
          {snippet.language}
        </div>
        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all pointer-events-none">
          {targetCode.split('').map((char, index) => (
            <span key={index} className={getCharClass(index)}>
              {char}
            </span>
          ))}
        </pre>
      </div>

      {/* Code Editor Input Area */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={userInput}
          onBeforeInput={handleBeforeInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onCut={(e) => e.preventDefault()}
          className="w-full min-h-[200px] p-4 bg-dark-bg border border-dark-border rounded-lg font-mono text-sm focus:outline-none focus:border-accent-primary resize-none leading-relaxed"
          placeholder="Start typing the code above..."
          autoFocus
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          disabled={isComplete}
          style={{
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'auto'
          }}
        />
        {!startTime && (
          <div className="absolute bottom-4 right-4 text-xs text-dark-muted max-w-md">
            <div className="bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-lg p-3 space-y-1">
              <div className="font-semibold text-accent-primary mb-2">💡 Smart Editor Tips:</div>
              <div>• Tab: Auto-indentation forward</div>
              <div>• Shift+Tab: Remove indentation (dedent)</div>
              <div>• Enter after : or {'{}'}: Auto-indent next line</div>
              <div>• Type (, [, {'{}'}, ": Auto-close brackets</div>
              <div>• Backspace on (): Deletes both characters</div>
            </div>
          </div>
        )}
      </div>

      {isComplete && (
        <div className="mt-4 p-4 bg-accent-success/10 border border-accent-success/30 rounded-lg text-center animate-slide-up">
          <p className="text-accent-success font-semibold">
            ✓ Snippet Complete! Calculating results...
          </p>
        </div>
      )}
    </div>
  );
};
