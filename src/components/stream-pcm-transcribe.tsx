/* eslint-disable @typescript-eslint/no-explicit-any */
// PCMStreamingTranscription.tsx
import { useState, useRef, useEffect, useCallback } from "react";
//import { Predictions } from "@aws-amplify/predictions";
import { MessageDataType, RecordingProperties } from "../types/audio";
import pEvent from "p-event";
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import { useSentenceProcessor } from "../hooks/useScentenceProcessor";
import { pcmEncode } from "../utils/pcm-encode";

export const PCMStreamingWithAudioWorklet = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [allSentences, setAllSentences] = useState<string[]>([]);
  const { processText, flush } = useSentenceProcessor();

  const [isRecording, setIsRecording] = useState<boolean>(false);
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

  const startRecording = async (): Promise<void> => {
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
  };

  const stopRecording = async (): Promise<void> => {
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
  };

  //   buffer: Float32Array[],
  //   recordingLength: number
  // ): Promise<void> => {
  //   if (!buffer || recordingLength === 0) return;

  //   setIsProcessing(true);

  //   try {
  //     // We only need the first channel since we're using mono
  //     const channelData = buffer[0].slice(0, recordingLength);

  //     // Convert to Int16 format
  //     const pcmInt16 = new Int16Array(channelData.length);
  //     for (let i = 0; i < channelData.length; i++) {
  //       pcmInt16[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32767));
  //     }

  //     // Convert to bytes
  //     const bytes = new Uint8Array(pcmInt16.buffer);

  //     // Send to AWS Predictions
  //     const result = (await Predictions.convert({
  //       transcription: {
  //         source: {
  //           bytes,
  //         },
  //       },
  //     })) as TranscriptionResult;

  //     console.log("result", result);
  //     // Update transcription
  //     if (result.transcription.fullText) {
  //       setTranscription((prev) => prev + " " + result.transcription.fullText);
  //     }
  //   } catch (err) {
  //     console.error("Error transcribing chunk:", err);
  //     setError(
  //       `Transcription error: ${
  //         err instanceof Error ? err.message : String(err)
  //       }`
  //     );
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  return (
    <div className="text-black dark:text-white">
      <button
        onClick={
          isRecording ? () => void stopRecording() : () => void startRecording()
        }
        // disabled={isProcessing}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* {isProcessing && <p>Processing...</p>} */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <h4>Transcription:</h4>
        <p>{transcription}</p>
      </div>
      <div>
        <h4>All sentences:</h4>
        <p>{allSentences}</p>
      </div>
    </div>
  );
};
