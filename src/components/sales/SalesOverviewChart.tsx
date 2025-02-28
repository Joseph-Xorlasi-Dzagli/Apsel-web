
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DateRange } from 'react-day-picker';
import { sampleTransactions } from '@/lib/data';
import { format, differenceInDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

interface SalesOverviewChartProps {
  dateRange: DateRange | undefined;
}

type ChartMode = 'revenue' | 'orders' | 'comparison';

export function SalesOverviewChart({ dateRange }: SalesOverviewChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('revenue');
  const [chartData, setChartData] = useState<any[]>([]);
  
  const getInterval = () => {
    if (!dateRange?.from || !dateRange?.to) return 'day';
    
    const daysDiff = differenceInDays(dateRange.to, dateRange.from);
    
    if (daysDiff <= 31) return 'day';
    if (daysDiff <= 90) return 'week';
    return 'month';
  };
  
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    const interval = getInterval();
    const filteredTransactions = sampleTransactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date >= dateRange.from! && date <= dateRange.to!;
    });
    
    let dates: Date[] = [];
    if (interval === 'day') {
      dates = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    } else if (interval === 'week') {
      dates = eachWeekOfInterval({ start: dateRange.from, end: dateRange.to });
    } else {
      dates = eachMonthOfInterval({ start: dateRange.from, end: dateRange.to });
    }
    
    const data = dates.map(date => {
      let periodStart, periodEnd;
      
      if (interval === 'day') {
        periodStart = startOfDay(date);
        periodEnd = endOfDay(date);
      } else if (interval === 'week') {
        periodStart = startOfWeek(date);
        periodEnd = endOfWeek(date);
      } else {
        periodStart = startOfMonth(date);
        periodEnd = endOfMonth(date);
      }
      
      const periodTransactions = filteredTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= periodStart && transactionDate <= periodEnd;
      });
      
      const revenue = periodTransactions
        .filter(t => t.type === 'sale')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const refunds = periodTransactions
        .filter(t => t.type === 'refund')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const uniqueOrders = new Set(periodTransactions.map(t => t.orderId)).size;
      
      const formattedDate = interval === 'day' 
        ? format(date, 'MMM d') 
        : interval === 'week' 
          ? `W${format(date, 'w')}`
          : format(date, 'MMM yyyy');
      
      return {
        date: formattedDate,
        revenue,
        refunds,
        orders: uniqueOrders,
        netRevenue: revenue - refunds,
      };
    });
    
    setChartData(data);
  }, [dateRange, chartMode]);
  
  const renderChart = () => {
    if (chartMode === 'revenue') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRefunds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5755e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f5755e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B5CC" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00B5CC" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `GHS ${value}`}
              width={80}
            />
            <Tooltip 
              formatter={(value: any) => [`GHS ${value.toFixed(2)}`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              name="Gross Revenue"
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="refunds" 
              stroke="#f5755e" 
              fillOpacity={1} 
              fill="url(#colorRefunds)" 
              name="Refunds"
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="netRevenue" 
              stroke="#00B5CC" 
              fillOpacity={1} 
              fill="url(#colorNet)" 
              name="Net Revenue"
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else if (chartMode === 'orders') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis 
              width={40}
            />
            <Tooltip 
              formatter={(value: any) => [`${value}`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#00B5CC" 
              name="Orders"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else { // comparison mode
      // Get last year's data for comparison (mock data)
      const lastYearData = chartData.map(item => ({
        ...item,
        lastYearRevenue: item.revenue * (0.7 + Math.random() * 0.5) // Random data between 70-120% of current value
      }));
      
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lastYearData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `GHS ${value}`}
              width={80}
            />
            <Tooltip 
              formatter={(value: any) => [`GHS ${value.toFixed(2)}`, '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00B5CC" 
              name="This Period"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="lastYearRevenue" 
              stroke="#8884d8" 
              name="Previous Period"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            {chartMode === 'revenue' 
              ? 'Revenue, refunds and net sales' 
              : chartMode === 'orders' 
                ? 'Order volume over time' 
                : 'Compare with previous period'}
          </CardDescription>
        </div>
        <Tabs defaultValue="revenue" onValueChange={(value) => setChartMode(value as ChartMode)}>
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
