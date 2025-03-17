export type RecordingProperties = {
  numberOfChannels: number;
  sampleRate: number;
  maxFrameCount: number;
};

export type MessageDataType = {
  message: string;
  buffer: Array<Float32Array>;
  recordingLength: number;
};

// Define interfaces for type safety
export interface TranscriptionItem {
  Content: string;
  Type?: string;
  StartTime?: number;
  EndTime?: number;
}

export interface TranscriptionAlternative {
  Items?: TranscriptionItem[];
  Transcript?: string;
}

export interface TranscriptionResult {
  Alternatives?: TranscriptionAlternative[];
  EndTime?: number;
  IsPartial: boolean;
  ResultId?: string;
  StartTime?: number;
}
