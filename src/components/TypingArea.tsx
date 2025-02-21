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

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [snippet]);

  useEffect(() => {
    if (pendingCursorPos.current !== null && inputRef.current) {
      const pos = pendingCursorPos.current;
      inputRef.current.selectionStart = pos;
      inputRef.current.selectionEnd = pos;
      pendingCursorPos.current = null;
    }
  }, [userInput]);

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

    if (e.key === 'Tab') {
      e.preventDefault();

      if (e.shiftKey) {
        const textBeforeStart = userInput.substring(0, start);
        const lastNewlineIndex = textBeforeStart.lastIndexOf('\n');
        const currentLineStart = lastNewlineIndex + 1;
        const currentLineBeforeCursor = textBeforeStart.substring(currentLineStart);
        const indentMatch = currentLineBeforeCursor.match(/^(\s+)/);

        if (indentMatch) {
          const indent = indentMatch[1];
          let removeCount = 0;

          if (indent.startsWith('\t')) {
            removeCount = 1;
          } else if (indent.length >= 4) {
            removeCount = 4;
          } else if (indent.length >= 2) {
            removeCount = 2;
          } else {
            removeCount = indent.length;
          }

          const newValue = userInput.substring(0, currentLineStart) +
                          userInput.substring(currentLineStart + removeCount);
          setUserInput(newValue);
          pendingCursorPos.current = start - removeCount;
        }
        return;
      }

      const remainingTarget = targetCode.substring(start);
      let tabString = '    ';

      if (remainingTarget.startsWith('\t')) {
        tabString = '\t';
      } else if (remainingTarget.startsWith('    ')) {
        tabString = '    ';
      } else if (remainingTarget.startsWith('  ')) {
        tabString = '  ';
      }

      const newValue = userInput.substring(0, start) + tabString + userInput.substring(end);

      if (newValue.length <= targetCode.length) {
        setUserInput(newValue);
        pendingCursorPos.current = start + tabString.length;
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();

      const targetAfterCursor = targetCode.substring(start);
      const nextLineMatch = targetAfterCursor.match(/^\n(\s*)/);

      if (nextLineMatch) {
        const targetIndent = nextLineMatch[1];
        const newValue = userInput.substring(0, start) + '\n' + targetIndent + userInput.substring(end);

        if (newValue.length <= targetCode.length) {
          setUserInput(newValue);
          pendingCursorPos.current = start + 1 + targetIndent.length;
        }
      } else {
        const newValue = userInput.substring(0, start) + '\n' + userInput.substring(end);
        if (newValue.length <= targetCode.length) {
          setUserInput(newValue);
          pendingCursorPos.current = start + 1;
        }
      }
      return;
    }

    if (e.key === 'Backspace' && start === end && start > 0) {
      const charBefore = userInput[start - 1];
      const charAfter = userInput[start];
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
        const newValue = userInput.substring(0, start - 1) + userInput.substring(start + 1);
        setUserInput(newValue);
        pendingCursorPos.current = start - 1;
        return;
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      return;
    }

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

    if (pairs[data]) {
      e.preventDefault();
      const closingChar = pairs[data];
      const newValue = userInput.substring(0, start) + data + closingChar + userInput.substring(end);

      if (newValue.length <= targetCode.length) {
        setUserInput(newValue);
        pendingCursorPos.current = start + 1;
      }
      return;
    }

    const closingChars = [')', ']', '}', '"', "'", '`'];
    if (closingChars.includes(data)) {
      if (userInput[start] === data) {
        e.preventDefault();
        pendingCursorPos.current = start + 1;
      }
    }
  };

  const calculateStats = useCallback(
    (finalInput: string) => {
      if (!startTime) return;

      const endTime = Date.now();
      const timeElapsedMinutes = (endTime - startTime) / 1000 / 60;

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
      const wpm = timeElapsedMinutes > 0 ? Math.round((correctChars / 5) / timeElapsedMinutes) : 0;
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

  useEffect(() => {
    if (userInput.length === targetCode.length && !isComplete) {
      setIsComplete(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      calculateStats(userInput);
    }
  }, [userInput, targetCode.length, isComplete, calculateStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (value.length <= targetCode.length) {
      setUserInput(value);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

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
