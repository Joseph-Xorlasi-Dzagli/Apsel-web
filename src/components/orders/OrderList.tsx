
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/data";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderListProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
  ordersPerPage: number;
}

export function OrderList({
  orders,
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
  ordersPerPage,
}: OrderListProps) {
  const isMobile = useIsMobile();

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {orders.length > 0 ? (
          <>
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      Order #{order.id}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <Link to={`/orders/${order.id}`}>
                    <Button size="icon" variant="ghost">
                      <ExternalLink size={16} />
                    </Button>
                  </Link>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items} items · {order.shippingMethod}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold">GHS {order.total.toFixed(2)}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
                  {Math.min(currentPage * ordersPerPage, totalOrders)} of{" "}
                  {totalOrders} orders
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                Order ID
              </th>
              <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                Customer
              </th>
              <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                Date
              </th>
              <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                Status
              </th>
              <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                Items
              </th>
              <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                Shipping
              </th>
              <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                Total
              </th>
              <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3 whitespace-nowrap">
                    {formatDate(order.date)}
                  </td>
                  <td className="p-3">{getStatusBadge(order.status)}</td>
                  <td className="p-3">{order.items}</td>
                  <td className="p-3 capitalize">{order.shippingMethod}</td>
                  <td className="p-3 text-right font-medium">
                    GHS {order.total.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <Link to={`/orders/${order.id}`}>
                      <Button size="icon" variant="ghost">
                        <ExternalLink size={16} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
            {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders}{" "}
            orders
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
