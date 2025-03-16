import { Layout } from "@/components/Layout";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { useTasks } from "@/lib/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Play, Pause, Trash2, Calendar, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef } from "react";

export default function VoiceNotesPage() {
  const { voiceNotes, deleteVoiceNote, tasks } = useTasks();
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Відсортувати голосові замітки за датою (найновіші спочатку)
  const sortedVoiceNotes = [...voiceNotes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const playPauseNote = (noteId: string, url: string) => {
    if (currentPlaying === noteId) {
      // Пауза поточного аудіо
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentPlaying(null);
      }
    } else {
      // Зупиняємо попереднє аудіо, якщо таке є
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Відтворюємо нове аудіо
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setCurrentPlaying(null);
      audioRef.current.play();
      setCurrentPlaying(noteId);
    }
  };
  
  // Знаходимо назву завдання для голосової замітки
  const getTaskTitle = (taskId?: string) => {
    if (!taskId) return null;
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : null;
  };
  
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto p-2 md:p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gray-800 bg-opacity-50">
            <Mic className="h-5 w-5 md:h-6 md:w-6 text-gray-300" />
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-gray-100">Голосові замітки</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Всі голосові замітки</CardTitle>
              </CardHeader>
              <CardContent>
                {sortedVoiceNotes.length > 0 ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {sortedVoiceNotes.map((note) => (
                        <Card 
                          key={note.id} 
                          className="bg-gray-800/40 border-gray-700 hover:border-gray-600 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-medium text-gray-200">
                                    {note.title}
                                  </h3>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {format(new Date(note.date), 'dd MMMM yyyy, HH:mm', { locale: uk })}
                                  </Badge>
                                  
                                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                                    {formatTime(note.duration)}
                                  </Badge>
                                  
                                  {note.taskId && getTaskTitle(note.taskId) && (
                                    <Badge variant="outline" className="border-blue-800 text-blue-300">
                                      <LinkIcon className="h-3 w-3 mr-1" />
                                      {getTaskTitle(note.taskId)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => playPauseNote(note.id, note.recordingUrl)}
                                  className="h-8 w-8 rounded-full hover:bg-gray-700"
                                >
                                  {currentPlaying === note.id ? (
                                    <Pause className="h-4 w-4 text-blue-400" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteVoiceNote(note.id)}
                                  className="h-8 w-8 rounded-full hover:bg-red-900/30 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-16">
                    <Mic className="h-10 w-10 text-gray-500 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">У вас немає голосових заміток</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Запишіть нову замітку за допомогою мікрофона
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <VoiceRecorder />
          </div>
        </div>
      </div>
    </Layout>
  );
}
