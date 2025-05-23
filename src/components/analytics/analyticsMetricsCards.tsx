import {
  BarChart3,
  ShoppingBag,
  CreditCard,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  loading?: boolean;
}

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  loading = false,
}: MetricCardProps) {
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
        {loading ? (
          <div className="h-8 w-20 bg-muted animate-pulse rounded-md"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(description || trend) && (
              <div className="flex items-center">
                {trend && trend !== "neutral" && (
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
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function AnalyticsMetricsCards() {
  const { loading, metrics, filters } = useAnalytics();
  const isMobile = useIsMobile();

  // Format data for display
  const formatCurrency = (value: number) => {
    return `GHS ${value.toFixed(2)}`;
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "-";
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <div
      className={`grid ${
        isMobile ? "grid-cols-1 gap-4" : "grid-cols-4 gap-6"
      } animate-in-slide`}>
      <MetricCard
        title="Total Revenue"
        value={loading ? "—" : formatCurrency(metrics.totalRevenue.value)}
        description={`${filters.dateRange.name}`}
        icon={<BarChart3 size={18} />}
        trend={metrics.totalRevenue.trend}
        trendValue={formatPercent(metrics.totalRevenue.percentChange)}
        loading={loading}
      />
      <MetricCard
        title="Order Count"
        value={loading ? "—" : metrics.orderCount.value.toString()}
        description={`${filters.dateRange.name}`}
        icon={<ShoppingBag size={18} />}
        trend={metrics.orderCount.trend}
        trendValue={formatPercent(metrics.orderCount.percentChange)}
        loading={loading}
      />
      <MetricCard
        title="Average Order Value"
        value={loading ? "—" : formatCurrency(metrics.averageOrderValue.value)}
        description={`${filters.dateRange.name}`}
        icon={<CreditCard size={18} />}
        trend={metrics.averageOrderValue.trend}
        trendValue={formatPercent(metrics.averageOrderValue.percentChange)}
        loading={loading}
      />
      <MetricCard
        title="Refund Rate"
        value={loading ? "—" : `${metrics.refundRate.value.toFixed(1)}%`}
        description={`${filters.dateRange.name}`}
        icon={<RefreshCcw size={18} />}
        trend={
          metrics.refundRate.trend === "up"
            ? "down"
            : metrics.refundRate.trend === "down"
            ? "up"
            : "neutral"
        } // Inverse the trend since lower refund rate is better
        trendValue={formatPercent(
          metrics.refundRate.percentChange
            ? -metrics.refundRate.percentChange
            : null
        )}
        loading={loading}
      />
    </div>
  );
}
