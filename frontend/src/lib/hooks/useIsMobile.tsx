import { useState, useEffect } from "react";

const useIsMobile = (): boolean | null => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    const handleInitialMediaQuery = (mediaQuery: MediaQueryList) => {
      handleMediaQueryChange({
        matches: mediaQuery.matches,
      } as MediaQueryListEvent);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleInitialMediaQuery(mediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
