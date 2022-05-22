/**
 * Get what is the size of the webpage - to be used when scss media query cant be used
 * @returns string
 */
import { useState, useEffect } from 'react';

interface IDimension {
  width: number;
  height: number;
}

const getWindowDimensions = (window: Window) => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowDimensions = () => {
  const LARGE_SCREEN_SIZE = 1024;

  const [windowDimensions, setWindowDimensions] = useState<IDimension>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setWindowDimensions(getWindowDimensions(window));
    function handleResize() {
      setWindowDimensions(getWindowDimensions(window));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { windowDimensions, LARGE_SCREEN_SIZE };
};

export default useWindowDimensions;
