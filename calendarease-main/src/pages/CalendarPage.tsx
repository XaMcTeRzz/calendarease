import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Plus, Check, Trash } from "lucide-react";
import { useTasks } from "@/lib/contexts/TaskContext";
import { Task } from "@/lib/types";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const { tasks, addTask, updateTask, deleteTask, getTasksForDate } = useTasks();

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Omit<Task, "id"> = {
      title: newTaskTitle,
      description: newTaskDescription,
      date: selectedDate,
      completed: false
    };

    addTask(newTask);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Календар</CardTitle>
            <CardDescription>
              Виберіть дату для перегляду або додавання задач
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Додати нову задачу</CardTitle>
              <CardDescription>
                {format(selectedDate, "dd.MM.yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Назва задачі"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Опис задачі (необов'язково)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
                <Button onClick={handleAddTask} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Додати задачу
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Задачі на {format(selectedDate, "dd.MM.yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length > 0 ? (
                <ul className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <li key={task.id} className="flex items-start space-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateTask(task.id, { completed: !task.completed })}
                      >
                        <Check className={`w-4 h-4 ${task.completed ? "text-green-500" : "text-gray-400"}`} />
                      </Button>
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className={`text-sm ${task.completed ? "text-gray-500" : "text-gray-400"}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400">
                  Немає задач на цю дату
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
