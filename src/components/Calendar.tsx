
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
      <Card className="w-full bg-[#222222] border-[#333333]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-gray-400" />
              <CardTitle className="text-gray-200">Календар</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full hover:bg-[#333333] hover:text-white transition-colors border-[#444444]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">Управління вашими задачами</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-[#333333] bg-[#222222] text-gray-200"
          />
        </CardContent>
      </Card>
    </div>
  );
};
