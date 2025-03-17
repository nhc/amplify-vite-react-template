/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IInterviewQuestionPrompt,
  interviewQuestion,
} from "../../types/prompt-formats/mock-interview";
import { useGetCvJob } from "../../hooks/useGetCvJob";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { useEffect, useState } from "react";
import { useInvokeLLM } from "../../hooks/useInvokeLLM";
import { testBody } from "../../types/prompt-formats/mock-interview";

interface Replacements {
  [key: string]: string;
}

export const TestPage = () => {
  const [cvStr, setCvStr] = useState<string>("");
  const [replacements, setReplacements] = useState<Replacements>();
  const [prompt, setPrompt] =
    useState<IInterviewQuestionPrompt>(interviewQuestion);
  const { cvContent, jobDescription } = useGetCvJob();

  const bedrockClient = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
      secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
    },
  });

  const { invokeModel } = useInvokeLLM({
    modelId: "amazon.nova-pro-v1:0",
    bedrockClient: bedrockClient,
  });
  // console.log("Hello", result);

  useEffect(() => {
    const get = async () => {
      if (replacements && replacements["[[CV-JOB-DESCRIPTION]]"]) {
        const parsedPrompt = Object.entries(replacements).reduce(
          (text, [placeholder, value]) => text.replace(placeholder, value),
          JSON.stringify(prompt)
        );

        const jsonPrompt = JSON.parse(parsedPrompt);

        console.log("parsedPrompt", JSON.parse(parsedPrompt));
        console.log("testBody", testBody);
        console.log("prompt", prompt);

        const result = await invokeModel(JSON.stringify(jsonPrompt));
        if (result) {
          console.log("Result: ", result);
          // add to DB
        }
      }
    };
    get();
  }, [replacements]);

  useEffect(() => {
    if (cvContent && jobDescription) {
      setCvStr(`${cvContent} ${jobDescription}`);
    }
  }, [cvContent, jobDescription]);

  useEffect(() => {
    console.log("setting replacements");
    setReplacements({
      "[[JOB-ROLE]]": "Software Engineer",
      "[[CV-JOB-DESCRIPTION]]": "TEST",
      "[[QUESTION]]":
        "Can you describe a challenging project you worked on and how you approached solving the problem?",
      "[CANDIDATE-ANSWER]":
        "I was moved to a different team and had to learn a new language and framework. I was able to learn the new language and framework and deliver the project on time, but there were many challenges along the way.",
    });
  }, [cvStr]);
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-white dark:text-white">Hello, Test Page</h2>
      <div className="text-white dark:text-white">
        {/* {JSON.parse(prompt)} */}
        {/* {JSON.stringify(replacements)} */}
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
