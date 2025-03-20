import { useUI } from "../../context/hooks/useUIHook";
import { CandidateResponseBlock } from "./candidate-response-block";
import { InterviewQuestionsBlock } from "./interview-questions.block";

export const MockInterviewParent = () => {
  const { state } = useUI();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        className="grid md:grid-cols-2 gap-8 transition-all duration-300 ease-in-out"
        style={{
          gridTemplateColumns: state.focusOnResponse ? "25% 75%" : "50% 50%",
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <InterviewQuestionsBlock />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <CandidateResponseBlock />
        </div>
      </div>
    </div>
  );
};
