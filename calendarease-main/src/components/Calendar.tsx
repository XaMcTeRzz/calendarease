import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Check, X, Bell } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useTasks } from "@/lib/contexts/TaskContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { uk } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  
  const { addTask, getTasksForDate, tasks, deleteTask, updateTask } = useTasks();
  
  const tasksForSelectedDate = date ? getTasksForDate(date) : [];
  
  const handleAddTask = () => {
    if (date && newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        date: date,
        completed: false,
        reminderEnabled: reminderEnabled,
        reminderTime: reminderEnabled ? new Date(date.getTime()) : undefined,
      });
      
      // Очистити поля форми
      setNewTaskTitle("");
      setNewTaskDescription("");
      setReminderEnabled(false);
      setIsDialogOpen(false);
    }
  };
  
  const handleToggleComplete = (taskId: string, currentCompleted: boolean) => {
    updateTask(taskId, { completed: !currentCompleted });
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-4 space-y-4">
      <Card className="glass-card neon-border animate-fade-in">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-800 bg-opacity-50 animate-float">
                <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-300" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-gray-100 font-light">Календар</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-full glass-effect hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 animate-glow"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100 border-gray-700">
                <DialogHeader>
                  <DialogTitle>Створити нове завдання</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="taskTitle">Назва</Label>
                    <Input 
                      id="taskTitle" 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taskDescription">Опис</Label>
                    <Textarea 
                      id="taskDescription" 
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taskDate">Дата</Label>
                    <div className="p-2 bg-gray-800 rounded-md text-gray-300">
                      {date ? format(date, 'PPP', { locale: uk }) : 'Оберіть дату'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="enableReminder" 
                      checked={reminderEnabled}
                      onCheckedChange={(checked) => setReminderEnabled(checked === true)}
                    />
                    <Label htmlFor="enableReminder">Увімкнути нагадування</Label>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      Скасувати
                    </Button>
                  </DialogClose>
                  <Button 
                    type="submit" 
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim() || !date}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Створити
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="text-gray-400 mt-2 font-light text-sm md:text-base">
            Управління вашими задачами
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl border-0 glass-effect text-gray-200 p-2 md:p-4 w-full"
              classNames={{
                day_selected: "bg-gray-800 text-white hover:bg-gray-700",
                day: "hover:bg-gray-800 transition-colors rounded-lg text-sm md:text-base",
                caption: "text-gray-300",
                nav_button_previous: "hover:bg-gray-800 transition-colors rounded-lg",
                nav_button_next: "hover:bg-gray-800 transition-colors rounded-lg",
                head_cell: "text-gray-400",
              }}
            />
          </div>
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-light">
                  {date ? (
                    `Завдання на ${format(date, 'dd MMMM yyyy', { locale: uk })}`
                  ) : (
                    'Оберіть дату'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasksForSelectedDate.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {tasksForSelectedDate.map((task) => (
                        <div 
                          key={task.id} 
                          className={`p-3 rounded-lg bg-gray-700/50 border border-gray-600 ${
                            task.completed ? 'opacity-70' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-2">
                              <Checkbox 
                                checked={task.completed}
                                onCheckedChange={() => handleToggleComplete(task.id, task.completed)}
                                className="mt-1"
                              />
                              <div>
                                <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                                )}
                                <div className="flex mt-1.5 space-x-2">
                                  {task.reminderEnabled && (
                                    <Badge variant="outline" className="flex items-center space-x-1 text-xs">
                                      <Bell className="h-3 w-3" />
                                      <span>Нагадування</span>
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(task.id)}
                              className="h-7 w-7 rounded-full hover:bg-red-900/30 hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {date ? 'Немає завдань на цю дату' : 'Оберіть дату для перегляду завдань'}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline" 
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Додати завдання
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
