/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import pEvent from "p-event";
import { useSentenceProcessor } from "../../hooks/useScentenceProcessor";
import { RecordingProperties, MessageDataType } from "../../types/audio";
import { pcmEncode } from "../../utils/pcm-encode";

type Props = {
  activeQuestionText: string;
};
export const CandidateResponseBlock = ({ activeQuestionText }: Props) => {
  console.log("activeQuestionText", activeQuestionText);
  // const [activeQuestion, setActiveQuestion] =
  //   useState<string>(activeQuestionText);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [allSentences, setAllSentences] = useState<string[]>([]);
  const { processText, flush } = useSentenceProcessor();

  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  // Constants for audio configuration
  const SAMPLE_RATE = 48000;

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log("error", error);
  }, [error]);

  const startTranscription = useCallback(
    async (getAudioStream: any) => {
      try {
        const transcribeClient = new TranscribeStreamingClient({
          region: "eu-west-1",
          credentials: {
            accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
            secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
          },
        });

        const command = new StartStreamTranscriptionCommand({
          LanguageCode: "en-GB",
          MediaEncoding: "pcm",
          MediaSampleRateHertz: SAMPLE_RATE,
          AudioStream: getAudioStream(),
        });

        const data = await transcribeClient.send(command);
        console.log("Transcribe session established ", data.SessionId);

        if (data.TranscriptResultStream) {
          for await (const event of data.TranscriptResultStream) {
            if (event?.TranscriptEvent?.Transcript) {
              for (const result of event?.TranscriptEvent?.Transcript.Results ||
                []) {
                // Only process results that are final (not partial)
                if (
                  !result.IsPartial &&
                  result?.Alternatives &&
                  result?.Alternatives[0].Items
                ) {
                  let currentSegment = "";

                  // Concatenate all items in this result
                  for (const item of result.Alternatives[0].Items) {
                    currentSegment += ` ${item.Content}`;
                  }

                  // Process for sentences using our hook
                  const completeSentences = processText(currentSegment);

                  // Output each complete sentence
                  if (completeSentences.length > 0) {
                    // Update all sentences state
                    setAllSentences((prev) => [...prev, ...completeSentences]);

                    // Set the most recent sentence as current transcription
                    setTranscription(
                      completeSentences[completeSentences.length - 1]
                    );

                    // Log each sentence
                    completeSentences.forEach((sentence) => {
                      console.log(`Complete sentence: ${sentence}`);
                    });
                  }
                }
              }
            }
          }

          // When stream ends, flush any remaining text
          const finalSentences = flush();
          if (finalSentences.length > 0) {
            setAllSentences((prev) => [...prev, ...finalSentences]);
            setTranscription(finalSentences[finalSentences.length - 1]);

            finalSentences.forEach((sentence) => {
              console.log(`Final sentence: ${sentence}`);
            });
          }
        }
      } catch (error) {
        console.error("Error in transcription:", error);
      }
    },
    [processText, flush]
  );

  const startRecording = useCallback(async (): Promise<void> => {
    streamRef.current = await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    const AudioContext = window.AudioContext;
    audioContextRef.current = new AudioContext({
      sampleRate: SAMPLE_RATE,
    });

    const source1 = audioContextRef?.current.createMediaStreamSource(
      streamRef.current
    );

    const recordingprops: RecordingProperties = {
      numberOfChannels: 1,
      sampleRate: audioContextRef.current.sampleRate,
      maxFrameCount: (audioContextRef.current.sampleRate * 1) / 10,
    };

    try {
      await audioContextRef.current.audioWorklet.addModule(
        "/recording-processor.js"
      );
    } catch (error) {
      console.log(`Add module error ${error}`);
    }
    const mediaRecorder = new AudioWorkletNode(
      audioContextRef.current,
      "recording-processor",
      {
        processorOptions: recordingprops,
      }
    );

    const destination = audioContextRef.current.createMediaStreamDestination();

    mediaRecorder.port.postMessage({
      message: "UPDATE_RECORDING_STATE",
      setRecording: true,
    });

    source1.connect(mediaRecorder).connect(destination);
    mediaRecorder.port.onmessageerror = (error) => {
      console.log(`Error receving message from worklet ${error}`);
    };

    const audioDataIterator = pEvent.iterator<
      "message",
      MessageEvent<MessageDataType>
    >(mediaRecorder.port, "message");

    const getAudioStream = async function* () {
      for await (const chunk of audioDataIterator) {
        if (chunk.data.message === "SHARE_RECORDING_BUFFER") {
          const abuffer = pcmEncode(chunk.data.buffer[0]);
          const audiodata = new Uint8Array(abuffer);
          // console.log(`processing chunk of size ${audiodata.length}`);
          yield {
            AudioEvent: {
              AudioChunk: audiodata,
            },
          };
        }
      }
    };

    startTranscription(getAudioStream);
  }, [startTranscription]);

  const stopRecording = useCallback(async (): Promise<void> => {
    if (!isRecording) return;

    try {
      // Tell the processor to stop recording
      if (workletNodeRef.current) {
        workletNodeRef.current.port.postMessage({
          message: "UPDATE_RECORDING_STATE",
          setRecording: false,
        });
      }

      // Clean up
      if (workletNodeRef.current) {
        workletNodeRef.current.disconnect();
        workletNodeRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (audioContextRef.current) {
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }

      setIsRecording(false);
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError(
        `Error processing audio: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [isRecording]);

  useEffect(() => {
    const recordingStatus = document.getElementById("recordingStatus");
    const recordingIndicator = document.getElementById("recordingIndicator");

    if (recordingStatus?.textContent) {
      if (isRecording) {
        // Start recording
        startRecording();
        console.log("Start recording");
        recordingStatus.textContent = "Recording...";
        recordingIndicator?.classList.remove("bg-gray-500");
        recordingIndicator?.classList.add("animate-pulse", "bg-red-500");
      } else {
        // Stop recording
        stopRecording();
        console.log("Stop recording");
        recordingStatus.textContent = "Mic Off";
        recordingIndicator?.classList.remove("animate-pulse", "bg-red-500");
        recordingIndicator?.classList.add("bg-gray-500");
        // stop MediaRecorder
      }
    }
  }, [isRecording, startRecording, stopRecording]);

  useEffect(() => {
    transcription && console.log("Transcription: ", transcription);
  }, [transcription]);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Your Response
      </h3>

      <div className="flex items-center mb-4">
        <div
          id="recordingIndicator"
          className="w-3 h-3 bg-gray-500 rounded-full"
        ></div>
        <span
          id="recordingStatus"
          className="ml-2 text-gray-600 dark:text-gray-400"
        >
          Mic Off
        </span>
        <button
          onClick={() => {
            setIsRecording(!isRecording);
          }}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isRecording ? "Get Answers" : "Start Recording"}
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Real-time Transcript:
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-32 overflow-y-auto">
          <div className="text-gray-700 dark:text-gray-300">
            <div
              dangerouslySetInnerHTML={{
                __html: allSentences.join(" . <br /> <br />"),
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Feedback:
        </h4>
        <div className="space-y-4">
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              Good use of specific example
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-6 w-6 text-yellow-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              Consider adding more details about the outcome
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
