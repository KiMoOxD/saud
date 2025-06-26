// /hooks/useIsMobile.js
import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the user is on a mobile-sized screen.
 * @param {number} breakpoint - The width in pixels to consider the mobile breakpoint. Defaults to 768px.
 * @returns {boolean} - True if the screen width is less than the breakpoint.
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    // This function runs only on the client side after hydration
    const checkDevice = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount and add resize listener
    checkDevice();
    window.addEventListener("resize", checkDevice);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, [breakpoint]);

  return isMobile;
};