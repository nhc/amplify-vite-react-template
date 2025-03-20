/* eslint-disable @typescript-eslint/no-unused-vars */
import { MockInterviewUIContextProvider } from "../context/mockinterview";
import { MockInterviewParent } from "../components/mock-interview/mockInterviewParent";

export const MockInterview = () => {
  return (
    <MockInterviewUIContextProvider>
      <MockInterviewParent />
    </MockInterviewUIContextProvider>
  );
};
