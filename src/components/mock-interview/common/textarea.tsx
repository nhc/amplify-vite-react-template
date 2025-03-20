/* eslint-disable @typescript-eslint/no-unused-vars */
//import Markdown from "react-markdown";
import { useUI } from "../../../context/hooks/useUIHook";
import { LoadingSpinner } from "../../loading-spinner";

export const TextArea = () => {
  const { state } = useUI();
  console.log(state);
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-52 max-h-52 overflow-y-auto">
      <div className="text-gray-700 dark:text-gray-300">
        {state.showLoadingSpinner && (
          <div className="flex items-center justify-center min-h-48">
            <LoadingSpinner />
          </div>
        )}

        {/* {!state.data.modelAnswer && !state.showLoadingSpinner && (
          <div
            ref={transcriptionRef}
            dangerouslySetInnerHTML={{
              __html: allSentences.join(" . <br /> <br />"),
            }}
          />
        )}
       
        {!state.showLoadingSpinner && modelAnswer && (
          <div className="ai-markdown">
            <Markdown>{modelAnswer}</Markdown>
          </div>
        )} */}
      </div>
    </div>
  );
};
