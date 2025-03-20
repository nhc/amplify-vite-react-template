/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";
import { useUI } from "../../context/hooks/useUIHook";
import { useAgentInvoke } from "../../hooks/useAgentInvoke";
import { v4 as uuidv4 } from "uuid";

const bedrockClient = new BedrockAgentRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
    secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
  },
});

export const ResponseFormTyped = () => {
  const { state, dispatch } = useUI();

  const { invokeAgent: invokeStep2 } = useAgentInvoke({
    agentId: "X3NLVYV0HD",
    agentAliasId: "YVQEXLO6XE",
    sessionId: uuidv4(),
    bedrockClient,
  });

  async function getFeedback() {
    const str = `${state.data.cvJobDescStr}. This is the interview question ${state.data.activeQuestionText}, and this is the model answer ${state.data.modelAnswer}. The candidate's answer is: ${state.data.candidateAnswer}`;

    const result = await invokeStep2(str);
    if (result) {
      dispatch({
        type: "SET_ANALYSIS_RESULT",
        payload: { data: { analysisResult: result } },
      });
    }
  }

  return (
    <div className="text-gray-900 dark:text-white mb-10">
      <div className="flex items-center mb-4"></div>
      <textarea
        onFocus={() => {
          dispatch({
            type: "SET_FOCUS_ON_RESPONSE",
            payload: { focusOnResponse: true },
          });
        }}
        onBlur={() => {
          dispatch({
            type: "SET_FOCUS_ON_RESPONSE",
            payload: { focusOnResponse: false },
          });
        }}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          dispatch({
            type: "SET_CANDIDATE_ANSWER",
            payload: { data: { candidateAnswer: event.target.value } },
          });
        }}
        className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        placeholder="Type your response here"
      ></textarea>
      <button
        onClick={() => {
          getFeedback();
        }}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 float-right mt-2"
      >
        Get Feedback
      </button>
    </div>
  );
};
