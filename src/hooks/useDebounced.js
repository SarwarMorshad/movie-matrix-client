import { useEffect, useState } from "react";

// The value, but only after it has stopped changing for `delay` ms (for search-as-you-type)
const useDebounced = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounced;
