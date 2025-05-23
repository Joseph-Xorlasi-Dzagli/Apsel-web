// src/components/dashboard/RecentOrders.tsx
import { ArrowRight, BarChart3, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

export function RecentOrders() {
  const isMobile = useIsMobile();
  const { getRecentOrders, loading } = useDashboardData();
  const orders = getRecentOrders();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="status-completed">Completed</Badge>;
      case "pending":
        return <Badge className="status-pending">Pending</Badge>;
      case "processing":
        return <Badge className="status-processing">Processing</Badge>;
      case "canceled":
        return <Badge className="status-canceled">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <Card className="col-span-1 animate-in-slide">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest {orders.length} orders</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/orders">
            <span className="mr-1">View All</span>
            <ArrowRight size={14} />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex border-b pb-4 last:border-0 last:pb-0 hover:bg-gray-100 rounded-md p-2 transition-colors">
                <div className="w-full">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="font-medium text-sm hover:underline">
                        #{order.id.slice(-6)}
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">
                        GHS {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm">{order.customerName}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </Link>
            ))}

            {orders.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No recent orders found
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
