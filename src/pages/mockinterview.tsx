import { useState } from "react";
import { CandidateResponseBlock } from "../components/mock-interview/candidate-response-block";
import { InterviewQuestionsBlock } from "../components/mock-interview/interview-questions.block";
import { MockInterviewUIContextProvider } from "../context/mockinterview";

export const MockInterview = () => {
  const [activeQuestion, setActiveQuestion] = useState<string>(
    "No Question Selected"
  );

  // Function to pass to child
  const handleChildData = (data: string) => {
    setActiveQuestion(data);
    console.log("Data received from child:", data);
  };

  return (
    <MockInterviewUIContextProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <InterviewQuestionsBlock onDataSend={handleChildData} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <CandidateResponseBlock activeQuestionText={activeQuestion} />
          </div>
        </div>
      </div>
    </MockInterviewUIContextProvider>
  );
};
