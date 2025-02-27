import { useState, useEffect } from "react";

export const useStreamText = (text: string, speed = 50) => {
  const [output, setOutput] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    console.log("streaming text", text);
    let index = 0;
    setOutput("");
    setIsComplete(false);

    const streamText = setInterval(() => {
      if (index < text.length) {
        setOutput((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(streamText);
      }
    }, speed);

    return () => clearInterval(streamText);
  }, [text, speed]);

  return { output, isComplete };
};
