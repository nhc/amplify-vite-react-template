import { useState, useEffect } from "react";
import { Question } from "../../components/mock-interview/question";
import { IInterviewQuestion } from "../../types/prompt-formats/questions";
import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../../../amplify/data/resource";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigationList";
import { useUI } from "../../context/hooks/useUIHook";
import { Drawer } from "./common/question-drawer";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export const InterviewQuestionsBlock = () => {
  const { dispatch } = useUI();
  const [questionsList, setQuestionsList] = useState<IInterviewQuestion[]>(
    [] as IInterviewQuestion[]
  );
  const [activeQ, setActiveQ] = useState<IInterviewQuestion | undefined>(
    undefined
  );
  const [activeNonQ, setNonActiveQ] = useState<
    IInterviewQuestion[] | undefined
  >(undefined);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  console.log(activeQ, activeNonQ);
  // Use our custom hook
  useKeyboardNavigation(activeIndex, questionsList?.length - 1, setActiveIndex);

  // Handler for clicking on a question
  const handleQuestionClick = (index: number) => {
    setActiveIndex(index);
    // dispatch({ type: "SET_ANSWER", payload: { isActive: false } });
    // dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
  };

  // Handler for moving up
  const handleMoveUp = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      // dispatch({ type: "SET_ANSWER", payload: { isActive: false } });
      // dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }
  };

  // Handler for moving down
  const handleMoveDown = () => {
    if (activeIndex < questionsList.length - 1) {
      setActiveIndex(activeIndex + 1);
      // dispatch({ type: "SET_ANSWER", payload: { isActive: false } });
      // dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }
  };

  useEffect(() => {
    if (questionsList.length > 0) {
      //onDataSend(questionsList[activeIndex].Question);
      dispatch({
        type: "SET_ACTIVE_QUESTION",
        payload: {
          data: { activeQuestionText: questionsList[activeIndex].Question },
        },
      });
    }
  }, [activeIndex, dispatch, questionsList]);

  useEffect(() => {
    async function questionsList() {
      return client.models.mockInterviewQuestionsFromAnalysis.list({
        limit: 1,
      });
    }
    questionsList().then((data) => {
      const content = JSON.parse(data?.data[0].items as unknown as string);
      const json = JSON.parse(content);
      const items = json?.Items;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addActiveProperty = items?.map((q: any, i: number) => ({
        ...q,
        Active: i === 0 ? true : false,
      }));

      setQuestionsList(addActiveProperty);
    });
  }, []);

  useEffect(() => {
    setActiveQ(questionsList?.find((item) => item.Active));
    setNonActiveQ(questionsList?.filter((item) => !item.Active));
  }, [questionsList]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Interview Questions
        </h3>
        <Drawer />
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Current Question: ({activeIndex + 1}/{questionsList?.length})
        </h4>
        <div className="flex justify-between mb-4">
          <button
            onClick={handleMoveUp}
            disabled={activeIndex === 0}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleMoveDown}
            disabled={activeIndex === questionsList.length - 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* <p className="text-gray-700 dark:text-gray-300 text-lg p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          {activeQ?.Question}
        </p> */}
      </div>

      <div className="flex flex-col space-y-4">
        {questionsList?.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded cursor-pointer transition-colors ${
              index === activeIndex
                ? "text-gray-700 dark:text-gray-300 text-lg p-4 bg-blue-50 dark:bg-blue-900"
                : " text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => {
              handleQuestionClick(index);
              dispatch({ type: "SET_ANSWER", payload: { isActive: false } });
              dispatch({
                type: "SET_ACTIVE_QUESTION",
                payload: { data: { activeQuestionText: item?.Question } },
              });
            }}
          >
            <Question key={index} q={item?.Question} />
          </div>
        ))}
      </div>
    </div>
  );
};
