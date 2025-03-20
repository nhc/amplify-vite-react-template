export interface IMockInterviewData {
  cvJobDescStr: string;
  modelAnswer: string;
  activeQuestionText: string;
  candidateAnswer: string;
  analysisResult: string;
}
export interface UIState {
  isAnswerVisible: boolean;
  showLoadingSpinner: boolean;
  focusOnResponse: boolean;
  data: IMockInterviewData;
}

export type UIAction =
  | { type: "SET_ANSWER"; payload: { isActive: boolean } }
  | { type: "SET_FOCUS_ON_RESPONSE"; payload: { focusOnResponse: boolean } }
  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | { type: "SET_DATA"; payload: { data: IMockInterviewData } }
  | { type: "SET_CV_DESC"; payload: { data: { cvJobDescStr: string } } }
  | { type: "SET_MODEL_ANSWER"; payload: { data: { modelAnswer: string } } }
  | {
      type: "SET_ACTIVE_QUESTION";
      payload: { data: { activeQuestionText: string } };
    }
  | {
      type: "SET_CANDIDATE_ANSWER";
      payload: { data: { candidateAnswer: string } };
    }
  | {
      type: "SET_ANALYSIS_RESULT";
      payload: { data: { analysisResult: string } };
    };

export const mockInterviewUIReducer = (
  state: UIState,
  action: UIAction
): UIState => {
  switch (action.type) {
    case "SET_FOCUS_ON_RESPONSE":
      return {
        ...state,
        focusOnResponse: action.payload.focusOnResponse,
      };
    case "SET_ANSWER":
      return {
        ...state,
        isAnswerVisible: action.payload.isActive,
      };
    case "SET_LOADING":
      return {
        ...state,
        showLoadingSpinner: action.payload.isLoading,
      };
    case "SET_DATA":
      return {
        ...state,
        data: action.payload.data,
      };
    case "SET_CV_DESC":
      return {
        ...state,
        data: {
          ...state.data,
          cvJobDescStr: action.payload.data.cvJobDescStr,
        },
      };
    case "SET_MODEL_ANSWER":
      return {
        ...state,
        data: {
          ...state.data,
          modelAnswer: action.payload.data.modelAnswer,
        },
      };
    case "SET_ACTIVE_QUESTION":
      return {
        ...state,
        data: {
          ...state.data,
          activeQuestionText: action.payload.data.activeQuestionText,
        },
      };
    case "SET_CANDIDATE_ANSWER":
      return {
        ...state,
        data: {
          ...state.data,
          candidateAnswer: action.payload.data.candidateAnswer,
        },
      };
    case "SET_ANALYSIS_RESULT":
      return {
        ...state,
        data: {
          ...state.data,
          analysisResult: action.payload.data.analysisResult,
        },
      };

    default:
      return state;
  }
};
