import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Trophy, RotateCcw, Play } from 'lucide-react';
import VocabularyManager from '../../utils/vocabularyManager';

export default function TypingSpeed({ level, onBack, onWordDiscovered }) {
  const [paragraph, setParagraph] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timer, setTimer] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Load paragraph on level change
  useEffect(() => {
    loadNewParagraph();
  }, [level]);

  // Timer effect
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isFinished]);

  // Auto-focus input when game starts
  useEffect(() => {
    if (isStarted && !isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStarted, isFinished]);

  const loadNewParagraph = () => {
    const para = VocabularyManager.getRandomParagraph(level);
    if (para) {
      setParagraph(para);
      resetGame();
    }
  };

  const resetGame = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsStarted(false);
    setIsFinished(false);
    setCurrentWordIndex(0);
    setErrors(0);
    setTimer(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    if (!isStarted || isFinished) return;

    const value = e.target.value;
    setUserInput(value);

    // Check if paragraph is complete
    if (value === paragraph.text) {
      finishGame();
    }

    // Track current word index
    const words = paragraph.text.split(' ');
    const typedWords = value.trim().split(' ');
    setCurrentWordIndex(typedWords.length - 1);

    // Count errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== paragraph.text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
  };

  const finishGame = () => {
    const end = Date.now();
    setEndTime(end);
    setIsFinished(true);
    
    // Calculate stats
    const timeInMinutes = (end - startTime) / 60000;
    const wordsTyped = paragraph.text.split(' ').length;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    const accuracy = Math.round(((paragraph.text.length - errors) / paragraph.text.length) * 100);

    // Save stats
    const stats = VocabularyManager.getGameStats('typingSpeed');
    const gamesPlayed = (stats.gamesPlayed || 0) + 1;
    const totalWPM = (stats.totalWPM || 0) + wpm;
    const highScore = Math.max(stats.highScore || 0, wpm);

    VocabularyManager.updateGameStats('typingSpeed', {
      highScore,
      gamesPlayed,
      totalWPM,
      averageWPM: Math.round(totalWPM / gamesPlayed),
      lastAccuracy: accuracy
    });

    // Mark words as discovered
    const words = paragraph.text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const uniqueWords = [...new Set(words)];
    
    uniqueWords.forEach(word => {
      const allWords = VocabularyManager.getWordsByLevel(level);
      const foundWord = allWords.find(w => w.word.toLowerCase() === word);
      if (foundWord) {
        VocabularyManager.markDiscovered(foundWord.id, level);
      }
    });

    onWordDiscovered();
  };

  const calculateWPM = () => {
    if (!startTime || !endTime) return 0;
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = paragraph.text.split(' ').length;
    return Math.round(wordsTyped / timeInMinutes);
  };

  const calculateAccuracy = () => {
    if (paragraph.text.length === 0) return 100;
    return Math.round(((paragraph.text.length - errors) / paragraph.text.length) * 100);
  };

  const renderParagraph = () => {
    if (!paragraph) return null;

    const text = paragraph.text;
    const typed = userInput;

    return (
      <div className="text-xl leading-relaxed font-mono">
        {text.split('').map((char, index) => {
          let className = 'transition-all';
          
          if (index < typed.length) {
            if (typed[index] === char) {
              className += ' text-green-600 bg-green-50';
            } else {
              className += ' text-red-600 bg-red-100';
            }
          } else if (index === typed.length) {
            className += ' bg-blue-200 animate-pulse';
          } else {
            className += ' text-gray-400';
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!paragraph) {
    return (
      <div className="card-premium p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading paragraph...</p>
      </div>
    );
  }

  const stats = VocabularyManager.getGameStats('typingSpeed');

  return (
    <div className="card-premium p-4 sm:p-8 max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} className="mb-4 text-primary-600 dark:text-primary-400 hover:underline transition-colors font-medium">
        ← Back to Menu
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gradient mb-2 flex items-center justify-center gap-2">
          <Zap className="w-8 h-8 text-yellow-500" />
          Typing Speed Challenge
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{paragraph.title}</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <Timer className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p className="text-sm text-gray-600">Time</p>
          <p className="text-2xl font-bold text-blue-600">{formatTime(timer)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
          <p className="text-sm text-gray-600">WPM</p>
          <p className="text-2xl font-bold text-green-600">
            {isFinished ? calculateWPM() : '---'}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <p className="text-sm text-gray-600">Accuracy</p>
          <p className="text-2xl font-bold text-purple-600">
            {isFinished ? calculateAccuracy() : '100'}%
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-orange-600" />
          <p className="text-sm text-gray-600">High Score</p>
          <p className="text-2xl font-bold text-orange-600">{stats.highScore || 0}</p>
        </div>
      </div>

      {/* Paragraph Display */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-200 min-h-[200px]">
        {renderParagraph()}
      </div>

      {/* Input Area */}
      {!isStarted ? (
        <div className="text-center">
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-lg shadow-lg"
          >
            <Play className="w-6 h-6" />
            Start Typing
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Click the button or start typing to begin
          </p>
        </div>
      ) : (
        <>
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            placeholder="Start typing here..."
            className={`w-full p-4 border-2 rounded-lg font-mono text-lg focus:outline-none transition-all bg-white dark:bg-dark-100 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
              isFinished 
                ? 'bg-gray-100 dark:bg-dark-200 border-gray-300 dark:border-dark-400 cursor-not-allowed' 
                : 'border-primary-400 dark:border-primary-600 focus:border-primary-600 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900'
            }`}
            rows={6}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round((userInput.length / paragraph.text.length) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((userInput.length / paragraph.text.length) * 100, 100)}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Results */}
      {isFinished && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800 animate-bounce-in">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Great Job!</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Words Per Minute</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{calculateWPM()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{calculateAccuracy()}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Taken</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(timer)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{errors}</p>
            </div>
          </div>

          {calculateWPM() === stats.highScore && stats.highScore > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-3 mb-4 text-center">
              <p className="text-yellow-800 dark:text-yellow-300 font-bold flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                New High Score!
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={loadNewParagraph}
              className="btn-primary"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Try Another
            </button>
            <button
              onClick={resetGame}
              className="btn-secondary"
            >
              Retry This
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      {!isStarted && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400 dark:border-blue-600">
          <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">💡 Tips for Better Speed:</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Keep your fingers on the home row</li>
            <li>• Look at the screen, not your keyboard</li>
            <li>• Focus on accuracy first, speed will follow</li>
            <li>• Take breaks to avoid fatigue</li>
          </ul>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}