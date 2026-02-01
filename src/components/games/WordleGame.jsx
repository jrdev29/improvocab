import React, { useState, useEffect } from 'react';
import VocabularyManager from '../../utils/vocabularyManager';
import BannerAd from '../ads/BannerAd';
export default function WordleGame({ level, onBack, onWordDiscovered }) {
  const MAX_ATTEMPTS = 6;
  const [currentWord, setCurrentWord] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadNewWord();
  }, [level]);

  useEffect(() => {
    // Keyboard event listener
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') return;
      
      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < (currentWord?.word.length || 0)) {
        setCurrentGuess(prev => prev + e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, currentWord]);

  const loadNewWord = () => {
    const word = VocabularyManager.getRandomWord(level);
    if (word) {
      setCurrentWord(word);
      setGuesses([]);
      setCurrentGuess('');
      setGameStatus('playing');
      setShowHint(false);
    }
  };

  const submitGuess = () => {
    if (!currentWord) return;
    
    if (currentGuess.length !== currentWord.word.length) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === currentWord.word) {
      setGameStatus('won');
      setScore(score + 1);
      VocabularyManager.markDiscovered(currentWord.id, level);
      
      // Update game stats
      const stats = VocabularyManager.getGameStats('wordGuess');
      VocabularyManager.updateGameStats('wordGuess', {
        correctAnswers: (stats.correctAnswers || 0) + 1,
        totalGuesses: (stats.totalGuesses || 0) + newGuesses.length,
        gamesPlayed: (stats.gamesPlayed || 0) + 1
      });
      
      onWordDiscovered();
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      
      // Update game stats for loss
      const stats = VocabularyManager.getGameStats('wordGuess');
      VocabularyManager.updateGameStats('wordGuess', {
        totalGuesses: (stats.totalGuesses || 0) + newGuesses.length,
        gamesPlayed: (stats.gamesPlayed || 0) + 1
      });
    }
  };

  const getLetterStatus = (letter, index, guess) => {
    if (!currentWord) return 'empty';
    
    const targetWord = currentWord.word;
    if (targetWord[index] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  const renderRow = (guess, rowIndex) => {
    if (!currentWord) return null;
    
    const isCurrentRow = rowIndex === guesses.length && gameStatus === 'playing';
    const isPreviousRow = rowIndex === guesses.length - 1 && guess;
    const letters = guess ? guess.split('') : [];
    const wordLength = currentWord.word.length;

    return (
      <div key={rowIndex} className={`flex gap-2 justify-center ${shake && isCurrentRow ? 'animate-shake' : ''}`}>
        {Array.from({ length: wordLength }).map((_, i) => {
          const letter = letters[i] || (isCurrentRow ? currentGuess[i] : '');
          const status = guess ? getLetterStatus(letters[i], i, guess) : 'empty';
          
          return (
            <div
            key={i}
            style={{
              animation: isPreviousRow ? `flip 0.5s ease ${i * 0.1}s` : 'none',
              animationFillMode: 'both'
            }}
            className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all ${
              isCurrentRow && letter ? 'scale-110' : ''
            } ${
              status === 'correct' ? 'bg-green-500 border-green-600 text-white shadow-lg' :
              status === 'present' ? 'bg-yellow-500 border-yellow-600 text-white shadow-lg' :
              status === 'absent' ? 'bg-gray-500 dark:bg-gray-600 border-gray-600 dark:border-gray-700 text-white' :
              letter ? 'border-gray-400 dark:border-gray-500 bg-white dark:bg-dark-100 text-gray-900 dark:text-gray-100 animate-pulse' : 
              'border-gray-300 dark:border-dark-300 bg-white dark:bg-dark-100'
            }`}
            >
              
              {letter}
              
            </div>
          );
          
        })}
      </div>
    );
  };
  <BannerAd />

  const renderKeyboard = () => {
    const rows = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']
    ];

    const getKeyStatus = (key) => {
      if (key === 'ENTER' || key === '⌫') return 'special';
      
      for (const guess of guesses) {
        const letters = guess.split('');
        for (let i = 0; i < letters.length; i++) {
          if (letters[i] === key) {
            if (currentWord.word[i] === key) return 'correct';
            if (currentWord.word.includes(key)) return 'present';
            return 'absent';
          }
        }
      }
      return 'unused';
    };

    return (
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map(key => {
              const status = getKeyStatus(key);
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'ENTER') submitGuess();
                    else if (key === '⌫') setCurrentGuess(prev => prev.slice(0, -1));
                    else if (currentGuess.length < currentWord.word.length) setCurrentGuess(prev => prev + key);
                  }}
                  className={`px-3 py-4 rounded-lg font-bold uppercase text-sm transition-all transform hover:scale-105 active:scale-95 shadow-sm ${
                    key === 'ENTER' || key === '⌫' ? 'px-4' : ''
                  } ${
                    status === 'correct' ? 'bg-green-500 hover:bg-green-600 text-white shadow-md' :
                    status === 'present' ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md' :
                    status === 'absent' ? 'bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white' :
                    status === 'special' ? 'bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-800 text-white' :
                    'bg-gray-300 dark:bg-dark-200 hover:bg-gray-400 dark:hover:bg-dark-300 text-gray-800 dark:text-gray-100'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  if (!currentWord) {
    return (
      <div className="card-premium p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="card-premium p-4 sm:p-8 max-w-2xl mx-auto animate-fade-in">
      <button onClick={onBack} className="mb-4 text-primary-600 dark:text-primary-400 hover:underline transition-colors font-medium">
        ← Back to Menu
      </button>
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gradient mb-2">Word Guess</h2>
        <div className="flex justify-center gap-6 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Score: <strong className="text-gray-900 dark:text-gray-100">{score}</strong></span>
          <span className="text-primary-600 dark:text-primary-400">Level: <strong>{level}</strong></span>
          <span className="text-gray-600 dark:text-gray-400">Word Length: <strong className="text-gray-900 dark:text-gray-100">{currentWord.word.length}</strong></span>
        </div>
      </div>

      {/* Hint Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4 mb-6 border border-primary-200 dark:border-primary-800">
        <div className="text-sm">
          <span className="font-semibold text-primary-700 dark:text-primary-300">Definition:</span>
          <span className="text-gray-800 dark:text-gray-200 ml-2">{currentWord.definition}</span>
        </div>
        <div className="text-sm mt-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-semibold transition-colors"
          >
            {showHint ? '🔼 Hide Hint' : '🔽 Show Hint'}
          </button>
          {showHint && (
            <div className="mt-2 text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Hint:</span> {currentWord.hint}
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-6 space-y-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => 
          renderRow(guesses[i], i)
        )}
      </div>

      <style>{`
        @keyframes flip {
          0% { transform: rotateX(0); }
          50% { transform: rotateX(-90deg); }
          100% { transform: rotateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Game Status Messages */}
      {gameStatus === 'won' && (
        <div className="text-center mb-4 animate-bounce-in">
          <div className="text-5xl mb-2">🎉</div>
          <div className="text-2xl font-bold text-green-600 mb-2">Correct!</div>
          <p className="text-gray-700 mb-4">You guessed "{currentWord.word}" in {guesses.length} attempts!</p>
          <button
            onClick={loadNewWord}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 transform"
          >
            Next Word
          </button>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">😔</div>
          <div className="text-2xl font-bold text-red-600 mb-2">Game Over</div>
          <p className="text-gray-700 mb-2">The word was: <strong className="text-indigo-600 text-xl">{currentWord.word}</strong></p>
          <p className="text-gray-600 mb-4">{currentWord.definition}</p>
          <button
            onClick={loadNewWord}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 transform"
          >
            Try Another Word
          </button>
        </div>
      )}

      {/* Keyboard */}
      {gameStatus === 'playing' && (
        <div className="mt-6">
          {renderKeyboard()}
        </div>
      )}
    </div>
  );
}