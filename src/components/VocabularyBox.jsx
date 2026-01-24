import React, { useState } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import VocabularyManager from '../utils/vocabularyManager';

export default function VocabularyBox({ level, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const allWords = VocabularyManager.getWordsByLevel(level);
  const discovered = VocabularyManager.getDiscovered(level);
  const discoveredWords = allWords.filter(w => discovered.includes(w.id));
  
  // Get unique categories
  const categories = ['all', ...new Set(discoveredWords.map(w => w.category))];
  
  // Filter words
  const filteredWords = discoveredWords.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          word.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || word.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const progress = allWords.length > 0 
    ? Math.round((discovered.length / allWords.length) * 100) 
    : 0;

  return (
    <div className="card-premium p-4 sm:p-8 animate-fade-in">
      <button onClick={onBack} className="mb-4 text-primary-600 dark:text-primary-400 hover:underline transition-colors font-medium">
        ← Back to Menu
      </button>
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gradient mb-4">My {level} Vocabulary</h2>
        
        {/* Progress Bar */}
        <div className="progress-bar mb-2">
          <div 
            className="progress-fill flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && (
              <span className="text-white text-xs font-bold">{progress}%</span>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-gray-100">{discovered.length}</strong> / <strong className="text-gray-900 dark:text-gray-100">{allWords.length}</strong> words discovered
        </p>
      </div>

      {discoveredWords.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No words discovered yet</p>
          <p className="text-sm">Start playing games to unlock vocabulary!</p>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-premium pl-10 pr-8 appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.key(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Word Count */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Showing {filteredWords.length} {filteredWords.length === 1 ? 'word' : 'words'}
          </p>

          {/* Word Cards */}
          {filteredWords.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No words match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWords.map((word, index) => (
                <div 
                  key={word.id} 
                  className="border-2 border-gray-200 dark:border-dark-300 bg-white dark:bg-dark-100 rounded-lg p-5 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">{word.word}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-400 rounded-full uppercase">
                      {word.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{word.definition}</p>
                  
                  {word.example && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3 border-l-4 border-primary-400 dark:border-primary-600">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{word.example}"</p>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-300">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Hint:</strong> {word.hint}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}