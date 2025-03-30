export interface AnalysisState {
  llmQuestion: string;
  uiQuestion: string;
  fieldsetActive: boolean;
  answer: string;
  isLoading: boolean;
}

export const initialStateAnalysis: AnalysisState = {
  llmQuestion: "",
  uiQuestion: "",
  fieldsetActive: false,
  answer: "",
  isLoading: false,
};

export type AnalysisAction =
  | {
      type: "SET_QUESTION";
      payload: { llmquestion: string; uiQuestion: string };
    }
  | {
      type: "SET_ANSWER";
      payload: { answer: string };
    }
  | {
      type: "SET_ISLOADING";
      payload: { isLoading: boolean };
    };

export const analysisUIReducer = (
  state: AnalysisState,
  action: AnalysisAction
): AnalysisState => {
  switch (action.type) {
    case "SET_QUESTION":
      return {
        ...state,
        llmQuestion: action.payload.llmquestion,
        uiQuestion: action.payload.uiQuestion,
      };
    case "SET_ANSWER":
      return {
        ...state,
        answer: action.payload.answer,
      };
    default:
      return state;
  }
};
