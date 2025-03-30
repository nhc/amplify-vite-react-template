import { useLocalStorage } from "usehooks-ts";
import { Analysis } from "../components/analysis/analysis";
import { AnalysisUnAuth } from "../components/analysis/analysis-unauthenticated";
import { AnalysisUIContextProvider } from "../context/analysis";

export const AnalysisWrapper = () => {
  const [localHasCvJd] = useLocalStorage<boolean>("hasCvJd", false);

  return (
    <AnalysisUIContextProvider>
      {localHasCvJd ? <AnalysisUnAuth /> : <Analysis />}
    </AnalysisUIContextProvider>
  );
};
