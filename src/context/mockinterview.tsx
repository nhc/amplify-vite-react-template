import { createContext, useReducer } from "react";
import {
  UIState,
  UIAction,
  mockInterviewUIReducer,
} from "../reducers/mockinterview-ui";

const initialState: UIState = {
  isAnswerVisible: false,
  showLoadingSpinner: false,
  isProfileVisible: false,
};

export const MockInterviewUIContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
}>({ state: initialState, dispatch: () => null });

export const MockInterviewUIContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(mockInterviewUIReducer, initialState);

  return (
    <MockInterviewUIContext.Provider value={{ state, dispatch }}>
      {children}
    </MockInterviewUIContext.Provider>
  );
};
