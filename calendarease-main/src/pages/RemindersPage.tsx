import { Layout } from "@/components/Layout";
import { useTasks } from "@/lib/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Calendar, Clock, CheckCircle2, Trash2, Send } from "lucide-react";
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Нагадування</h1>
          <Button>
            <Bell className="w-4 h-4 mr-2" />
            Налаштування нагадувань
          </Button>
        </div>
        
        {remindersTask.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remindersTask.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(task.date), "dd.MM.yyyy")}</span>
                      {task.reminderTime && (
                        <>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{format(new Date(task.reminderTime), "HH:mm")}</span>
                        </>
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {task.description && (
                    <p className="text-gray-400 mb-4">{task.description}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleSendToTelegram(task.id)}
                      disabled={sendingTelegramId === task.id}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Відправити в Telegram
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-400">
                У вас немає активних нагадувань
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
