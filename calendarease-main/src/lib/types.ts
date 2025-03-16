export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  reminderEnabled: boolean;
  reminderTime?: Date;
  tags?: string[];
}

export interface VoiceNote {
  id: string;
  title: string;
  recordingUrl: string;
  transcription?: string;
  date: Date;
  duration: number; // in seconds
  taskId?: string; // optional association with a task
}

export type TaskWithVoiceNotes = Task & {
  voiceNotes?: VoiceNote[];
}; 