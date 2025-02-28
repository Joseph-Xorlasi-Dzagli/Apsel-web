
import { 
  ShoppingBag, 
  BarChart3, 
  PackageCheck, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Order, OrderStatus, sampleOrders, sampleTransactions } from "@/lib/data";

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

function SummaryCard({ title, value, description, icon, trend, trendValue }: SummaryCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <Card className="transition-all">
      <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'} flex flex-row items-center justify-between space-y-0`}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-brand-light rounded-md flex items-center justify-center text-brand">
          {icon}
        </div>
      </CardHeader>
      <CardContent className={isMobile ? 'pt-0' : ''}>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center">
            {trend && (
              <div 
                className={`mr-1 ${trend === 'up' ? 'text-status-completed' : trend === 'down' ? 'text-status-canceled' : 'text-muted-foreground'} flex items-center text-xs`}
              >
                {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : null}
                <span className="ml-1">{trendValue}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Get the current month orders and compare to last month
const getCurrentMonthOrderStats = (orders: Order[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  
  const lastMonthOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
  });
  
  const percentChange = lastMonthOrders.length 
    ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
    : 0;
  
  return {
    count: currentMonthOrders.length,
    percentChange: percentChange.toFixed(1),
    trend: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral'
  };
};

// Calculate total revenue
const getRevenueStats = (transactions: typeof sampleTransactions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const currentMonthRevenue = transactions
    .filter(transaction => {
      const transDate = new Date(transaction.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const lastMonthRevenue = transactions
    .filter(transaction => {
      const transDate = new Date(transaction.date);
      return transDate.getMonth() === lastMonth && transDate.getFullYear() === lastMonthYear;
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const percentChange = lastMonthRevenue 
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;
  
  return {
    total: currentMonthRevenue.toFixed(2),
    percentChange: percentChange.toFixed(1),
    trend: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral'
  };
};

export function SummaryCards() {
  const orderStats = getCurrentMonthOrderStats(sampleOrders);
  const revenueStats = getRevenueStats(sampleTransactions);
  
  const ordersByStatus = sampleOrders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = 0;
    }
    acc[order.status]++;
    return acc;
  }, {} as Record<OrderStatus, number>);
  
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-4 gap-6'} animate-in-slide`}>
      <SummaryCard
        title="Total Orders"
        value={orderStats.count.toString()}
        description="This month"
        icon={<ShoppingBag size={18} />}
        trend={orderStats.trend as 'up' | 'down' | 'neutral'}
        trendValue={`${orderStats.percentChange}%`}
      />
      <SummaryCard
        title="Revenue"
        value={`GHS ${revenueStats.total}`}
        description="This month"
        icon={<BarChart3 size={18} />}
        trend={revenueStats.trend as 'up' | 'down' | 'neutral'}
        trendValue={`${revenueStats.percentChange}%`}
      />
      <SummaryCard
        title="Completed Orders"
        value={(ordersByStatus.completed || 0).toString()}
        description="Ready for delivery"
        icon={<PackageCheck size={18} />}
      />
      <SummaryCard
        title="Pending Orders"
        value={(ordersByStatus.pending || 0).toString()}
        description="Need attention"
        icon={<AlertCircle size={18} />}
      />
    </div>
  );
}
