import { useStreamText } from "../hooks/useTextStream";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { useAWSModelInvoke } from "../hooks/useAwsModelInvoke";
import { testBody } from "../types/prompt-formats/questions";
import Markdown from "react-markdown";

type Props = {
  answerStream: string;
};

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
    secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
  },
});

export const AnswerStream = ({ answerStream }: Props) => {
  const { output } = useStreamText(" " + answerStream, 10);
  const { invokeModel } = useAWSModelInvoke({
    modelId: "amazon.nova-pro-v1:0",
    bedrockClient: bedrockClient,
    requestBody: JSON.stringify(testBody),
  });

  const sendQuestionsToMockInterview = async (text: string) => {
    console.log("Sending questions to mock interview");
    // use Agent to Generate JSON
    const result = await invokeModel(`Turn these questions into JSON: ${text}`);
    if (result) {
      console.log("Result: ", result);
      // add to DB
    }
  };

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
          <button
            onClick={() => sendQuestionsToMockInterview(output)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Answer these questions.
          </button>
        </div>
      </div>
    </div>
  );
};
