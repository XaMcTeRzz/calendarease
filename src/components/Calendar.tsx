
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
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <CardTitle>Календар</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Управління вашими задачами</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
};
