
import { Card, CardContent } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { sampleTransactions } from "@/lib/data";
import { TrendingDown, TrendingUp, CreditCard, Users, ShoppingBag, BarChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalesMetricsProps {
  dateRange: DateRange | undefined;
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  percentage: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, trend, percentage, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-light flex items-center justify-center text-brand">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <TrendingUp className="mr-2 h-4 w-4 text-status-completed" />
          ) : trend === 'down' ? (
            <TrendingDown className="mr-2 h-4 w-4 text-status-canceled" />
          ) : null}
          <span className={trend === 'up' ? 'text-status-completed' : trend === 'down' ? 'text-status-canceled' : 'text-muted-foreground'}>
            {percentage}
          </span>
          <span className="ml-1 text-muted-foreground">vs. previous period</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesMetrics({ dateRange }: SalesMetricsProps) {
  const isMobile = useIsMobile();
  
  // Filter transactions based on date range
  const getFilteredTransactions = () => {
    if (!dateRange?.from) return [];
    
    return sampleTransactions.filter(transaction => {
      const date = new Date(transaction.date);
      if (dateRange.from && dateRange.to) {
        return date >= dateRange.from && date <= dateRange.to;
      } else if (dateRange.from) {
        return date >= dateRange.from;
      }
      return false;
    });
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Calculate metrics
  const totalRevenue = filteredTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRefunds = filteredTransactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const orderCount = new Set(filteredTransactions.map(t => t.orderId)).size;
  
  const uniqueCustomers = new Set(filteredTransactions.map(t => t.customerName)).size;
  
  // For demonstration purposes, calculate random trends
  const getRandomTrend = () => {
    const random = Math.random();
    if (random > 0.7) return 'down';
    if (random > 0.3) return 'up';
    return 'neutral';
  };
  
  const getRandomPercentage = (trend: string) => {
    const value = (Math.random() * 20).toFixed(1);
    return trend === 'neutral' ? '0.0%' : `${value}%`;
  };
  
  const revenueTrend = getRandomTrend();
  const revenuePercentage = getRandomPercentage(revenueTrend);
  
  const refundTrend = getRandomTrend();
  const refundPercentage = getRandomPercentage(refundTrend);
  
  const orderTrend = getRandomTrend();
  const orderPercentage = getRandomPercentage(orderTrend);
  
  const customerTrend = getRandomTrend();
  const customerPercentage = getRandomPercentage(customerTrend);
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-4 gap-6'}`}>
      <MetricCard
        title="Total Revenue"
        value={`GHS ${totalRevenue.toFixed(2)}`}
        trend={revenueTrend as 'up' | 'down' | 'neutral'}
        percentage={revenuePercentage}
        icon={<BarChart className="h-6 w-6" />}
      />
      <MetricCard
        title="Total Refunds"
        value={`GHS ${totalRefunds.toFixed(2)}`}
        trend={refundTrend === 'up' ? 'down' : refundTrend === 'down' ? 'up' : 'neutral' as 'up' | 'down' | 'neutral'}
        percentage={refundPercentage}
        icon={<CreditCard className="h-6 w-6" />}
      />
      <MetricCard
        title="Total Orders"
        value={orderCount.toString()}
        trend={orderTrend as 'up' | 'down' | 'neutral'}
        percentage={orderPercentage}
        icon={<ShoppingBag className="h-6 w-6" />}
      />
      <MetricCard
        title="Unique Customers"
        value={uniqueCustomers.toString()}
        trend={customerTrend as 'up' | 'down' | 'neutral'}
        percentage={customerPercentage}
        icon={<Users className="h-6 w-6" />}
      />
    </div>
  );
}
