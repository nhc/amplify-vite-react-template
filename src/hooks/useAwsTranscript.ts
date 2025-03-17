// // useTranscription.ts
// import { useState, useCallback, useRef, useEffect } from 'react';
// import MicrophoneStream from 'microphone-stream';
// import { EventStreamMarshaller } from '@aws-sdk/eventstream-marshaller';
// import { toUtf8, fromUtf8 } from '@aws-sdk/util-utf8-node';
// import * as crypto from 'crypto';
// import * as v4 from './aws-signature-v4'; // Assuming this file exists in your project
// import * as audioUtils from './audioUtils'; // Assuming this file exists in your project

// // Types and Interfaces
// export interface TranscriptionOptions {
//   languageCode: string;
//   region: string;
//   credentials: {
//     accessId: string;
//     secretKey: string;
//     sessionToken?: string;
//   };
// }

// export interface TranscriptionResult {
//   transcript: string;
//   isPartial: boolean;
// }

// export interface TranscriptionState {
//   isRecording: boolean;
//   transcription: string;
//   error: string | null;
//   isSupported: boolean;
// }

// interface AudioEventMessage {
//   headers: {
//     ':message-type': {
//       type: string;
//       value: string;
//     };
//     ':event-type': {
//       type: string;
//       value: string;
//     };
//   };
//   body: Buffer;
// }

// interface TranscriptAlternative {
//   Transcript: string;
// }

// interface TranscriptResult {
//   Alternatives: TranscriptAlternative[];
//   IsPartial: boolean;
// }

// interface TranscriptEvent {
//   Transcript: {
//     Results: TranscriptResult[];
//   };
// }

// /**
//  * Custom hook for real-time audio transcription using Amazon Transcribe
//  */
// export const useTranscription = () => {
//   // State
//   const [state, setState] = useState<TranscriptionState>({
//     isRecording: false,
//     transcription: '',
//     error: null,
//     isSupported: !!window.navigator.mediaDevices?.getUserMedia,
//   });

//   // Refs to maintain values across renders without triggering re-renders
//   const socketRef = useRef<WebSocket | null>(null);
//   const micStreamRef = useRef<any>(null);
//   const optionsRef = useRef<TranscriptionOptions | null>(null);
//   const inputSampleRateRef = useRef<number>(0);
//   const sampleRateRef = useRef<number>(0);
//   const socketErrorRef = useRef<boolean>(false);
//   const transcribeExceptionRef = useRef<boolean>(false);

//   // Create event stream marshaller
//   const eventStreamMarshaller = new EventStreamMarshaller(toUtf8, fromUtf8);

//   /**
//    * Sets the language and determines the appropriate sample rate
//    */
//   const setLanguage = useCallback((languageCode: string) => {
//     if (languageCode === "en-US" || languageCode === "es-US") {
//       sampleRateRef.current = 44100;
//     } else {
//       sampleRateRef.current = 8000;
//     }
//   }, []);

//   /**
//    * Creates a pre-signed URL for AWS Transcribe WebSocket
//    */
//   const createPresignedUrl = useCallback(() => {
//     if (!optionsRef.current) return '';

//     const { region, languageCode, credentials } = optionsRef.current;
//     const endpoint = `transcribestreaming.${region}.amazonaws.com:8443`;

//     return v4.createPresignedURL(
//       'GET',
//       endpoint,
//       '/stream-transcription-websocket',
//       'transcribe',
//       crypto.createHash('sha256').update('', 'utf8').digest('hex'),
//       {
//         'key': credentials.accessId,
//         'secret': credentials.secretKey,
//         'sessionToken': credentials.sessionToken || '',
//         'protocol': 'wss',
//         'expires': 15,
//         'region': region,
//         'query': `language-code=${languageCode}&media-encoding=pcm&sample-rate=${sampleRateRef.current}`
//       }
//     );
//   }, []);

