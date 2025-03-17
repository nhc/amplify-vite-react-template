import { useRef, useCallback } from "react";

interface UseSentenceProcessorReturn {
  processText: (text: string) => string[];
  flush: () => string[];
  reset: () => void;
}

export function useSentenceProcessor(): UseSentenceProcessorReturn {
  // Use refs to maintain state between renders without causing re-renders
  const bufferRef = useRef<string>("");

  // Store the regex pattern as a constant outside the hook to avoid recreation
  const SENTENCE_END_PATTERN = /[.!?]\s+/;

  // Process text to extract complete sentences
  const processText = useCallback((text: string): string[] => {
    // Add to our buffer
    bufferRef.current += text;

    // Find sentence endings
    const sentences = bufferRef.current.split(SENTENCE_END_PATTERN);

    // If we found sentence endings
    if (sentences.length > 1) {
      // All but the last one are complete sentences
      const completeSentences = sentences
        .slice(0, -1)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);

      // Keep the last part in the buffer (it's incomplete)
      bufferRef.current = sentences[sentences.length - 1];

      return completeSentences;
    }

    return [];
  }, []);

  // Flush the buffer and return any remaining content as a sentence
  const flush = useCallback((): string[] => {
    const trimmedBuffer = bufferRef.current.trim();

    if (trimmedBuffer) {
      bufferRef.current = "";
      return [trimmedBuffer];
    }

    return [];
  }, []);

  // Add a reset function to clear the buffer
  const reset = useCallback((): void => {
    bufferRef.current = "";
  }, []);

  return { processText, flush, reset };
}
