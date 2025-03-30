import { useContext } from "react";
import { AnalysisUIContext } from "../analysis";

export const useAnalysis = () => useContext(AnalysisUIContext);
