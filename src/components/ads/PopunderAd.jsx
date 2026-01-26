import { useEffect } from 'react';

let popunderLoaded = false;

export default function PopunderAd() {
  useEffect(() => {
    // Only load the popunder script once per session
    if (!popunderLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl28572767.effectivegatecpm.com/5d/72/13/5d72138524ab66225169d55cb7dcbaa9.js';
      
      document.body.appendChild(script);
      popunderLoaded = true;

      return () => {
        // Don't remove on unmount - popunder should stay loaded
      };
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Function to trigger popunder on user interaction
export function triggerPopunder() {
  // The popunder will trigger automatically on click
  // No additional code needed if Adsterra script is loaded
  console.log('Popunder ready to trigger on click');
}