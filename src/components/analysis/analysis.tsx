/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Schema } from "../../../amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

import outputs from "../../../amplify_outputs.json";
import { extractValues } from "../../utils/functions";
import { v4 as uuidv4 } from "uuid";
import { AnswerStream } from "../answer-stream";
import { useNavigate } from "react-router";
import { useTimeout } from "usehooks-ts";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const bedrockClient = new BedrockAgentRuntimeClient({
  //   region: "eu-west-1",
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
    secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
  },
});

const session = uuidv4();

export const Analysis = () => {
  const [disabled] = useState<boolean>(false);
  const [fieldsetActive, setfieldsetActive] = useState<boolean>(true);
  const [combinedPrompt, setCombinedPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);

  const navigate = useNavigate();

  const sessionTimeoutRedirect = () => {
    // after 5 minutes redirect
    navigate("/?session=expired");
  };

  useTimeout(sessionTimeoutRedirect, 300000);

  async function invokeAgent(prompt: string) {
    const command = new InvokeAgentCommand({
      agentId: "H2MKY5NCDP",
      agentAliasId: "QBZ73KTRNP",
      sessionId: session,
      inputText: prompt,
    });
    try {
      let completion = "";
      const response = await bedrockClient.send(command);
      if (response.completion === undefined) {
        throw new Error("Completion is undefined");
      }

      for await (const chunkEvent of response.completion) {
        const chunk = chunkEvent.chunk;
        const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes);
        completion += decodedResponse;
      }

      return completion;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const cv = async function getConvertedCv() {
      return await client.models.extractedFileContent
        .list({ limit: 1 })
        .then((data) => {
          return JSON.parse(JSON.stringify(data.data[0].content));
        })
        .catch((error) => {
          console.error("getConvertedCv ERROR", error);
        });
    };
    const jd = async function getJobDescription() {
      return await client.models.jobDescription
        .list({ limit: 1 })
        .then((data) => {
          const content = data.data[0].content;
          return content;
        })
        .catch((error) => {
          console.error("getJobDescription ERROR", error);
        });
    };

    Promise.all([cv(), jd()]).then((data: unknown) => {
      if (Array.isArray(data)) {
        const cvParsed = extractValues(data[0]);

        setCombinedPrompt(
          `This is the cv: ${cvParsed} \n\n This is the job description: ${data[1]}`
        );
      }
    });
  }, []);

  useEffect(() => {
    if (combinedPrompt.length !== 0 && !disabled) {
      setAnswer("Configuring your data, please wait...");
      // PRIME THE AGENT
      invokeAgent(combinedPrompt).then(() => {
        setAnswer("Ready please choose a question");
      });
    }
  }, [combinedPrompt, disabled]);

  // const sendQuestion = (question: string, prompt: string) => {
  //   if (disabled) return;
  //   setfieldsetActive(false);
  //   setAnswer(`${question} \n\n`);
  //   invokeAgent(prompt).then((data: unknown) => {
  //     setAnswer(data as string);
  //     setfieldsetActive(true);
  //   });
  // };
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 analysis-page">
      <h1 className="text-3xl font-bold text-center mb-12 dark:text-white ">
        Analysis
      </h1>
      <div className=" text-black dark:text-white text-left">
        <div>
          <AnswerStream answerStream={answer || ""} />
        </div>
      </div>
    </div>
  );
};
