export function parseS3Filename(filename: string) {
  //console.log("FILENAME _ ", filename, filename.length);
  const parts = filename.split("/");
  const user = parts.pop();
  const name = user?.split("/").pop();
  return { user, name };
}

export const extractValues = (jsonString: string) => {
  // First remove the outer quotes and parse escaped characters

  const cleanString = jsonString
    .slice(1, -1)
    // eslint-disable-next-line no-useless-escape
    .replace(/\\\"/g, '"')
    .replace(/\\n/g, "\n");

  // Split into individual JSON objects
  const lines = cleanString.split("\n");

  // Extract values and filter empty lines
  const values = lines
    .map((line) => {
      const final = line.replace(/\\/g, "").replace(/\\n/g, "\n");
      //console.log("final _ ");
      try {
        const parsed = JSON.parse(final);
        //console.log("parsed _ ", parsed);
        return parsed.Text;
      } catch (e) {
        return "";
      }
    })
    .filter((text) => text); // Remove empty lines and single hyphens

  // Join with newlines
  return values.join("\n");
};

export async function convertToPCM(audioBlob: Blob) {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Extract PCM data
  const pcmData = audioBuffer.getChannelData(0); // Get data from the first channel
  const pcm16Bit = new Int16Array(pcmData.length);

  for (let i = 0; i < pcmData.length; i++) {
    pcm16Bit[i] = Math.max(-1, Math.min(1, pcmData[i])) * 0x7fff; // Convert to 16-bit PCM
  }

  return pcm16Bit;
}
