import { Layout } from "@/components/Layout";
import { useTasks } from "@/lib/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, CheckCircle2, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendReminderToTelegram, getUserTelegramChatId } from "@/lib/telegram";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function RemindersPage() {
  const { tasks, deleteTask, updateTask } = useTasks();
  const [sendingTelegramId, setSendingTelegramId] = useState<string | null>(null);
  
  // Отримуємо всі завдання з увімкненими нагадуваннями, відсортовані за датою
  const remindersTask = tasks
    .filter(task => task.reminderEnabled)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const markAsComplete = (taskId: string) => {
    updateTask(taskId, { completed: true });
  };
  
  const handleSendToTelegram = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setSendingTelegramId(taskId);
    
    try {
      // В реальній імплементації тут буде отримання chatId з бази даних
      const chatId = getUserTelegramChatId('current_user_id');
      
      if (!chatId) {
        toast({
          title: "Помилка",
          description: "Telegram бот не підключений до вашого облікового запису",
          variant: "destructive"
        });
        return;
      }
      
      const success = await sendReminderToTelegram(chatId, task);
      
      if (success) {
        toast({
          title: "Успіх!",
          description: "Нагадування надіслано в Telegram"
        });
      } else {
        toast({
          title: "Помилка",
          description: "Не вдалося надіслати нагадування",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Помилка при надсиланні в Telegram:', error);
      toast({
        title: "Помилка",
        description: "Виникла помилка при взаємодії з Telegram",
        variant: "destructive"
      });
    } finally {
      setSendingTelegramId(null);
    }
  };
  
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto p-2 md:p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gray-800 bg-opacity-50">
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-300" />
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-gray-100">Нагадування</h1>
        </div>
        
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Всі нагадування</CardTitle>
          </CardHeader>
          <CardContent>
            {remindersTask.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {remindersTask.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`bg-gray-800/40 border-gray-700 hover:border-gray-600 transition-colors ${
                        task.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                              {task.title}
                            </h3>
                            
                            {task.description && (
                              <p className="text-sm text-gray-400">{task.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge>
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(task.date), 'dd MMMM yyyy', { locale: uk })}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {!task.completed && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleSendToTelegram(task.id)}
                                  disabled={sendingTelegramId === task.id}
                                  className="h-8 w-8 rounded-full hover:bg-blue-900/30 hover:text-blue-400"
                                >
                                  <Send className={`h-4 w-4 ${sendingTelegramId === task.id ? 'animate-pulse' : ''}`} />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsComplete(task.id)}
                                  className="h-8 w-8 rounded-full hover:bg-green-900/30 hover:text-green-400"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task.id)}
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
                <Bell className="h-10 w-10 text-gray-500 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">У вас немає активних нагадувань</p>
                <p className="text-gray-500 text-sm mt-1">
                  Створіть нове завдання з нагадуванням у календарі
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
