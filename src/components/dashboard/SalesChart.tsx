// src/components/dashboard/SalesChart.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardData, DashboardTimeFrame } from "@/hooks/useDashboardData";
import { Loader2 } from "lucide-react";

export function SalesChart() {
  const [timeframe, setTimeframe] = useState<DashboardTimeFrame>("week");
  const isMobile = useIsMobile();
  const { getRevenueByTimeframe, loading } = useDashboardData();

  const chartData = getRevenueByTimeframe(timeframe);

  const formatTooltipValue = (value: number) => {
    return [`GHS ${value.toFixed(2)}`, "Revenue"];
  };

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
          onValueChange={(value) => setTimeframe(value as DashboardTimeFrame)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading chart data...</span>
            </div>
          </div>
        ) : (
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
                  <Tooltip formatter={formatTooltipValue} />
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
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
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
                  <Tooltip formatter={formatTooltipValue} />
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
        )}
      </CardContent>
    </Card>
  );
}
