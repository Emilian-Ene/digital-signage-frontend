import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    
    // Support for both newer and older browsers
    try {
        media.addEventListener('change', listener);
    } catch (e) {
        media.addListener(listener);
    }

    return () => {
        try {
            media.removeEventListener('change', listener);
        } catch (e) {
            media.removeListener(listener);
        }
    };
  }, [query]);

  return matches;
};