//   /**
//    * Converts audio chunk to binary message format for AWS Transcribe
//    */
//   const convertAudioToBinaryMessage = useCallback((audioChunk: any) => {
//     const raw = MicrophoneStream.toRaw(audioChunk);

//     if (raw == null) return;

//     // Downsample and convert the raw audio bytes to PCM
//     const downsampledBuffer = audioUtils.downsampleBuffer(
//       raw,
//       inputSampleRateRef.current,
//       sampleRateRef.current
//     );
//     const pcmEncodedBuffer = audioUtils.pcmEncode(downsampledBuffer);

//     // Add the right JSON headers and structure to the message
//     const audioEventMessage = getAudioEventMessage(Buffer.from(pcmEncodedBuffer));

//     // Convert the JSON object + headers into a binary event stream message
//     return eventStreamMarshaller.marshall(audioEventMessage);
//   }, [eventStreamMarshaller]);

//   /**
//    * Creates an audio event message structure
//    */
//   const getAudioEventMessage = useCallback((buffer: Buffer): AudioEventMessage => {
//     return {
//       headers: {
//         ':message-type': {
//           type: 'string',
//           value: 'event'
//         },
//         ':event-type': {
//           type: 'string',
//           value: 'AudioEvent'
//         }
//       },
//       body: buffer
//     };
//   }, []);

//   /**
//    * Handles incoming transcription messages
//    */
//   const handleEventStreamMessage = useCallback((messageJson: TranscriptEvent) => {
//     const results = messageJson.Transcript.Results;

//     if (results.length > 0) {
//       if (results[0].Alternatives.length > 0) {
//         let transcript = results[0].Alternatives[0].Transcript;

//         // Fix encoding for accented characters
//         transcript = decodeURIComponent(escape(transcript));

//         setState(prevState => {
//           // If this transcript segment is final, add it to the overall transcription
//           if (!results[0].IsPartial) {
//             return {
//               ...prevState,
//               transcription: prevState.transcription + transcript + "\n"
//             };
//           }
//           return prevState;
//         });
//       }
//     }
//   }, []);

//   /**
//    * Sets up WebSocket event handlers
//    */
//   const wireSocketEvents = useCallback(() => {
//     if (!socketRef.current) return;

//     // Handle inbound messages from Amazon Transcribe
//     socketRef.current.onmessage = (message: MessageEvent) => {
//       // Convert the binary event stream message to JSON
//       const messageWrapper = eventStreamMarshaller.unmarshall(Buffer.from(message.data));
//       const messageBody = JSON.parse(
//         String.fromCharCode.apply(String, Array.from(new Uint8Array(messageWrapper.body)))
//       );

//       if (messageWrapper.headers[":message-type"].value === "event") {
//         handleEventStreamMessage(messageBody);
//       } else {
//         transcribeExceptionRef.current = true;
//         setState(prevState => ({
//           ...prevState,
//           error: messageBody.Message,
//           isRecording: false
//         }));
//       }
//     };

//     socketRef.current.onerror = () => {
//       socketErrorRef.current = true;
//       setState(prevState => ({
//         ...prevState,
//         error: 'WebSocket connection error. Try again.',
//         isRecording: false
//       }));
//     };

//     socketRef.current.onclose = (closeEvent: CloseEvent) => {
//       if (micStreamRef.current) {
//         micStreamRef.current.stop();
//       }

//       // The close event immediately follows the error event; only handle one
//       if (!socketErrorRef.current && !transcribeExceptionRef.current) {
//         if (closeEvent.code !== 1000) {
//           setState(prevState => ({
//             ...prevState,
//             error: `Streaming Exception: ${closeEvent.reason}`,
//             isRecording: false
//           }));
//         } else {
//           setState(prevState => ({
//             ...prevState,
//             isRecording: false
//           }));
//         }
//       }
//     };
//   }, [eventStreamMarshaller, handleEventStreamMessage]);

