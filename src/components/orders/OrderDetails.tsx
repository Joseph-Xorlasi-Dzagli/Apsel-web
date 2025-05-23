import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Printer,
  Truck,
  Package,
  CheckCircle,
  AlarmClock,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { PrintOrderDialog } from "@/components/orders/PrintOrderDialog";
import { OrderStatusDialog } from "@/components/orders/OrderStatusDialog";
import { useOrders } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";

// Skeleton component for loading UI
const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Use the custom orders hook
  const {
    getOrderById,
    orderItems,
    loading,
    itemsLoading,
    updateStatus,
    cancelOrder,
    fetchOrderItems,
  } = useOrders();

  

  const [order, setOrder] = useState<any>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [orderForPrint, setOrderForPrint] = useState<any>(null);

  // Fetch order data when component mounts
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        const orderData = await getOrderById(id);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      }
    };

    fetchOrder();
  }, [id, getOrderById, toast]);

  // Explicitly fetch order items when order changes
  useEffect(() => {
    const getItems = async () => {
      if (id && order) {
        await fetchOrderItems(id);
      }
    };

    getItems();
  }, [id, order, fetchOrderItems]);

  // Handler functions
  const handlePrint = () => {
    // Prepare a complete order object with items for printing
    const printData = {
      ...order,
      items: orderItems || [],
    };

    setOrderForPrint(printData);
    setIsPrintDialogOpen(true);
  };

  const handleCancelOrder = async (sendNote: boolean, note?: string) => {
    if (!order || !id) return;

    try {
      await cancelOrder(id, sendNote ? note : undefined);

      // Update local state
      setOrder({
        ...order,
        status: "canceled",
      });

      toast({
        title: "Order Canceled",
        description: `Order #${id.substring(0, 8)} has been canceled.${
          sendNote && note ? " A note has been sent to the customer." : ""
        }`,
      });

      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (
    newStatus: OrderStatus,
    sendNote: boolean,
    note?: string
  ) => {
    if (!order || !id) return;

    try {
      await updateStatus(id, newStatus, sendNote ? note : undefined);

      // Update local state
      setOrder({
        ...order,
        status: newStatus,
        // If status is completed, set completed_at
        ...(newStatus === "completed" ? { completed_at: new Date() } : {}),
      });

      toast({
        title: "Status Updated",
        description: `Order #${id.substring(
          0,
          8
        )} status has been changed to ${newStatus}.`,
      });

      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-status-completed" />;
      case "pending":
        return <AlarmClock className="h-5 w-5 text-status-pending" />;
      case "processing":
        return <Package className="h-5 w-5 text-status-processing" />;
      case "canceled":
        return <XCircle className="h-5 w-5 text-status-canceled" />;
      default:
        return null;
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";

    // Handle different date formats
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === "string") {
      dateObj = new Date(date);
    } else if (date.toDate && typeof date.toDate === "function") {
      dateObj = date.toDate();
    } else if (date.seconds && date.nanoseconds) {
      dateObj = new Date(date.seconds * 1000);
    } else {
      return "Invalid date";
    }

    // Format the date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(dateObj);
  };

  // Function to safely format numbers
  const safeToFixed = (value: any, decimals = 2): string => {
    if (value == null) return "0.00";

    const number = typeof value === "number" ? value : Number(value);
    if (isNaN(number)) return "0.00";

    try {
      return number.toFixed(decimals);
    } catch (err) {
      console.error("Error formatting number:", err);
      return "0.00";
    }
  };

  // Loading skeleton UI
  if (loading && !order) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <div
          className={`grid ${
            isMobile ? "grid-cols-1 gap-6" : "grid-cols-3 gap-6"
          }`}>
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-12 mb-4" />

                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))}

                    <Separator className="my-3" />

                    <div className="space-y-2 pt-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  <Skeleton className="h-10 w-full mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>

                  <div className="p-3 border rounded-md flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order #{order.id.substring(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div
        className={`grid ${
          isMobile ? "grid-cols-1 gap-6" : "grid-cols-3 gap-6"
        }`}>
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cart</CardTitle>
                  <CardDescription>Order details and items</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Badge
                    className={`status-${order.status} cursor-pointer`}
                    onClick={() => setIsStatusDialogOpen(true)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Items</h3>

                  {itemsLoading ? (
                    // Blinking skeleton items
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 py-3 border-b">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))}
                    </>
                  ) : !orderItems || orderItems.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-muted-foreground">No items found</p>
                    </div>
                  ) : (
                    orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-md border">
                            <AvatarImage src={item.image} />
                            <AvatarFallback className="rounded-md">
                              {item.name?.substring(0, 2) || "IT"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              GHS {safeToFixed(item.price)} ×{" "}
                              {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          GHS{" "}
                          {safeToFixed(
                            item.total || item.price * item.quantity
                          )}
                        </p>
                      </div>
                    ))
                  )}

                  <Separator />

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>GHS {safeToFixed(order.subtotal)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Shipping</p>
                      <p>GHS {safeToFixed(order.shipping_fee)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Tax</p>
                      <p>GHS {safeToFixed(order.tax)}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <p>Total</p>
                      <p>GHS {safeToFixed(order.total)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.status !== "canceled" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-start gap-4">
                    <div className="p-2 bg-brand-light rounded-full">
                      <Truck className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">
                        {order.status === "completed"
                          ? "Delivered"
                          : order.status === "processing"
                          ? "Preparing for Shipping"
                          : "Pending"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_method === "delivery"
                          ? "Your order will be delivered to your address."
                          : "Your order will be available for pickup at our store."}
                      </p>
                      {order.status === "completed" && order.completed_at && (
                        <p className="text-sm text-status-completed mt-2">
                          Delivered on {formatDate(order.completed_at)}
                        </p>
                      )}
                      {order.tracking_number && (
                        <p className="text-sm mt-2">
                          Tracking Number:{" "}
                          <span className="font-mono">
                            {order.tracking_number}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">Order Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {order.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {order.customer?.name
                        ? order.customer.name.substring(0, 2)
                        : "CU"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {order.customer?.name || "Customer"}
                    </p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div>
                  <p className="text-sm font-medium mb-1">Contact Details</p>
                  {order.customer?.email ? (
                    <p className="text-sm text-muted-foreground">
                      {order.customer.email}
                    </p>
                  ) : null}
                  {order.customer?.phone ? (
                    <p className="text-sm text-muted-foreground">
                      {order.customer.phone}
                    </p>
                  ) : null}
                  {!order.customer?.email && !order.customer?.phone && (
                    <p className="text-sm text-muted-foreground">
                      No contact details provided
                    </p>
                  )}
                </div>

                {order.shipping_method === "delivery" && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Shipping Address
                      </p>
                      {order.shipping_address ? (
                        <p className="text-sm text-muted-foreground">
                          {order.shipping_address}
                          {order.shipping_address && order.city ? ", " : ""}
                          {order.city || ""}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No address provided
                        </p>
                      )}
                    </div>
                  </>
                )}

                <Button
                  className="w-full mt-2 text-destructive hover:bg-destructive/10"
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(true)}
                  disabled={
                    order.status === "canceled" || order.status === "completed"
                  }>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Payment Method</p>
                  <Badge variant="outline" className="font-normal">
                    {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                  </Badge>
                </div>

                <div className="p-3 border rounded-md flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {order.payment_method || "Payment Method"}
                    </p>
                    {order.payment_reference && (
                      <p className="text-xs text-muted-foreground">
                        Ref: {order.payment_reference}
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>GHS {safeToFixed(order.subtotal)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Shipping</p>
                    <p>GHS {safeToFixed(order.shipping_fee)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Tax</p>
                    <p>GHS {safeToFixed(order.tax)}</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>GHS {safeToFixed(order.total)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <CancelOrderDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelOrder}
        orderId={order?.id || ""}
      />

      {/* Print Order Dialog */}
      <PrintOrderDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        order={
          orderForPrint || {
            ...order,
            items: orderItems || [],
          }
        }
      />

      {/* Status Change Dialog */}
      <OrderStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleUpdateStatus}
        orderId={order.id}
      />
    </div>
  );
};

export default OrderDetail;
