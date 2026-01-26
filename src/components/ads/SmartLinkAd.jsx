import { useEffect } from 'react';

let smartLinkLoaded = false;
let clickCount = 0;

export default function SmartLinkAd() {
  useEffect(() => {
    // Load SmartLink script once
    if (!smartLinkLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//pl24230375.profitablecpmrate.com/YOUR_SMARTLINK_KEY/invoke.js';
      
      document.body.appendChild(script);
      smartLinkLoaded = true;
    }
  }, []);

  return null;
}

// Function to trigger SmartLink after certain user actions
export function maybeShowSmartLink() {
  clickCount++;
  
  // Show SmartLink every 5 clicks (configurable)
  if (clickCount % 5 === 0) {
    console.log('SmartLink triggered after', clickCount, 'clicks');
    // SmartLink will redirect automatically if script is loaded
  }
  
  return clickCount;
}

// Reset click counter
export function resetSmartLinkCounter() {
  clickCount = 0;
}