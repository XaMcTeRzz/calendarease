export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  reminderTime?: Date;
  telegramChatId?: string;
}

export interface VoiceNote {
  id: string;
  taskId: string;
  audioUrl: string;
  date: Date;
  duration: number;
}

export interface User {
  id: string;
  name: string;
  telegramChatId?: string;
}

export type TaskWithVoiceNotes = Task & {
  voiceNotes?: VoiceNote[];
}; 