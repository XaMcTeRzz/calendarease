import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Save, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { useTasks } from '@/lib/contexts/TaskContext';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface VoiceRecorderProps {
  taskId?: string;
  onSave?: () => void;
}

export function VoiceRecorder({ taskId, onSave }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { addVoiceNote } = useTasks();
  
  useEffect(() => {
    // Створюємо аудіо елемент для відтворення
    if (audioURL && !audioRef.current) {
      audioRef.current = new Audio(audioURL);
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
    
    return () => {
      // Очищаємо аудіо при розмонтуванні
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioURL]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Зупиняємо доступ до мікрофону
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Починаємо запис
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Запускаємо таймер
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Помилка запису:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося отримати доступ до мікрофону',
        variant: 'destructive'
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Зупиняємо таймер
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const playPauseRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const saveVoiceNote = () => {
    if (audioURL) {
      const title = noteTitle.trim() || `Голосова замітка від ${format(new Date(), 'dd.MM.yyyy HH:mm')}`;
      
      addVoiceNote({
        title,
        recordingUrl: audioURL,
        date: new Date(),
        duration: recordingTime,
        taskId
      });
      
      // Очищаємо форму
      setAudioURL(null);
      setRecordingTime(0);
      setNoteTitle('');
      
      toast({
        title: 'Збережено',
        description: 'Голосову замітку збережено успішно'
      });
      
      if (onSave) {
        onSave();
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-200 font-medium">Запис голосової замітки</h3>
          {recordingTime > 0 && !isRecording && (
            <span className="text-sm text-gray-400">
              Тривалість: {formatTime(recordingTime)}
            </span>
          )}
        </div>
        
        {isRecording && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-red-500 animate-pulse" />
              <span className="text-red-400 text-sm">Запис...</span>
              <span className="ml-auto text-gray-400 text-sm">{formatTime(recordingTime)}</span>
            </div>
            <Progress value={(recordingTime % 60) * 1.6} className="h-1 bg-gray-700" />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {!isRecording && !audioURL && (
            <Button 
              onClick={startRecording} 
              variant="outline" 
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              <Mic className="h-4 w-4 mr-2" />
              Почати запис
            </Button>
          )}
          
          {isRecording && (
            <Button 
              onClick={stopRecording} 
              variant="outline" 
              size="sm"
              className="bg-red-900/70 hover:bg-red-900 text-white border-red-800"
            >
              <Square className="h-4 w-4 mr-2" />
              Зупинити
            </Button>
          )}
          
          {audioURL && (
            <>
              <Button 
                onClick={playPauseRecording} 
                variant="outline" 
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-2" /> Пауза</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Відтворити</>
                )}
              </Button>
              
              <Button 
                onClick={startRecording}
                variant="outline" 
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <Mic className="h-4 w-4 mr-2" />
                Перезаписати
              </Button>
            </>
          )}
        </div>
        
        {audioURL && (
          <div className="space-y-3">
            <Input
              placeholder="Назва замітки"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-200"
            />
            
            <Button 
              onClick={saveVoiceNote} 
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Зберегти голосову замітку
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 