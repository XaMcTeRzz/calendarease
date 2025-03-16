import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, VoiceNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
  tasks: Task[];
  voiceNotes: VoiceNote[];
  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
  addVoiceNote: (voiceNote: Omit<VoiceNote, 'id'>) => VoiceNote;
  deleteVoiceNote: (id: string) => void;
  getVoiceNotesForTask: (taskId: string) => VoiceNote[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

  // Load tasks from local storage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedVoiceNotes = localStorage.getItem('voiceNotes');
    
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          date: new Date(task.date),
          reminderTime: task.reminderTime ? new Date(task.reminderTime) : undefined
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
      }
    }
    
    if (savedVoiceNotes) {
      try {
        const parsedNotes = JSON.parse(savedVoiceNotes).map((note: any) => ({
          ...note,
          date: new Date(note.date)
        }));
        setVoiceNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing voice notes from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save voice notes to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('voiceNotes', JSON.stringify(voiceNotes));
  }, [voiceNotes]);

  // Add a new task
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: uuidv4() };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  // Update an existing task
  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    // Also remove associated voice notes
    setVoiceNotes(prev => prev.filter(note => note.taskId !== id));
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Add a new voice note
  const addVoiceNote = (voiceNote: Omit<VoiceNote, 'id'>) => {
    const newVoiceNote = { ...voiceNote, id: uuidv4() };
    setVoiceNotes(prev => [...prev, newVoiceNote]);
    return newVoiceNote;
  };

  // Delete a voice note
  const deleteVoiceNote = (id: string) => {
    setVoiceNotes(prev => prev.filter(note => note.id !== id));
  };

  // Get voice notes for a specific task
  const getVoiceNotesForTask = (taskId: string) => {
    return voiceNotes.filter(note => note.taskId === taskId);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      voiceNotes,
      addTask,
      updateTask,
      deleteTask,
      getTasksForDate,
      addVoiceNote,
      deleteVoiceNote,
      getVoiceNotesForTask
    }}>
      {children}
    </TaskContext.Provider>
  );
}; 