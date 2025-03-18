/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IInterviewQuestionPrompt,
  interviewQuestion,
} from "../../types/prompt-formats/mock-interview";
import { useGetCvJob } from "../../hooks/useGetCvJob";
import { useEffect, useState } from "react";
import { extractValues } from "../../utils/functions";
import { useAgentInvoke } from "../../hooks/useAgentInvoke";
import { v4 as uuidv4 } from "uuid";
import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";
import Markdown from "react-markdown";

interface Replacements {
  [key: string]: string;
}

export const TestPage = () => {
  const [cvStr, setCvStr] = useState<string>("");
  const [replacements, setReplacements] = useState<Replacements>();
  const [prompt, setPrompt] =
    useState<IInterviewQuestionPrompt>(interviewQuestion);
  const { cvContent, jobDescription } = useGetCvJob();
  const [question, setQuestion] = useState<string>(
    "Can you share an example of a legacy code refactoring project you have worked on and the impact it had on maintenance overhead?"
  );
  const [candidateAnswer, setCandidateAnswer] = useState<string>(
    "When I worked in for Extreme in 2019 I was brought in to manage an existing ecommerce project to do exactly that. There was all sorts of languages and frameworks being used and it was a mess. I was able to refactor the codebase to use a single language and framework which made it easier to maintain and onboard new developers. This reduced the time it took to onboard new developers by 50% and reduced the number of bugs by 30%."
  );
  const [modelAnswer, setModelAnswer] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");

  const bedrockClient = new BedrockAgentRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
      secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
    },
  });

  const { invokeAgent: invokeStep1 } = useAgentInvoke({
    agentId: "J19DVUUHWZ",
    agentAliasId: "KQGEWPHQX1",
    sessionId: uuidv4(),
    bedrockClient,
  });

  const { invokeAgent: invokeStep2 } = useAgentInvoke({
    agentId: "X3NLVYV0HD",
    agentAliasId: "YVQEXLO6XE",
    sessionId: uuidv4(),
    bedrockClient,
  });
  // console.log("Hello", result);

  useEffect(() => {
    if (cvContent && jobDescription) {
      const parsed = extractValues(cvContent);
      setCvStr(
        `This is the candidates CV: ${parsed} \n\n This is the job the candidate is going for ${jobDescription}`
      );
    }
  }, [cvContent, jobDescription]);

  useEffect(() => {
    const get = async () => {
      const result = await invokeStep1(
        `${cvStr}. This is the interview question ${question}`
      );
      if (result) {
        return result;
        // add to DB
      }
    };
    get().then(async (modelAnswer) => {
      console.log("Model Answer: ", modelAnswer);
      const result = await invokeStep2(
        `${cvStr}. This is the interview question ${question}, and this is the model answer ${modelAnswer}. The candidate's answer is: ${candidateAnswer}`
      );
      if (result) {
        console.log("Bullets: ", result);
        setAnalysis(result);
        // add to DB
      }
    });
  }, [cvStr]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-white dark:text-white">Hello, Test Page</h2>
      <div className="text-white dark:text-white">
        <h3>Output</h3>
        {/* <Markdown>{modelAnswer}</Markdown> */}
        <Markdown>{analysis}</Markdown>
      </div>
    </div>
  );
};

// const TestPage = () => {
//   const statusRef = useRef<HTMLDivElement>(null);
//   const transcriptRef = useRef<HTMLDivElement>(null);
//   const socketRef = useRef<WebSocket | null>(null);
//   const audioCtx = useRef<AudioContext | null>(null);

//   const startRecording = () => {
//     if (!audioCtx.current) return;

//     if (audioCtx.current.state === "suspended") {
//       audioCtx.current.resume();
//     }

//     let mediaRecorder: MediaRecorder;

//     const dest = audioCtx?.current.createMediaStreamDestination();

//     Promise.all([
//       navigator.mediaDevices.getUserMedia({ audio: true }),
//       navigator.mediaDevices.getDisplayMedia({
//         audio: true,
//       }),
//     ])
//       .then(([micStream, displayStream]) => {
//         if (!MediaRecorder.isTypeSupported("audio/webm")) {
//           alert("Browser not supported");
//           return;
//         }

//         [micStream, displayStream].forEach((str) => {
//           if (!audioCtx.current) return;
//           const src = audioCtx.current.createMediaStreamSource(str);
//           src.connect(dest);
//         });

//         mediaRecorder = new MediaRecorder(dest.stream, {
//           mimeType: "audio/webm",
//         });

//         if (!socketRef.current) {
//           socketRef.current = new WebSocket("ws://localhost:5173/listen");
//         }

//         socketRef.current.onopen = () => {
//           if (statusRef.current) statusRef.current.textContent = "Connected";
//           mediaRecorder.addEventListener("dataavailable", (event) => {
//             if (!socketRef?.current) return;
//             if (event.data.size > 0 && socketRef.current.readyState === 1) {
//               socketRef.current.send(event.data);
//             }
//           });
//           mediaRecorder.start(250); //sending blobs of data every 250ms
//         };

//         socketRef.current.onmessage = (message) => {
//           if (!transcriptRef?.current) return;
//           const received = message.data;
//           console.log(received);
//           if (received && transcriptRef.current) {
//             transcriptRef.current.textContent += " " + received;
//           }
//         };
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   useEffect(() => {
//     audioCtx.current = new AudioContext();
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <button onClick={startRecording}>Start</button>
//       <div id="status" ref={statusRef} />
//       <div id="transcript" ref={transcriptRef} />
//     </div>
//   );
// };

// export default TestPage;
