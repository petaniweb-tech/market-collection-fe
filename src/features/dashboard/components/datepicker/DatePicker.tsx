import * as React from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, Locale, addMonths, subMonths } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

interface EnhancedDatePickerProps {
  date: Date;
  onSelect: (date: Date | undefined) => void;
  locale?: Locale;
  buttonLabel?: string;
}

export function EnhancedDatePicker({
  date,
  onSelect,
  locale = id,
  buttonLabel,
}: EnhancedDatePickerProps) {
  const [view, setView] = React.useState<"day" | "month" | "year">("day");
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(date);
  
  // Get today, this month, this year
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  
  // Handle day selection
  const handleDaySelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onSelect(selectedDate);
    }
  };
  
  // Generate array of months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      value: i,
      label: format(date, "MMM", { locale }),
    };
  });
  
  // Generate array of years (10 years before/after current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // Handle month selection
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(monthIndex);
    setCalendarMonth(newDate);
    
    if (view === "month") {
      setView("day");
    }
  };
  
  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newDate = new Date(calendarMonth);
    newDate.setFullYear(year);
    setCalendarMonth(newDate);
    
    if (view === "year") {
      setView("month");
    }
  };
  
  // Handle navigation with arrow buttons
  const handlePrevMonth = () => {
    setCalendarMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCalendarMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  // Reset to day view when closing
  const handleClose = (open: boolean) => {
    if (!open) {
      setView("day");
    }
  };

  return (
    <Popover onOpenChange={handleClose}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2 border-gray-300"
          )}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>{format(date, "d MMM yyyy", { locale })}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3 border-b">
          <Tabs value={view} onValueChange={(v) => setView(v as "day" | "month" | "year")}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Hari</TabsTrigger>
              <TabsTrigger value="month">Bulan</TabsTrigger>
              <TabsTrigger value="year">Tahun</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-2">
          {view === "day" && (
            <>
              {/* Custom header to replace the default one */}
              <div className="flex items-center justify-between px-2 py-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handlePrevMonth}
                  type="button"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="sr-only">Previous month</span>
                </Button>
                <div className="text-sm font-medium">
                  {format(calendarMonth, "MMMM yyyy", { locale })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleNextMonth}
                  type="button"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span className="sr-only">Next month</span>
                </Button>
              </div>
              <Calendar
                mode="single"
                selected={date}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                onSelect={handleDaySelect}
                locale={locale}
                showOutsideDays
                fixedWeeks
                initialFocus
                classNames={{
                  head_row: "flex",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  nav: "hidden", // Hide the default navigation
                  caption: "hidden", // Hide the default caption (month/year header)
                  day: cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 w-9 p-0 aria-selected:opacity-100"
                  ),
                }}
              />
            </>
          )}
          
          {view === "month" && (
            <div className="grid grid-cols-3 gap-2 p-2">
              {months.map((month) => (
                <Button
                  key={month.value}
                  variant={calendarMonth.getMonth() === month.value ? "default" : "outline"}
                  className={cn(
                    calendarMonth.getMonth() === month.value ? "bg-[#FE8300] hover:bg-[#ED3400]" : ""
                  )}
                  onClick={() => handleMonthSelect(month.value)}
                  type="button"
                >
                  {month.label}
                </Button>
              ))}
            </div>
          )}
          
          {view === "year" && (
            <div className="grid grid-cols-4 gap-2 p-2 overflow-y-auto max-h-64">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={calendarMonth.getFullYear() === year ? "default" : "outline"}
                  className={cn(
                    calendarMonth.getFullYear() === year ? "bg-[#FE8300] hover:bg-[#ED3400]" : ""
                  )}
                  onClick={() => handleYearSelect(year)}
                  type="button"
                >
                  {year}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setCalendarMonth(today);
              onSelect(today);
              setView("day");
            }}
            type="button"
          >
            Hari ini
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setCalendarMonth(thisMonth);
              onSelect(thisMonth);
              setView("day");
            }}
            type="button"
          >
            Bulan ini
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              setCalendarMonth(lastYear);
              onSelect(lastYear);
              setView("day");
            }}
            type="button"
          >
            Tahun lalu
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}