//   /**
//    * Streams audio to WebSocket
//    */
//   const streamAudioToWebSocket = useCallback((userMediaStream: MediaStream) => {
//     // Create microphone stream
//     micStreamRef.current = new MicrophoneStream();

//     micStreamRef.current.on("format", (data: { sampleRate: number }) => {
//       inputSampleRateRef.current = data.sampleRate;
//     });

//     micStreamRef.current.setStream(userMediaStream);

//     // Create pre-signed URL for WebSocket connection
//     const url = createPresignedUrl();
//     if (!url) {
//       setState(prevState => ({
//         ...prevState,
//         error: 'Failed to create pre-signed URL',
//         isRecording: false
//       }));
//       return;
//     }

//     // Open WebSocket connection
//     socketRef.current = new WebSocket(url);
//     socketRef.current.binaryType = "arraybuffer";

//     // When WebSocket is open, start sending audio data
//     socketRef.current.onopen = () => {
//       micStreamRef.current.on('data', (rawAudioChunk: any) => {
//         // Convert audio to binary message
//         const binary = convertAudioToBinaryMessage(rawAudioChunk);

//         if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && binary) {
//           socketRef.current.send(binary);
//         }
//       });
//     };

//     // Set up WebSocket event handlers
//     wireSocketEvents();
//   }, [convertAudioToBinaryMessage, createPresignedUrl, wireSocketEvents]);

//   /**
//    * Closes the WebSocket connection
//    */
//   const closeSocket = useCallback(() => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       if (micStreamRef.current) {
//         micStreamRef.current.stop();
//       }

//       // Send an empty frame so that Transcribe initiates a closure of the WebSocket
//       // after submitting all transcripts
//       const emptyMessage = getAudioEventMessage(Buffer.from([]));
//       const emptyBuffer = eventStreamMarshaller.marshall(emptyMessage);
//       socketRef.current.send(emptyBuffer);
//     }
//   }, [eventStreamMarshaller, getAudioEventMessage]);

//   /**
//    * Starts the transcription process
//    */
//   const startTranscription = useCallback((options: TranscriptionOptions) => {
//     // Reset error states
//     setState(prevState => ({ ...prevState, error: null }));
//     socketErrorRef.current = false;
//     transcribeExceptionRef.current = false;

//     // Store options
//     optionsRef.current = options;

//     // Set language and region
//     setLanguage(options.languageCode);

//     // Check if browser supports getUserMedia
//     if (!state.isSupported) {
//       setState(prevState => ({
//         ...prevState,
//         error: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. Update your browser and try your request again.'
//       }));
//       return;
//     }

//     // Set recording state
//     setState(prevState => ({ ...prevState, isRecording: true }));

//     // Get microphone input from the browser
//     window.navigator.mediaDevices.getUserMedia({
//       video: false,
//       audio: true
//     })
//     .then(streamAudioToWebSocket)
//     .catch(error => {
//       console.error('Error accessing microphone:', error);
//       setState(prevState => ({
//         ...prevState,
//         error: 'There was an error streaming your audio to Amazon Transcribe. Please try again.',
//         isRecording: false
//       }));
//     });
//   }, [state.isSupported, setLanguage, streamAudioToWebSocket]);

//   /**
//    * Stops the transcription process
//    */
//   const stopTranscription = useCallback(() => {
//     closeSocket();
//     setState(prevState => ({ ...prevState, isRecording: false }));
//   }, [closeSocket]);

//   /**
//    * Resets the transcription
//    */
//   const resetTranscription = useCallback(() => {
//     setState(prevState => ({ ...prevState, transcription: '' }));
//   }, []);

//   // Clean up resources when component unmounts
//   useEffect(() => {
//     return () => {
//       if (micStreamRef.current) {
//         micStreamRef.current.stop();
//       }
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   return {
//     state,
//     startTranscription,
//     stopTranscription,
//     resetTranscription
//   };
// };

// export default useTranscription;
