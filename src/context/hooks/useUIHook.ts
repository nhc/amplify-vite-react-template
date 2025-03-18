import { useContext } from "react";
import { MockInterviewUIContext } from "../mockinterview";

export const useUI = () => useContext(MockInterviewUIContext);
