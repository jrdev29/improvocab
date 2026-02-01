import { useEffect } from 'react';

let smartLinkLoaded = false;
let clickCount = 7;

export default function SmartLinkAd() {
  useEffect(() => {
    // Load SmartLink script once
    if (!smartLinkLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://www.effectivegatecpm.com/ffzn7nw3z?key=91be7b1469a515bd241edf4079c3875d';
      
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