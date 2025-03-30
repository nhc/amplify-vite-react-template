import { LLMQuestions } from "./llm-questions";
import { useLocalStorage } from "usehooks-ts";
import { useAnalysis } from "../../context/hooks/useAnalysis";
import { useEffect, useState } from "react";

import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";
import { useAgentInvoke } from "../../hooks/useAgentInvoke";
import { v4 as uuidv4 } from "uuid";

const bedrockClient = new BedrockAgentRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
    secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
  },
});

export const AnalysisUnAuth = () => {
  const { dispatch } = useAnalysis();
  const [localCV] = useLocalStorage("cv", "");
  const [localJD] = useLocalStorage("jd", "");
  const [sessionId] = useState(uuidv4());

  const { invokeAgent } = useAgentInvoke({
    agentId: "BWIBILGTGT",
    agentAliasId: "COHRWY0BO3",
    sessionId: sessionId,
    bedrockClient,
  });

  useEffect(() => {
    dispatch({
      type: "SET_ANSWER",
      payload: {
        answer: "Configuring your data, please wait...",
      },
    });

    invokeAgent(
      `The candidates CV: ${localCV}. \n\n The job description ${localJD}`
    ).then(() => {
      dispatch({
        type: "SET_ANSWER",
        payload: {
          answer: "Ready please choose a question",
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   console.log("AnalysisUnAuth", state);
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 analysis-page">
      <h1 className="text-3xl font-bold text-center mb-12 dark:text-white ">
        Analysis
      </h1>
      <LLMQuestions agentSession={sessionId} />
    </div>
  );
};
