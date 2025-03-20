/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";
import { useAgentInvoke } from "../../hooks/useAgentInvoke";
import { v4 as uuidv4 } from "uuid";
import { useGetCvJob } from "../../hooks/useGetCvJob";
import { extractValues } from "../../utils/functions";
import Markdown from "react-markdown";
import { useUI } from "../../context/hooks/useUIHook";
import { ResponseFormTyped } from "./response-form-type";
import { ResponseFormAudio } from "./response-form-audio";

const bedrockClient = new BedrockAgentRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
    secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
  },
});

export const CandidateResponseBlock = () => {
  const [responseTypeComponent, setResponseTypeComponent] =
    useState<string>("typed");
  const { state, dispatch } = useUI();

  const { invokeAgent: invokeStep1 } = useAgentInvoke({
    agentId: "J19DVUUHWZ",
    agentAliasId: "KQGEWPHQX1",
    sessionId: uuidv4(),
    bedrockClient,
  });

  const { invokeAgent: invokeStep2 } = useAgentInvoke({
    agentId: "X3NLVYV0HD",
    agentAliasId: "YVQEXLO6XE",
    sessionId: uuidv4(),
    bedrockClient,
  });

  //console.log("activeQuestionText", activeQuestionText);
  // const [activeQuestion, setActiveQuestion] =
  //   useState<string>(activeQuestionText);

  const [cvStr, setCvStr] = useState<string | null>(null);
  const [modelAnswer, setmodelAnswer] = useState<string | undefined>(undefined);
  // candidateAnswer
  const [candidateAnswer, setCandidateAnswer] = useState<string | undefined>(
    undefined
  );

  const [analysis, setAnalysis] = useState<string | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const { cvContent, jobDescription } = useGetCvJob();

  const generateModelAnswer = useCallback(async () => {
    const result = await invokeStep1(
      `${cvStr}. This is the interview question ${state.data.activeQuestionText}`
    );
    if (result) {
      return result;
    }
  }, [state.data.activeQuestionText, cvStr, invokeStep1]);

  useEffect(() => {
    if (candidateAnswer) {
      getFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateAnswer]);

  // useEffect(() => {
  //   if (!state.isAnswerVisible) {
  //     setmodelAnswer(undefined);
  //     setShowFeedback(false);
  //   }
  // }, [state.isAnswerVisible]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const copyContentToState = () => {
  //   if (transcriptionRef.current) {
  //     // Get the text content from the div
  //     const content =
  //       transcriptionRef.current.textContent || "No candidate answer provided";
  //     setCandidateAnswer(content);
  //     //setTranscription(content);
  //     generateModelAnswer().then((modelAnswer) => {
  //       setmodelAnswer(modelAnswer);
  //     });
  //   }
  // };

  // const startStopRecording = () => {
  //   setIsRecording(!isRecording);
  //   if (isRecording) {
  //     // state is behind
  //     console.log("clicked to end recording", isRecording);
  //     if (transcriptionRef.current) {
  //       // Get the text content from the div
  //       const transcription =
  //         transcriptionRef.current.textContent ||
  //         "No candidate answer provided";
  //       setCandidateAnswer(transcription);
  //     }
  //   }
  // };

  // const populateWithExample = (isExampleVisible: boolean) => {
  //   if (isExampleVisible) {
  //     // console.log("hide example clicked");
  //     setmodelAnswer(undefined);
  //     dispatch({
  //       type: "SET_ANSWER",
  //       payload: { isActive: false },
  //     });
  //   } else {
  //     // console.log("show example clicked");
  //     dispatch({
  //       type: "SET_LOADING",
  //       payload: { isLoading: true },
  //     });
  //     generateModelAnswer().then(async (modelAnswer) => {
  //       setmodelAnswer(modelAnswer);
  //       dispatch({
  //         type: "SET_ANSWER",
  //         payload: { isActive: true },
  //       });
  //       dispatch({
  //         type: "SET_LOADING",
  //         payload: { isLoading: false },
  //       });
  //     });
  //   }
  // };

  async function getFeedback() {
    const result = await invokeStep2(
      `${cvStr}. This is the interview question ${state.data.activeQuestionText}, and this is the model answer ${modelAnswer}. The candidate's answer is: ${candidateAnswer}`
    );
    if (result) {
      setAnalysis(result);
      setShowFeedback(true);
      // add to DB
    }
  }

  useEffect(() => {
    if (cvContent && jobDescription) {
      const parsed = extractValues(cvContent);
      const output =
        `This is the candidates CV: ${parsed} \n\n This is the job the candidate is going for ${jobDescription}` as string;
      dispatch({
        type: "SET_CV_DESC",
        payload: { data: { cvJobDescStr: output } },
      });
    }
  }, [cvContent, dispatch, jobDescription]);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Your Response
        </h3>
        <div className="flex">
          <button
            className={`px-6 py-1 text-lg font-medium ${
              responseTypeComponent === "audio"
                ? "border-b-2 border-blue-500 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setResponseTypeComponent("audio")}
          >
            Record Your Response
          </button>
          <button
            className={`px-6 py-1 text-sm font-medium ${
              responseTypeComponent === "typed"
                ? "border-b-2 border-blue-500 dark:text-white"
                : "text-gray-500 hover:text-gray-700  dark:hover:text-gray-300"
            }`}
            onClick={() => setResponseTypeComponent("typed")}
          >
            Type Your Response
          </button>
        </div>
      </div>
      <div className="mb-2">
        {responseTypeComponent === "typed" ? (
          <ResponseFormTyped />
        ) : (
          <ResponseFormAudio />
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Feedback:
        </h4>
        {state.data.analysisResult && (
          <div className="text-gray-700 dark:text-gray-300 ai-markdown">
            <Markdown>{state.data.analysisResult}</Markdown>
          </div>
        )}
        {!showFeedback && (
          <div className="text-gray-700 dark:text-gray-300 ai-markdown">
            Please record a response to get feedback
          </div>
        )}

        {/* <div className="space-y-4">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              Good use of specific example
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-yellow-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              Consider adding more details about the outcome
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};
