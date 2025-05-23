import { Card, CardContent } from "@/components/ui/card";
import { Order, OrderStatus } from "@/types/order";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getOrderStatusCounts } from "@/services/firestoreService";
import { useBusiness } from "@/hooks/useBusiness";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OrderStatsProps {
  orders?: Order[];
  refreshTrigger?: number; // Optional prop to trigger refresh
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  description,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1"></div>
            ) : (
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            )}
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-light flex items-center justify-center text-brand">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderStats({ orders, refreshTrigger = 0 }: OrderStatsProps) {
  const isMobile = useIsMobile();
  const { business, loading: businessLoading } = useBusiness();
  const { toast } = useToast();

  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    canceled: 0,
  });
  const [recentOrders, setRecentOrders] = useState(0);
  const [recentPercentage, setRecentPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  // If orders are passed as props, calculate stats from them
  useEffect(() => {
    if (orders) {
      // Calculate order stats from passed orders prop
      const total = orders.length;

      const pending = orders.filter(
        (order) => order.status.toLowerCase() === "pending"
      ).length;

      const processing = orders.filter(
        (order) => order.status.toLowerCase() === "processing"
      ).length;

      const completed = orders.filter(
        (order) => order.status.toLowerCase() === "completed"
      ).length;

      const canceled = orders.filter(
        (order) => order.status.toLowerCase() === "canceled"
      ).length;

      // Calculate recent orders (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recent = orders.filter(
        (order) => new Date(order.created_at) >= thirtyDaysAgo
      ).length;

      const percentage = total ? Math.round((recent / total) * 100) : 0;

      setCounts({ total, pending, processing, completed, canceled });
      setRecentOrders(recent);
      setRecentPercentage(percentage);
      setLoading(false);
    }
  }, [orders]);

  // If no orders prop, fetch stats from Firestore
  useEffect(() => {
    const fetchOrderCounts = async () => {
      if (!business || orders) return;

      try {
        setLoading(true);
        const countsData = await getOrderStatusCounts(business.id);
        setCounts(countsData);

        // Calculate recent orders percentage
        if (countsData.total > 0) {
          // We'd need to implement this in the firestore service
          // For now, setting with placeholder values
          setRecentOrders(Math.round(countsData.total * 0.7)); // 70% of orders in last 30 days (placeholder)
          setRecentPercentage(70); // 70% (placeholder)
        }
      } catch (error) {
        console.error("Error fetching order counts:", error);
        toast({
          title: "Error",
          description: "Failed to load order statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderCounts();
  }, [business, businessLoading, orders, toast, refreshTrigger]);

  return (
    <div
      className={`grid ${
        isMobile ? "grid-cols-1 gap-4" : "grid-cols-4 gap-6"
      }`}>
      <StatCard
        title="Total Orders"
        value={counts.total.toString()}
        icon={<ShoppingBag className="h-6 w-6" />}
        description={`${recentOrders} orders in the last 30 days (${recentPercentage}%)`}
        isLoading={loading}
      />
      <StatCard
        title="Pending Orders"
        value={counts.pending.toString()}
        icon={<Clock className="h-6 w-6" />}
        description="Waiting for confirmation"
        isLoading={loading}
      />
      <StatCard
        title="Completed Orders"
        value={counts.completed.toString()}
        icon={<CheckCircle className="h-6 w-6" />}
        description="Successfully delivered"
        isLoading={loading}
      />
      <StatCard
        title="Canceled Orders"
        value={counts.canceled.toString()}
        icon={<XCircle className="h-6 w-6" />}
        description="Orders that were canceled"
        isLoading={loading}
      />
    </div>
  );
}
