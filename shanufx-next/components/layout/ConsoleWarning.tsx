'use client';

import { useEffect, useRef } from 'react';

export default function ConsoleWarning() {
  const ipRef = useRef<string>('Unknown IP');

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const fetchIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        if (data && data.ip) {
          ipRef.current = data.ip;
        }
      } catch (err) {
        // Silently fail if IP cannot be fetched
      }
    };

    fetchIp();

    const logWarning = () => {
      // CSS styles for the console logs
      const shanuTechXStyle = `
        font-size: 50px;
        font-weight: 900;
        color: #8b5cf6;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
        font-family: 'Syne', sans-serif;
      `;

      const warningStyle = `
        font-size: 16px;
        font-weight: bold;
        color: #f59e0b;
        font-family: 'Inter', sans-serif;
      `;

      const ipStyle = `
        font-size: 16px;
        font-weight: bold;
        color: #06b6d4;
        font-family: 'Inter', sans-serif;
      `;

      // Draw a line before the warning to separate it visually
      console.log('%c───────────────────────────────────────────────────────', 'color: #333');
      
      console.log('%cSHANUTECHX', shanuTechXStyle);
      
      console.log('%c───────────────────────────────────────────────────────', 'color: #333');
      
      console.log(
        "%c⚠ If you are trying to sneak into this website, it's not possible.\nDesigned and developed by Shanudha Tirosh",
        warningStyle
      );
      
      if (ipRef.current !== 'Unknown IP') {
        console.log(`%c🌐 Is that your IP: ${ipRef.current} if you try agin i will ban you from website`, ipStyle);
      }
    };

    // Delay the first log slightly to ensure IP is fetched
    const initialTimer = setTimeout(logWarning, 2000);

    // Run every 30 seconds
    const interval = setInterval(logWarning, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return null;
}
