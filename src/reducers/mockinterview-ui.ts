export interface UIState {
  isAnswerVisible: boolean;
  showLoadingSpinner: boolean;
  isProfileVisible: boolean;
}

export type UIAction =
  | { type: "SET_ANSWER"; payload: { isActive: boolean } }
  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | { type: "TOGGLE_PROFILE" }
  | {
      type: "SET_VISIBILITY";
      payload: { component: keyof UIState; isVisible: boolean };
    };

export const mockInterviewUIReducer = (
  state: UIState,
  action: UIAction
): UIState => {
  switch (action.type) {
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
    // case "TOGGLE_PROFILE":
    //   return {
    //     ...state,
    //     isProfileVisible: !state.isProfileVisible,
    //   };
    // case "SET_VISIBILITY":
    //   return {
    //     ...state,
    //     [action.payload.component]: action.payload.isVisible,
    //   };
    default:
      return state;
  }
};
