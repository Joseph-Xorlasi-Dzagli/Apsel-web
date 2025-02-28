
import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/lib/data";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderStatsProps {
  orders: Order[];
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
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

export function OrderStats({ orders }: OrderStatsProps) {
  const isMobile = useIsMobile();

  // Calculate order stats
  const totalOrders = orders.length;
  
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  
  const processingOrders = orders.filter(
    (order) => order.status === "processing"
  ).length;
  
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  
  const canceledOrders = orders.filter(
    (order) => order.status === "canceled"
  ).length;

  // Calculate recent orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentOrders = orders.filter(
    (order) => new Date(order.date) >= thirtyDaysAgo
  ).length;

  const recentOrdersPercentage = totalOrders
    ? Math.round((recentOrders / totalOrders) * 100)
    : 0;

  return (
    <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-4 gap-6"}`}>
      <StatCard
        title="Total Orders"
        value={totalOrders.toString()}
        icon={<ShoppingBag className="h-6 w-6" />}
        description={`${recentOrders} orders in the last 30 days (${recentOrdersPercentage}%)`}
      />
      <StatCard
        title="Pending Orders"
        value={pendingOrders.toString()}
        icon={<Clock className="h-6 w-6" />}
        description="Waiting for confirmation"
      />
      <StatCard
        title="Completed Orders"
        value={completedOrders.toString()}
        icon={<CheckCircle className="h-6 w-6" />}
        description="Successfully delivered"
      />
      <StatCard
        title="Canceled Orders"
        value={canceledOrders.toString()}
        icon={<XCircle className="h-6 w-6" />}
        description="Orders that were canceled"
      />
    </div>
  );
}
