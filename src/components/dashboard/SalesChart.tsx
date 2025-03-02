
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { sampleTransactions, getRevenueByTimeframe } from '@/lib/data';

type TimeFrame = 'week' | 'month' | 'year';

const formatDate = (dateString: string, timeframe: TimeFrame) => {
  const date = new Date(dateString);
  
  switch (timeframe) {
    case 'week':
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    case 'month':
      return new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date);
    case 'year':
      return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    default:
      return dateString;
  }
};

const prepareChartData = (timeframe: TimeFrame) => {
  const revenueData = getRevenueByTimeframe(
    sampleTransactions,
    timeframe === 'week' ? 'day' : timeframe === 'month' ? 'day' : 'month'
  );
  
  const now = new Date();
  let startDate: Date;
  let dateKeys: string[] = [];
  
  // Generate date keys based on timeframe
  if (timeframe === 'week') {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dateKeys.push(date.toISOString().split('T')[0]);
    }
  } else if (timeframe === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const dayCount = endDate.getDate();
    
    for (let i = 1; i <= dayCount; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), i);
      dateKeys.push(date.toISOString().split('T')[0]);
    }
  } else {
    // Year view - last 12 months
    startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 11);
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      dateKeys.push(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
    }
  }
  
  // Create chart data with dates and revenues
  return dateKeys.map(key => {
    return {
      date: key,
      revenue: revenueData[key] || 0,
      label: formatDate(key, timeframe)
    };
  });
};

export function SalesChart() {
  const [timeframe, setTimeframe] = useState<TimeFrame>('week');
  const [chartData, setChartData] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setChartData(prepareChartData(timeframe));
  }, [timeframe]);
  
  return (
    <Card className="col-span-2 animate-in-slide">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Overview (GHS)</CardTitle>
          <CardDescription>
            {timeframe === "week"
              ? "Revenue for the last 7 days"
              : timeframe === "month"
              ? "Revenue for the current month"
              : "Revenue for the last 12 months"}
          </CardDescription>
        </div>
        <Tabs
          defaultValue="week"
          onValueChange={(value) => setTimeframe(value as TimeFrame)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === "year" ? (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  height={40}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value) => [`GHS ${value}`, "Revenue"]}
                  labelFormatter={(value) => `${value}`}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--brand))"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--brand))"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--brand))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  height={40}
                  dy={30}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  dx={-10}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  formatter={(value) => [`GHS ${value}`, "Revenue"]}
                  labelFormatter={(value) => `${value}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--brand))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
