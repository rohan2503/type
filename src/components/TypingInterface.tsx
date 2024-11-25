'use client';

import { useState, useEffect, useCallback } from 'react';
import { texts, Level } from '@/data/texts';
import LevelSelector from './LevelSelector';
import { generateRandomParagraph } from '@/utils/randomSentence';

const INITIAL_TIME = 60; // 60 seconds timer

export default function TypingInterface() {
  const [level, setLevel] = useState<Level>('easy');
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    timeLeft: INITIAL_TIME,
    totalTyped: 0,
  });
  const [errors, setErrors] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isChangingText, setIsChangingText] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  // Get random text based on level
  const getRandomText = useCallback((currentLevel: Level) => {
    if (currentLevel === 'random') {
      return generateRandomParagraph();
    }
    const levelTexts = texts[currentLevel];
    return levelTexts[Math.floor(Math.random() * levelTexts.length)];
  }, []);

  // Initialize text
  useEffect(() => {
    setText(getRandomText(level));
  }, [getRandomText, level]);

  // Handle level change
  const handleLevelChange = (newLevel: Level) => {
    setIsChangingText(true);
    setTimeout(() => {
      setLevel(newLevel);
      resetTest();
      setIsChangingText(false);
    }, 300);
  };

  const calculateStats = useCallback(() => {
    if (input.length === 0) return;

    // Calculate WPM (assuming average word length of 5 characters)
    const words = input.length / 5;
    const minutes = elapsedTime / 60;
    const wpm = Math.round(words / minutes) || 0;

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / input.length) * 100) || 0;

    setStats(prev => ({
      ...prev,
      wpm,
      accuracy,
      totalTyped: input.length,
    }));
  }, [input, text, elapsedTime]);

  useEffect(() => {
    if (!isRunning && input.length > 0) setIsRunning(true);
    calculateStats();

    // Check for completion
    if (input.length === text.length && input.length > 0) {
      setIsRunning(false);
      setIsCompleted(true);
    }
  }, [input, isRunning, calculateStats, text.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    
    // Start timer on first character
    if (!isStarted && newInput.length === 1) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    // Only allow typing if test hasn't ended
    if (!isCompleted) {
      setInput(newInput);
      
      // Count errors (can't be corrected)
      const newErrors = newInput.split('').reduce((count, char, index) => {
        return count + (char !== text[index] ? 1 : 0);
      }, 0);
      setErrors(newErrors);

      // Update stats
      if (startTime) {  
        const timeElapsed = (Date.now() - startTime) / 1000;
        const wordsTyped = newInput.trim().split(/\s+/).length;
        const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
        const accuracy = newInput.length > 0 
          ? Math.round(((newInput.length - newErrors) / newInput.length) * 100) 
          : 100;

        setStats(prev => ({
          ...prev,
          wpm,
          accuracy,
          totalTyped: newInput.length
        }));
      }

      // Check if test is complete
      if (newInput.length === text.length) {
        setIsRunning(false);
        setIsCompleted(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Count backspace as an error and prevent its default behavior
    if (e.key === 'Backspace') {
      e.preventDefault();
      setErrors(prev => prev + 1);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isCompleted && startTime !== null) {
      interval = setInterval(() => {
        setStats(prev => ({ ...prev, timeLeft: Math.max(0, INITIAL_TIME - Math.floor((Date.now() - startTime) / 1000)) }));
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isCompleted, startTime]);

  const resetTest = () => {
    setInput('');
    setErrors(0);
    setIsRunning(false);
    setIsCompleted(false);
    setIsStarted(false);
    setElapsedTime(0);
    setStartTime(null);
    setStats({
      wpm: 0,
      accuracy: 0,
      timeLeft: INITIAL_TIME,
      totalTyped: 0,
    });
    setText(getRandomText(level));
  };

  const handleNextLevel = () => {
    const levels: Level[] = ['easy', 'medium', 'hard'];
    const currentIndex = levels.indexOf(level);
    if (currentIndex < levels.length - 1) {
      handleLevelChange(levels[currentIndex + 1]);
    }
  };

  const getPerformanceMessage = () => {
    if (stats.wpm >= 60 && stats.accuracy >= 95) return "Outstanding! You're a typing master! 🏆";
    if (stats.wpm >= 45 && stats.accuracy >= 90) return "Great job! You're getting really good! 🌟";
    if (stats.wpm >= 30 && stats.accuracy >= 85) return "Good progress! Keep practicing! 👍";
    return "Nice effort! Practice makes perfect! 💪";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <LevelSelector currentLevel={level} onLevelChange={handleLevelChange} />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="group bg-white/[0.03] rounded-2xl p-4 backdrop-blur-sm border border-white/[0.05] hover:border-[#60A5FA]/20 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-medium text-[#60A5FA]/90 mb-1 group-hover:animate-glow">{stats.wpm}</div>
          <div className="text-xs text-gray-400/60 uppercase tracking-wider font-medium">WPM</div>
        </div>
        <div className="group bg-white/[0.03] rounded-2xl p-4 backdrop-blur-sm border border-white/[0.05] hover:border-[#34D399]/20 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-medium text-[#34D399]/90 mb-1 group-hover:animate-glow">{stats.accuracy}%</div>
          <div className="text-xs text-gray-400/60 uppercase tracking-wider font-medium">Accuracy</div>
        </div>
        <div className="group bg-white/[0.03] rounded-2xl p-4 backdrop-blur-sm border border-white/[0.05] hover:border-[#FB7185]/20 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-medium text-[#FB7185]/90 mb-1 group-hover:animate-glow">{errors}</div>
          <div className="text-xs text-gray-400/60 uppercase tracking-wider font-medium">Errors</div>
        </div>
        <div className="group bg-white/[0.03] rounded-2xl p-4 backdrop-blur-sm border border-white/[0.05] hover:border-[#A78BFA]/20 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-medium text-[#A78BFA]/90 mb-1 group-hover:animate-glow">{stats.totalTyped}</div>
          <div className="text-xs text-gray-400/60 uppercase tracking-wider font-medium">Chars</div>
        </div>
        <div className="group bg-white/[0.03] rounded-2xl p-4 backdrop-blur-sm border border-white/[0.05] hover:border-[#FBBF24]/20 transition-all duration-300 hover:scale-105">
          <div className="text-3xl font-medium text-[#FBBF24]/90 mb-1 group-hover:animate-glow">{formatTime(stats.timeLeft)}</div>
          <div className="text-xs text-gray-400/60 uppercase tracking-wider font-medium">Time</div>
        </div>
      </div>

      {/* Completion Report */}
      {isCompleted && (
        <div className="bg-white/[0.03] rounded-2xl p-8 backdrop-blur-sm border border-white/[0.05] transition-all duration-300 animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-white/80">Performance</h2>
            <div className="flex gap-4">
              <button
                onClick={resetTest}
                className="px-6 py-2.5 bg-white/[0.03] text-white/70 rounded-xl hover:bg-white/[0.05] transition-all duration-300 font-medium border border-white/[0.05] hover:scale-105 tracking-wide text-sm uppercase"
              >
                Try Again
              </button>
              {level !== 'hard' && (
                <button
                  onClick={handleNextLevel}
                  className="px-6 py-2.5 bg-[#34D399]/[0.03] text-[#34D399]/90 rounded-xl hover:bg-[#34D399]/[0.05] transition-all duration-300 font-medium border border-[#34D399]/20 hover:scale-105 tracking-wide text-sm uppercase"
                >
                  Next Level →
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Progress Bars */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40 font-medium tracking-wide uppercase">WPM</span>
                <span className="text-2xl font-medium text-[#60A5FA]/90">{stats.wpm}</span>
              </div>
              <div className="h-2 bg-white/[0.02] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#60A5FA]/80 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (stats.wpm / 100) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40 font-medium tracking-wide uppercase">Accuracy</span>
                <span className="text-2xl font-medium text-[#34D399]/90">{stats.accuracy}%</span>
              </div>
              <div className="h-2 bg-white/[0.02] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#34D399]/80 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.accuracy}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40 font-medium tracking-wide uppercase">Time</span>
                <span className="text-2xl font-medium text-[#FBBF24]/90">{formatTime(elapsedTime)}</span>
              </div>
              <div className="h-2 bg-white/[0.02] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FBBF24]/80 rounded-full transition-all duration-1000"
                  style={{ width: `${(elapsedTime / 60) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40 font-medium tracking-wide uppercase">Error Rate</span>
                <span className="text-2xl font-medium text-[#FB7185]/90">{((errors / stats.totalTyped) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-white/[0.02] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FB7185]/80 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, (errors / stats.totalTyped) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40 font-medium tracking-wide uppercase">CPM</span>
                <span className="text-2xl font-medium text-[#A78BFA]/90">{Math.round((stats.totalTyped / elapsedTime) * 60)}</span>
              </div>
              <div className="h-2 bg-white/[0.02] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#A78BFA]/80 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((stats.totalTyped / elapsedTime) * 60) / 400 * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Text Display */}
      <div className="bg-white/[0.03] rounded-2xl p-8 backdrop-blur-sm border border-white/[0.05] hover:border-white/[0.08] transition-all duration-300">
        <p className={`text-lg leading-relaxed transition-opacity duration-300 ${isChangingText ? 'opacity-0' : 'opacity-100'}`}>
          {text.split('').map((char, index) => {
            let color = 'text-gray-500/60';
            if (index < input.length) {
              color = input[index] === char ? 'text-[#34D399]/90' : 'text-[#FB7185]/90';
            }
            return (
              <span key={index} className={`${color} transition-colors duration-150 font-mono`}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full p-6 rounded-2xl bg-white/[0.03] text-white/90 border border-white/[0.05] focus:ring-2 focus:ring-white/[0.08] focus:border-white/[0.08] transition-all duration-300 backdrop-blur-sm font-mono resize-none hover:border-white/[0.08]"
          placeholder={isCompleted ? "Test complete! Click 'Try Again' or 'Next Level'" : "start typing..."}
          rows={3}
          disabled={isCompleted}
        />

        {!isCompleted && (
          <div className="flex justify-between items-center">
            <button
              onClick={resetTest}
              className="px-8 py-3 bg-white/[0.03] text-white/70 rounded-xl hover:bg-white/[0.05] transition-all duration-300 font-medium border border-white/[0.05] hover:scale-105 hover:border-white/[0.08] backdrop-blur-sm"
            >
              reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
