import React, { useEffect, useState } from 'react';

export default function BannerAd() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the Adsterra banner script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://www.highperformanceformat.com/3f33d3ef8129f77c328322da632b5a22/invoke.js';
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    const adContainer = document.getElementById('adsterra-banner-container');
    if (adContainer && !adContainer.querySelector('script')) {
      adContainer.appendChild(script);
    }

    // Timeout fallback
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      if (adContainer && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <div 
        id="adsterra-banner-container"
        className="bg-gray-100 dark:bg-dark-200 rounded-lg overflow-hidden shadow-md transition-all"
        style={{ minHeight: '90px', maxWidth: '728px', width: '100%' }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-3 border-gray-300 border-t-primary-600 rounded-full"></div>
            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Loading ad...</span>
          </div>
        )}
      </div>
    </div>
  );
}