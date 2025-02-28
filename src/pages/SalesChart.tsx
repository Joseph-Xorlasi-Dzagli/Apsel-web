
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/sales/DateRangePicker";
import { SalesOverviewChart } from "@/components/sales/SalesOverviewChart";
import { SalesByChannelChart } from "@/components/sales/SalesByChannelChart";
import { SalesByCategoryChart } from "@/components/sales/SalesByCategoryChart";
import { SalesMetrics } from "@/components/sales/SalesMetrics";
import { useIsMobile } from "@/hooks/use-mobile";
import { DateRange } from "react-day-picker";
import { addDays, format, subDays, subMonths } from "date-fns";

const SalesChartPage = () => {
  const isMobile = useIsMobile();
  const today = new Date();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(today, 30),
    to: today,
  });
  
  const [timeRange, setTimeRange] = useState<"last30" | "last90" | "lastYear" | "custom">("last30");
  
  const handleTimeRangeChange = (value: string) => {
    const newValue = value as "last30" | "last90" | "lastYear" | "custom";
    setTimeRange(newValue);
    
    // Update date range based on selection
    if (newValue === "last30") {
      setDate({
        from: subDays(today, 30),
        to: today,
      });
    } else if (newValue === "last90") {
      setDate({
        from: subDays(today, 90),
        to: today,
      });
    } else if (newValue === "lastYear") {
      setDate({
        from: subMonths(today, 12),
        to: today,
      });
    }
    // If custom, leave the date range as is
  };
  
  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
  };
  
  const getDateRangeString = () => {
    if (!date?.from) return "Select date range";
    if (!date?.to) return `From ${format(date.from, "PPP")}`;
    return `${format(date.from, "PPP")} - ${format(date.to, "PPP")}`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Chart</h1>
        <p className="text-muted-foreground">Detailed sales analytics and trends.</p>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              {getDateRangeString()}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Tabs defaultValue="last30" onValueChange={handleTimeRangeChange} value={timeRange}>
              <TabsList>
                <TabsTrigger value="last30">30 Days</TabsTrigger>
                <TabsTrigger value="last90">90 Days</TabsTrigger>
                <TabsTrigger value="lastYear">Year</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DatePickerWithRange date={date} onDateChange={handleDateChange} />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 md:p-6">
          <div className="space-y-6">
            <SalesMetrics dateRange={date} />
            
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-6'}`}>
              <div className="col-span-2">
                <SalesOverviewChart dateRange={date} />
              </div>
              <div className="col-span-1">
                <SalesByChannelChart dateRange={date} />
              </div>
            </div>
            
            <SalesByCategoryChart dateRange={date} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesChartPage;
