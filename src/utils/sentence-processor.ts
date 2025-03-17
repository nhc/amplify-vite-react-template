export class SentenceProcessor {
  private buffer: string = "";
  private readonly sentenceEndPattern: RegExp = /[.!?]\s+/;

  constructor() {}

  processText(text: string): string[] {
    // Add to our buffer
    this.buffer += text;

    // Find sentence endings
    const sentences = this.buffer.split(this.sentenceEndPattern);

    // If we found sentence endings
    if (sentences.length > 1) {
      // All but the last one are complete sentences
      const completeSentences = sentences
        .slice(0, -1)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);

      // Keep the last part in the buffer (it's incomplete)
      this.buffer = sentences[sentences.length - 1];

      return completeSentences;
    }

    return [];
  }

  flush(): string[] {
    if (this.buffer.trim()) {
      const sentence = this.buffer.trim();
      this.buffer = "";
      return [sentence];
    }
    return [];
  }
}

// // Main transcription function
// async function startTranscription() {
//   const transcribeClient = /* your transcribe client initialization */;
//   const SAMPLE_RATE = /* your sample rate */;

//   const command = new StartStreamTranscriptionCommand({
//     LanguageCode: "en-GB",
//     MediaEncoding: "pcm",
//     MediaSampleRateHertz: SAMPLE_RATE,
//     AudioStream: getAudioStream(),
//   });

//   const data = await transcribeClient.send(command);
//   console.log("Transcribe session established ", data.SessionId);

//   const sentenceProcessor = new SentenceProcessor();
//   let entireTranscript = "";

//   if (data.TranscriptResultStream) {
//     for await (const event of data.TranscriptResultStream) {
//       if (event?.TranscriptEvent?.Transcript) {
//         for (const result of event?.TranscriptEvent?.Transcript.Results || []) {
//           // Only process results that are final (not partial)
//           if (!result.IsPartial && result?.Alternatives && result?.Alternatives[0].Items) {
//             let currentSegment = "";

//             // Concatenate all items in this result
//             for (const item of result.Alternatives[0].Items) {
//               currentSegment += ` ${item.Content}`;
//             }

//             // Add to entire transcript
//             entireTranscript += currentSegment;

//             // Process for sentences
//             const completeSentences = sentenceProcessor.processText(currentSegment);

//             // Output each complete sentence
//             for (const sentence of completeSentences) {
//               console.log(`Complete sentence: ${sentence}`);
//               // Here you can call any function to handle the complete sentence
//               // handleCompleteSentence(sentence);
//             }
//           }
//         }
//       }
//     }

//     // When stream ends, flush any remaining text
//     const finalSentences = sentenceProcessor.flush();
//     for (const sentence of finalSentences) {
//       console.log(`Final sentence: ${sentence}`);
//       // handleCompleteSentence(sentence);
//     }
//   }
// }

// // Function to get audio stream (you already have this)
// function getAudioStream() {
//   // Your implementation
// }
