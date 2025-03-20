/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockInterviewUIContextProvider } from "../context/mockinterview";
import { MockInterviewParent } from "../components/mock-interview/mockInterviewParent";

export const MockInterview = () => {
  // const [activeQuestion, setActiveQuestion] = useState<string>(
  //   "No Question Selected"
  // );

  // // Function to pass to child
  // const handleChildData = (data: string) => {
  //   setActiveQuestion(data);
  //   console.log("Data received from child:", data);
  // };

  return (
    <MockInterviewUIContextProvider>
      <MockInterviewParent />
    </MockInterviewUIContextProvider>
  );
};
