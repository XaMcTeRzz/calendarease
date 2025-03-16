
import React from 'react';
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const CalendarView = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  return (
    <div className="w-full max-w-md mx-auto p-2 md:p-4 space-y-4">
      <Card className="glass-card neon-border animate-fade-in">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-800 bg-opacity-50 animate-float">
                <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-300" />
              </div>
              <CardTitle className="text-xl md:text-2xl text-gray-100 font-light">Календар</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full glass-effect hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 animate-glow"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
          <CardDescription className="text-gray-400 mt-2 font-light text-sm md:text-base">
            Управління вашими задачами
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};
