import vocabularyData from '../data/vocabulary.json';
import wordsData from '../data/words.json';
import paragraphsData from '../data/paragraphs.json';

// Storage key for localStorage
const STORAGE_KEY = 'wordGameProgress';

// Initialize default progress structure
const getDefaultProgress = () => ({
  discoveredWords: {
    A1: [],
    A2: [],
    B1: [],
    B2: [],
    C1: [],
    C2: []
  },
  gameStats: {
    typingSpeed: { highScore: 0, gamesPlayed: 0, totalWPM: 0 },
    wordGuess: { correctAnswers: 0, totalGuesses: 0, gamesPlayed: 0 },
    wordSearch: { gamesWon: 0, totalTime: 0 },
    wordPuzzle: { solved: 0, attempts: 0 },
    spellingBee: { correctWords: 0, totalWords: 0 },
    anagram: { solved: 0, attempts: 0 }
  },
  achievements: [],
  lastPlayed: null
});

// Vocabulary Manager Object
export const VocabularyManager = {
  
  // Get current progress from localStorage
  getProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default to handle new fields
        return { ...getDefaultProgress(), ...parsed };
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return getDefaultProgress();
  },
  
  // Save progress to localStorage
  saveProgress(progress) {
    try {
      progress.lastPlayed = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  },
  
  // Mark a word as discovered
  markDiscovered(wordId, level) {
    const progress = this.getProgress();
    if (!progress.discoveredWords[level]) {
      progress.discoveredWords[level] = [];
    }
    if (!progress.discoveredWords[level].includes(wordId)) {
      progress.discoveredWords[level].push(wordId);
      this.saveProgress(progress);
      return true;
    }
    return false;
  },
  
  // Get all discovered words for a level
  getDiscovered(level) {
    const progress = this.getProgress();
    return progress.discoveredWords[level] || [];
  },
  
  // Get all words for a specific level
  getWordsByLevel(level) {
    return wordsData[level] || [];
  },
  
  // Get a random word from a level
  getRandomWord(level, excludeIds = []) {
    const words = this.getWordsByLevel(level);
    const available = words.filter(w => !excludeIds.includes(w.id));
    
    if (available.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  },
  
  // Get multiple random words
  getRandomWords(level, count, excludeIds = []) {
    const words = this.getWordsByLevel(level);
    const available = words.filter(w => !excludeIds.includes(w.id));
    
    // Shuffle and take first 'count' items
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },
  
  // Get word by ID
  getWordById(wordId) {
    for (const level in wordsData) {
      const word = wordsData[level].find(w => w.id === wordId);
      if (word) return { ...word, level };
    }
    return null;
  },
  
  // Get all paragraphs for a level
  getParagraphsByLevel(level) {
    return paragraphsData[level] || [];
  },
  
  // Get random paragraph
  getRandomParagraph(level) {
    const paragraphs = this.getParagraphsByLevel(level);
    if (paragraphs.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[randomIndex];
  },
  
  // Update game statistics
  updateGameStats(gameName, stats) {
    const progress = this.getProgress();
    if (!progress.gameStats[gameName]) {
      progress.gameStats[gameName] = {};
    }
    
    progress.gameStats[gameName] = {
      ...progress.gameStats[gameName],
      ...stats
    };
    
    this.saveProgress(progress);
  },
  
  // Get statistics for a specific game
  getGameStats(gameName) {
    const progress = this.getProgress();
    return progress.gameStats[gameName] || {};
  },
  
  // Get total discovered words across all levels
  getTotalDiscovered() {
    const progress = this.getProgress();
    let total = 0;
    for (const level in progress.discoveredWords) {
      total += progress.discoveredWords[level].length;
    }
    return total;
  },
  
  // Get total available words across all levels
  getTotalWords() {
    let total = 0;
    for (const level in wordsData) {
      total += wordsData[level].length;
    }
    return total;
  },
  
  // Calculate completion percentage for a level
  getLevelProgress(level) {
    const totalWords = this.getWordsByLevel(level).length;
    const discovered = this.getDiscovered(level).length;
    return totalWords > 0 ? Math.round((discovered / totalWords) * 100) : 0;
  },
  
  // Reset all progress (useful for testing or user request)
  resetProgress() {
    const confirmed = window.confirm(
      'Are you sure you want to reset all progress? This cannot be undone.'
    );
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    }
    return false;
  },
  
  // Export progress as JSON (for backup)
  exportProgress() {
    const progress = this.getProgress();
    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `word-game-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },
  
  // Import progress from JSON file
  importProgress(jsonData) {
    try {
      const progress = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      this.saveProgress(progress);
      return true;
    } catch (error) {
      console.error('Error importing progress:', error);
      return false;
    }
  }
};

export default VocabularyManager;