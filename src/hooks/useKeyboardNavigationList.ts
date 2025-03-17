import { useEffect } from "react";

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (
  activeIndex: number,
  maxIndex: number,
  setActiveIndex: (index: number | ((prev: number) => number)) => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev: number) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev: number) => (prev < maxIndex ? prev + 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, maxIndex, setActiveIndex]);
};
