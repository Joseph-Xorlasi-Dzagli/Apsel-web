// src/components/dashboard/SummaryCards.tsx
import {
  ShoppingBag,
  BarChart3,
  PackageCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardData } from "@/hooks/useDashboardData";

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
}: SummaryCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="transition-all">
      <CardHeader
        className={`${
          isMobile ? "pb-2" : "pb-3"
        } flex flex-row items-center justify-between space-y-0`}>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-brand-light rounded-md flex items-center justify-center text-brand">
          {icon}
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "pt-0" : ""}>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center">
            {trend && trend !== "neutral" && trendValue && (
              <div
                className={`mr-1 ${
                  trend === "up"
                    ? "text-status-completed"
                    : trend === "down"
                    ? "text-status-canceled"
                    : "text-muted-foreground"
                } flex items-center text-xs`}>
                {trend === "up" ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span className="ml-1">{trendValue}</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const { getOrderStats, getRevenueStats, getOrderStatusStats, loading } =
    useDashboardData();

  const isMobile = useIsMobile();

  // Get stats from the dashboard hook
  const orderStats = getOrderStats();
  const revenueStats = getRevenueStats();
  const statusStats = getOrderStatusStats();

  if (loading) {
    return (
      <div
        className={`grid ${
          isMobile ? "grid-cols-1 gap-4" : "grid-cols-5 gap-6"
        } animate-in-slide`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="transition-all">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        isMobile ? "grid-cols-1 gap-4" : "grid-cols-5 gap-6"
      } animate-in-slide`}>
      <SummaryCard
        title="Total Orders"
        value={orderStats.count.toString()}
        description="This month"
        icon={<ShoppingBag size={18} />}
        trend={orderStats.trend as "up" | "down" | "neutral"}
        trendValue={`${orderStats.percentChange}%`}
      />
      <SummaryCard
        title="Revenue"
        value={`GHS ${revenueStats.total}`}
        description="This month"
        icon={<BarChart3 size={18} />}
        trend={revenueStats.trend as "up" | "down" | "neutral"}
        trendValue={`${revenueStats.percentChange}%`}
      />
      <SummaryCard
        title="Completed Orders"
        value={statusStats.completed.toString()}
        description="Ready for delivery"
        icon={<PackageCheck size={18} />}
      />
      <SummaryCard
        title="Pending Orders"
        value={statusStats.pending.toString()}
        description="Need attention"
        icon={<AlertCircle size={18} />}
      />
      <SummaryCard
        title="Canceled Orders"
        value={statusStats.canceled.toString()}
        description="Need attention"
        icon={<AlertCircle size={18} />}
      />
    </div>
  );
}
