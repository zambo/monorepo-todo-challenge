"use client";

import { useState, useEffect } from "react";

export interface MobileDetectionOptions {
  breakpoint?: number;
}

export function useMobileDetection(options: MobileDetectionOptions = {}) {
  const { breakpoint = 768 } = options;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}
