import { useEffect, useState } from 'react';

// Returns the current time and re-renders every `ms` milliseconds.
export default function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id); // cleanup MUST be a function
  }, [ms]);

  return now;
}