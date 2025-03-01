import { useState, useEffect } from "react";

/**
 * Custom hook to strip markdown from text
 * @param {string} markdownText - The markdown text to be stripped
 * @returns {string} Plain text with markdown removed
 */
const useMarkdownStripper = (markdownText: string) => {
  const [plainText, setPlainText] = useState("");

  useEffect(() => {
    if (!markdownText) {
      setPlainText("");
      return;
    }

    // Function to strip markdown
    const stripMarkdown = (text: string) => {
      // Replace headers
      let result = text.replace(/#{1,6}\s+/g, "");

      // Replace bold and italic
      result = result.replace(/(\*\*|__)(.*?)\1/g, "$2"); // Bold
      result = result.replace(/(\*|_)(.*?)\1/g, "$2"); // Italic

      // Replace links
      result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

      // Replace images
      result = result.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, "$1");

      // Replace code blocks
      result = result.replace(/```[\s\S]*?```/g, "");
      result = result.replace(/`([^`]+)`/g, "$1");

      // Replace blockquotes
      result = result.replace(/^\s*>\s+/gm, "");

      // Replace horizontal rules
      result = result.replace(/^\s*[-*_]{3,}\s*$/gm, "");

      // Replace ordered and unordered lists
      result = result.replace(/^\s*[-+*]\s+/gm, "");
      result = result.replace(/^\s*\d+\.\s+/gm, "");

      // Replace HTML tags
      result = result.replace(/<[^>]*>/g, "");

      // Replace all newlines with spaces
      result = result.replace(/\n+/g, " ");
      // Replace multiple spaces with a single space
      result = result.replace(/\s+/g, " ");

      result = result.trim();

      return result;
    };

    setPlainText(stripMarkdown(markdownText));
  }, [markdownText]);

  return plainText;
};

export default useMarkdownStripper;
