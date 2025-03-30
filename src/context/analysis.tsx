import { createContext, useReducer } from "react";

import {
  AnalysisAction,
  AnalysisState,
  analysisUIReducer,
  initialStateAnalysis,
} from "../reducers/analysis";

export const AnalysisUIContext = createContext<{
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
}>({ state: initialStateAnalysis, dispatch: () => null });

export const AnalysisUIContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(analysisUIReducer, initialStateAnalysis);

  return (
    <AnalysisUIContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisUIContext.Provider>
  );
};
