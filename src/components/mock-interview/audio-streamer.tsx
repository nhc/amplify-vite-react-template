import { useState, useRef, useEffect } from "react";
import { Predictions } from "@aws-amplify/predictions";

function RealtimeTranscriptionComponent() {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [partialTranscription, setPartialTranscription] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setTranscription("");
      setPartialTranscription("");

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Configure media recorder with shorter timeslice for more frequent chunks
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording with a timeslice of 1000ms (1 second)
      // This determines how often ondataavailable will be called
      mediaRecorder.start(1000);
      setRecording(true);

      // Set up interval to process chunks every second
      intervalRef.current = setInterval(processLatestChunk, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Stop all audio tracks
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      // Clear the processing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Process any remaining audio for final transcription
      processAllChunks();
    }
  };

  const processLatestChunk = async () => {
    if (audioChunksRef.current.length === 0) return;

    try {
      // Get the latest chunk
      const latestChunk =
        audioChunksRef.current[audioChunksRef.current.length - 1];

      // Convert blob to array buffer
      const arrayBuffer = await latestChunk.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Use the Predictions API to transcribe the audio chunk
      const { transcription: result } = await Predictions.convert({
        transcription: {
          source: {
            bytes,
          },
        },
      });

      if (result?.fullText) {
        setPartialTranscription((prev) => prev + " " + result.fullText);
      }
    } catch (error) {
      console.error("Error transcribing audio chunk:", error);
    }
  };

  const processAllChunks = async () => {
    if (audioChunksRef.current.length === 0) return;

    try {
      // Combine all chunks into a single blob
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });

      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Use the Predictions API to transcribe the complete audio
      const result = await Predictions.convert({
        transcription: {
          source: {
            bytes,
          },
        },
      });

      // Set the final transcription
      setTranscription(result.transcription.fullText);
      setPartialTranscription(""); // Clear partial results
    } catch (error) {
      console.error("Error transcribing complete audio:", error);
    }
  };

  return (
    <div className="realtime-transcription">
      <h3>Real-time Transcription</h3>

      <div className="controls">
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>

      {recording && (
        <div className="recording-indicator">
          Recording... <span className="pulse">●</span>
        </div>
      )}

      <div className="transcription-result">
        <h4>Real-time Transcription:</h4>
        <p>{partialTranscription}</p>

        {transcription && (
          <>
            <h4>Final Transcription:</h4>
            <p>{transcription}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default RealtimeTranscriptionComponent;
