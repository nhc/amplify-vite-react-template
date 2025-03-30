import { useEffect } from "react";
import { useAnalysis } from "../../context/hooks/useAnalysis";
import { AnswerStream } from "../answer-stream";
import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";
import { useAgentInvoke } from "../../hooks/useAgentInvoke";

const bedrockClient = new BedrockAgentRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
    secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
  },
});

type Props = {
  agentSession: string;
};

export const LLMQuestions = ({ agentSession }: Props) => {
  const { state, dispatch } = useAnalysis();

  const { invokeAgent } = useAgentInvoke({
    agentId: "BWIBILGTGT",
    agentAliasId: "COHRWY0BO3",
    sessionId: agentSession,
    bedrockClient,
  });

  function sendQuestion(question: string, text: string) {
    dispatch({
      type: "SET_ISLOADING",
      payload: { isLoading: true },
    });

    dispatch({
      type: "SET_QUESTION",
      payload: { uiQuestion: question, llmquestion: text },
    });
  }

  async function askAgent() {
    const result = await invokeAgent(state.llmQuestion);
    if (result) {
      return result;
    }
  }

  useEffect(() => {
    console.log("isLoading", state.isLoading);
    if (state.llmQuestion && !state.isLoading) {
      dispatch({
        type: "SET_ANSWER",
        payload: {
          answer: state.uiQuestion,
        },
      });

      askAgent().then((response) => {
        dispatch({
          type: "SET_ISLOADING",
          payload: { isLoading: false },
        });
        dispatch({
          type: "SET_ANSWER",
          payload: {
            answer: response || "No response",
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.llmQuestion]);

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 analysis-page">
        <div className="text-black dark:text-white text-left">
          <form>
            <fieldset disabled={state.fieldsetActive}>
              <h2 className="text-black dark:text-white">
                CV Specific Questions
              </h2>
              <div className="flex space-x-4 mt-2">
                <a
                  href="#"
                  onClick={() => {
                    sendQuestion(
                      " Am I a good fit for the role?",
                      "Is the CV a good fit for the job description? Give specific examples of where the candidate CV  matches the job description. Keep it high level and succinct but useful to the candidate. Remember to be positive and encouraging."
                    );
                  }}
                  className="flex bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Am I a good fit for the role?
                </a>

                <a
                  href="#"
                  onClick={() => {
                    sendQuestion(
                      " What are my strengths?",
                      "What are the candidates strengths, compare the CV to the Job Description. Do not give any weaknesses."
                    );
                  }}
                  className="flex bg-blue-600 text-white px-3 py-1  rounded-lg hover:bg-blue-700"
                >
                  What are my strengths?
                </a>

                <a
                  href="#"
                  onClick={() => {
                    sendQuestion(
                      " Which skills are missing from my CV?",
                      "Look at the CV and Job Description, list out the missing skills? Provide a list of minimum 5 skills that are missing from the CV that are in the Job Description. Provide numbered bullets points keep it simple."
                    );
                  }}
                  className="flex bg-blue-600 text-white px-3 py-1  rounded-lg hover:bg-blue-700"
                >
                  Which skills are missing from my CV?
                </a>
              </div>
              <h2 className="text-black dark:text-white mt-6">
                Possible Interview Questions
              </h2>
              <div className="flex space-x-4 mt-2">
                <a
                  href="#"
                  onClick={() => {
                    sendQuestion(
                      " Give me 5 industry specific interview questions",
                      "Based on the information provided, generate a list of 5 industry specific interview questions. Extract the industry from the job description already provided. The questions must be high level and suitable for a first round interview. Do not ask for too many implementation details. Make each question about a different subject. Most of the questions should be about the candidate's experience and how they would handle certain situations. Please generate only the bulleted output. DO NOT provide any preamble."
                    );
                  }}
                  className="flex bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Industry specific interview questions
                </a>

                <a
                  href="#"
                  onClick={() => {
                    sendQuestion(
                      " Generating 5 role specific interview questions",
                      "Based on the information provided, generate a list of 5 role specific interview questions. Extract the role from the job description previously provided. The questions must be high level and suitable for a first round interview.  Do not ask for too many implementation details. Make each question about a different subject. Most of the questions should be about the candidate's experience and how they would handle certain situations. In the response do not provide a summary or title, just return the 5 questions. Please generate only the bulleted output. DO NOT provide any preamble."
                    );
                  }}
                  className="flex bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Role specific interview questions
                </a>

                <a
                  href="#"
                  onClick={() => {
                    sendQuestion(
                      "Give me 5 general interview questions based on the interpreted experience level. ",
                      "Based on the information provided, generate me 5 general interview questions based on the interpreted experience level. Do not make these role specific or industry specific. The questions must be high level and suitable for a first round interview. Do not ask for too many implementation details. Make each question about a different subject. Please generate only the bulleted output. DO NOT provide any preamble."
                    );
                  }}
                  className="flex bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  General interview questions
                </a>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <div className=" text-black dark:text-white text-left">
        <div>
          <AnswerStream answerStream={state.answer || ""} />
        </div>
      </div>
    </>
  );
};
