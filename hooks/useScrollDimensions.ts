/**
 * Get how much has a user scroll in the webpage
 * @returns string
 */
import { useState, useEffect } from 'react';

interface IDimension {
  scrollX: number;
  scrollY: number;
}

const getScrollDimensions = (window: Window) => {
  const { scrollX, scrollY } = window;
  return {
    scrollX,
    scrollY,
  };
};

const useScrollDimensions = () => {
  const [scrollDimensions, setScrollDimensions] = useState<IDimension>({
    scrollX: 0,
    scrollY: 0,
  });

  useEffect(() => {
    setScrollDimensions(getScrollDimensions(window));
    function handleResize() {
      setScrollDimensions(getScrollDimensions(window));
    }

    window.addEventListener('scroll', handleResize);
    return () => window.removeEventListener('scroll', handleResize);
  }, []);

  return { scrollDimensions };
};

export default useScrollDimensions;
