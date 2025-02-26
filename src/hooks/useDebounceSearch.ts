// hooks/useDebounceSearch.ts
import { useState, useEffect } from 'react';

interface UseDebounceSearchOptions {
  delay?: number;
  minChars?: number;
}

export function useDebounceSearch(options: UseDebounceSearchOptions = {}) {
  const { delay = 300, minChars = 3 } = options;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    
    const timer = setTimeout(() => {
      if (searchTerm.length >= minChars) {
        setDebouncedValue(searchTerm);
      } else if (searchTerm.length === 0) {
        setDebouncedValue("");
      }
      setIsTyping(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, delay, minChars]);

  return {
    searchTerm,
    debouncedValue,
    setSearchTerm,
    isTyping,
  };
}