import { useEffect } from "react";
import Markdown from "react-markdown";
// import { Link } from "react-router";
import { useStreamText } from "../hooks/useTextStream";

type Props = {
  answerStream: string;
};

export const AnswerStream = ({ answerStream }: Props) => {
  const { output, isComplete } = useStreamText(" " + answerStream, 10);

  useEffect(() => {
    if (isComplete) console.log("streaming complete");
  }, [isComplete]);

  return (
    <div className="w-full max-w-7xl mx-auto p-1 mt-8">
      <div className="bg-white inset-shadow-sm rounded-lg shadow-lg p-6 relative min-h-[300px]">
        <div
          className="bg-gray-50 rounded-md p-4 mb-16 min-h-[200px] font-mono text-sm answer-stream"
          style={{ color: "black" }}
        >
          <Markdown>{output}</Markdown>
        </div>

        {/* Button container */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          {/* <Link
            to={"/mock-interview"}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Answer in Mock Interview
          </Link> */}
        </div>
      </div>
    </div>
  );
};
