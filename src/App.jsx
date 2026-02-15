import React, { useState } from 'react';
import { BookOpen, Trophy, Target, Sparkles, Home, Award, Zap, Grid3x3, Type, Star, Moon, Sun, Download, RotateCcw } from 'lucide-react';
import VocabularyManager from './utils/vocabularyManager';
import vocabularyData from './data/vocabulary.json';
import { useTheme } from './contexts/ThemeContext';

// Import game components
import WordleGame from './components/games/WordleGame';
import TypingSpeed from './components/games/TypingSpeed';
import VocabularyBox from './components/VocabularyBox';

export default function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [progress, setProgress] = useState(VocabularyManager.getProgress());
  const { isDark, toggleTheme } = useTheme();
  
  const refreshProgress = () => {
    setProgress(VocabularyManager.getProgress());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-dark-50 dark:via-dark-100 dark:to-dark-200 p-3 sm:p-4 md:p-6 transition-all duration-300">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="card-premium p-4 sm:p-6 mb-4 sm:mb-6 animate-fade-in-down">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg animate-float">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient">
                  Word Learning Games
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Master vocabulary through interactive games
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-3 rounded-lg bg-gray-200 dark:bg-dark-200 hover:bg-gray-300 dark:hover:bg-dark-300 transition-all transform hover:scale-110 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
              </button>

              {currentView !== 'menu' && (
                <button
                  onClick={() => setCurrentView('menu')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md font-semibold text-sm sm:text-base"
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Menu</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Level Selector */}
          <div className="mt-4 sm:mt-6 flex gap-2 flex-wrap">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => {
              const totalWords = vocabularyData[level]?.length || 0;
              const discovered = progress.discoveredWords[level]?.length || 0;
              const percentage = totalWords > 0 ? Math.round((discovered / totalWords) * 100) : 0;
              
              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`relative px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base ${
                    selectedLevel === level
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-premium scale-105'
                      : 'bg-white dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:shadow-lg border border-gray-200 dark:border-dark-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{level}</span>
                    <div className="flex items-center gap-1 text-xs opacity-90">
                      <span>{discovered}/{totalWords}</span>
                    </div>
                  </div>
                  {/* Progress ring */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full px-2">
                    <div className="h-1 bg-gray-200 dark:bg-dark-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent-500 to-primary-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-4 sm:mt-6 glass p-4 sm:p-6 rounded-xl border-2 border-primary-200 dark:border-primary-900">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Progress</p>
                <p className="text-xl sm:text-3xl font-bold text-gradient">
                  {VocabularyManager.getTotalDiscovered()} / {VocabularyManager.getTotalWords()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">words discovered</p>
              </div>
              
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Progress</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.round((VocabularyManager.getTotalDiscovered() / VocabularyManager.getTotalWords()) * 100)}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {Math.round((VocabularyManager.getTotalDiscovered() / VocabularyManager.getTotalWords()) * 100)}% Complete
                </p>
              </div>

              <div className="flex gap-2 justify-center sm:justify-end items-center">
                <button
                  onClick={() => VocabularyManager.exportProgress()}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-dark-100 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200 transition-all border border-gray-200 dark:border-dark-300 text-xs sm:text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={() => VocabularyManager.resetProgress() && refreshProgress()}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all text-xs sm:text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="animate-fade-in-up">
          {currentView === 'menu' && (
            <>
              <GameMenu onSelectGame={(game) => setCurrentView(game)} />
            </>
          )}
          
          {currentView === 'wordGuess' && (
            <WordleGame 
              level={selectedLevel} 
              onBack={() => setCurrentView('menu')}
              onWordDiscovered={refreshProgress}
            />
          )}
          
          {currentView === 'typingSpeed' && (
            <TypingSpeed 
              level={selectedLevel} 
              onBack={() => setCurrentView('menu')}
              onWordDiscovered={refreshProgress}
            />
          )}
          
          {currentView === 'vocabulary' && (
            <VocabularyBox 
              level={selectedLevel}
              onBack={() => setCurrentView('menu')}
            />
          )}

          {/* Coming Soon Games */}
          {['wordSearch', 'wordPuzzle', 'spellingBee', 'anagram'].includes(currentView) && (
            <div className="card-premium p-8 sm:p-12 text-center animate-bounce-in">
              <div className="text-6xl sm:text-8xl mb-4 animate-float">🚧</div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gradient mb-4">Coming Soon!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
                This game is under development and will be available soon.
              </p>
              <button
                onClick={() => setCurrentView('menu')}
                className="btn-primary"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Game Menu Component
function GameMenu({ onSelectGame }) {
  const handleGameClick = (gameId, isActive) => {
    if (!isActive) return;
    
    // Trigger the game navigation
    onSelectGame(gameId);
  };

  const games = [
    { 
      id: 'wordGuess', 
      name: 'Word Guess', 
      icon: Target, 
      gradient: 'from-emerald-500 to-green-600',
      description: 'Wordle-style word guessing', 
      status: 'active' 
    },
    { 
      id: 'typingSpeed', 
      name: 'Typing Speed', 
      icon: Zap, 
      gradient: 'from-blue-500 to-cyan-600',
      description: 'Test your typing skills', 
      status: 'active' 
    },
    { 
      id: 'wordSearch', 
      name: 'Word Search', 
      icon: Grid3x3, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Find hidden words', 
      status: 'coming' 
    },
    { 
      id: 'wordPuzzle', 
      name: 'Crossword', 
      icon: Type, 
      gradient: 'from-orange-500 to-red-600',
      description: 'Solve word puzzles', 
      status: 'coming' 
    },
    { 
      id: 'spellingBee', 
      name: 'Spelling Bee', 
      icon: Star, 
      gradient: 'from-yellow-500 to-amber-600',
      description: 'Spell words correctly', 
      status: 'coming' 
    },
    { 
      id: 'anagram', 
      name: 'Anagram', 
      icon: Sparkles, 
      gradient: 'from-pink-500 to-rose-600',
      description: 'Unscramble letters', 
      status: 'coming' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* My Vocabulary Button - Now First */}
      <button
        onClick={() => handleGameClick('vocabulary', true)}
        className="p-6 sm:p-8 rounded-2xl shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white hover:shadow-2xl hover:scale-105 transition-all card-premium border-none animate-fade-in-up group"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6">
          <Award className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2">My Vocabulary</h3>
        <p className="text-xs sm:text-sm opacity-90 mb-3">View your discovered words</p>
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-white/20 rounded-full">
          📚 View Collection
        </span>
      </button>

      {/* Game Cards */}
      {games.map((game, index) => {
        const Icon = game.icon;
        return (
          <button
            key={game.id}
            onClick={() => handleGameClick(game.id, game.status === 'active')}
            disabled={game.status === 'coming'}
            className={`relative p-6 sm:p-8 rounded-2xl shadow-lg transition-all animate-fade-in-up group ${
              game.status === 'active' 
                ? 'card-premium hover:shadow-2xl hover:scale-105 cursor-pointer' 
                : 'bg-gray-100 dark:bg-dark-200 opacity-60 cursor-not-allowed'
            }`}
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${game.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6`}>
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {game.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
              {game.description}
            </p>
            {game.status === 'coming' && (
              <span className="badge-premium">
                Coming Soon
              </span>
            )}
            {game.status === 'active' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-accent-100 to-emerald-100 dark:from-accent-900 dark:to-emerald-900 text-accent-700 dark:text-accent-300 rounded-full">
                ▶ Play Now
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}