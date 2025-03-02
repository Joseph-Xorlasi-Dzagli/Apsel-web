
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
import { sampleTransactions } from "@/lib/data";
import { TrendingUp, BarChart3, ArrowRight } from "lucide-react";

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
  
  // Calculate transaction totals for different time periods
  const calculateTransactionTotal = (period: "daily" | "weekly" | "monthly" | "yearly" | "custom") => {
    let startDate: Date;
    const now = new Date();
    
    switch (period) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "yearly":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        if (date?.from) {
          startDate = date.from;
        } else {
          startDate = new Date(0);
        }
        break;
      default:
        startDate = new Date(0);
    }
    
    const endDate = period === "custom" && date?.to ? date.to : now;
    
    const filteredTransactions = sampleTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    const total = filteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'sale' ? transaction.amount : 0);
    }, 0);
    
    return total.toFixed(2);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Chart</h1>
        <p className="text-muted-foreground">Detailed sales analytics and trends.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-brand-light border-brand/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily</p>
                <h3 className="text-2xl font-bold mt-1">GHS {calculateTransactionTotal("daily")}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-light border-brand/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly</p>
                <h3 className="text-2xl font-bold mt-1">GHS {calculateTransactionTotal("weekly")}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-light border-brand/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly</p>
                <h3 className="text-2xl font-bold mt-1">GHS {calculateTransactionTotal("monthly")}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-brand-light border-brand/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Yearly</p>
                <h3 className="text-2xl font-bold mt-1">GHS {calculateTransactionTotal("yearly")}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Custom Period Total</CardTitle>
          <CardDescription>Define a custom date range to view transaction totals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
            <div className="w-full sm:w-auto">
              <DatePickerWithRange date={date} onDateChange={handleDateChange} />
            </div>
            <div className="flex items-center gap-2 bg-brand-light p-3 rounded-lg">
              <span className="text-sm font-medium whitespace-nowrap">Period Total:</span>
              <ArrowRight className="h-4 w-4 text-brand" />
              <span className="text-xl font-bold">GHS {calculateTransactionTotal("custom")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesChartPage;
