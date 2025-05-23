import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";

export function DateRangePicker() {
  const { filters, defaultDateRanges, updateDateRange } = useAnalytics();
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Update the picker when the filter date range changes
  useEffect(() => {
    // Only set the date range if filters and dateRange are defined
    if (filters?.dateRange?.startDate && filters?.dateRange?.endDate) {
      setDateRange({
        from: filters.dateRange.startDate,
        to: filters.dateRange.endDate,
      });
    }
  }, [filters?.dateRange]);

  // Handle predefined date range selection
  const handleDateRangeSelect = (rangeName: string) => {
    if (!defaultDateRanges) return;

    const selectedRange = defaultDateRanges.find(
      (range) => range.name === rangeName
    );
    if (selectedRange) {
      updateDateRange(selectedRange);
      setIsOpen(false);
    }
  };

  // Handle custom date range selection
  const handleCustomDateRange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range?.from && range?.to) {
      const startDate = new Date(range.from);
      // Set start time to beginning of day
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(range.to);
      // Set end time to end of day
      endDate.setHours(23, 59, 59, 999);

      updateDateRange({
        name: "Custom Range",
        startDate,
        endDate,
      });
    }
  };

  // If the data isn't loaded yet, show a loading state
  if (!filters?.dateRange || !defaultDateRanges) {
    return (
      <div className="grid gap-2">
        <Button
          id="date"
          variant={"outline"}
          className="justify-start text-left w-full md:w-auto"
          disabled>
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="w-24 h-4 bg-muted rounded-md animate-pulse"></span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="justify-start text-left w-full md:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateRange.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="space-y-2">
              {defaultDateRanges.map((range) => (
                <Button
                  key={range.name}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => handleDateRangeSelect(range.name)}>
                  {range.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-3 border-t">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Custom Range</h4>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleCustomDateRange}
                numberOfMonths={isMobile ? 1 : 2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
