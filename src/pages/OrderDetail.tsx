import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import {
  getOrderWithCustomerDetails,
  getOrderItems,
  updateOrderStatus,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";
import { cn } from "@/lib/utils";

// Define Order and OrderItem types based on your Firestore schema
type OrderStatus = "pending" | "processing" | "completed" | "canceled";

interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  created_at: Date;
}

interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  hasFullDetails?: boolean;
}

interface Order {
  id: string;
  business_id: string;
  customer: Customer;
  status: OrderStatus;
  shipping_method: "delivery" | "pickup";
  shipping_address?: string;
  city?: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: string;
  payment_status: "paid" | "unpaid";
  payment_reference?: string;
  notes?: string;
  item_count: number;
  tracking_number?: string;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  items?: OrderItem[];
}

// Skeleton component for loading state
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
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Fetch order data and customer details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Use the enhanced function to get order with customer details
        const orderData = await getOrderWithCustomerDetails(id);

        if (orderData) {
          setOrder(orderData as Order);
        } else {
          setError("Order not found");
        }
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to load order details");
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, toast]);

  // Fetch order items separately
  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!id || !order) return;

      try {
        setItemsLoading(true);

        const items = await getOrderItems(id);

        // Convert any Firestore timestamps to Date objects
        const processedItems = items.map((item) =>
          convertFirestoreData(item)
        ) as OrderItem[];

        setOrderItems(processedItems);

        // Also update the order object with items
        setOrder((prev) => (prev ? { ...prev, items: processedItems } : null));
      } catch (err: any) {
        console.error("Error fetching order items:", err);
        toast({
          title: "Warning",
          description: "Failed to load some order items",
          variant: "destructive",
        });
      } finally {
        setItemsLoading(false);
      }
    };

    fetchOrderItems();
  }, [id, order?.id, toast]);

  const handlePrint = () => {
    // Make sure we have the complete order with items before printing
    const orderWithItems = {
      ...order,
      items: orderItems,
    };

    // Set the complete order to state and open dialog
    setOrder(orderWithItems as Order);
    setIsPrintDialogOpen(true);
  };

  const handleCancelOrder = async (sendNote: boolean, note?: string) => {
    if (!order) return;

    try {
      // Update order status in Firestore
      await updateOrderStatus(
        order.id,
        "canceled",
        sendNote ? note : undefined
      );

      // Update local state
      setOrder({
        ...order,
        status: "canceled",
      });

      toast({
        title: "Order Canceled",
        description: `Order #${order.id.substring(0, 8)} has been canceled.${
          sendNote && note ? " A note has been sent to the customer." : ""
        }`,
      });

      setIsCancelDialogOpen(false);
    } catch (err: any) {
      console.error("Error canceling order:", err);
      toast({
        title: "Error",
        description: "Failed to cancel order",
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

  // Open status change dialog
  const handleOpenStatusDialog = () => {
    setIsStatusDialogOpen(true);
  };

  const handleUpdateStatus = async (
    newStatus: OrderStatus,
    sendNote: boolean,
    note?: string
  ) => {
    if (!order) return;

    try {
      // Update order status in Firestore
      await updateOrderStatus(order.id, newStatus, sendNote ? note : undefined);

      // Update local state
      setOrder({
        ...order,
        status: newStatus,
        // If status is completed, set completed_at
        completed_at:
          newStatus === "completed" ? new Date() : order.completed_at,
      });

      toast({
        title: "Status Updated",
        description: `Order #${order.id.substring(
          0,
          8
        )} status changed to ${newStatus}.${
          sendNote && note ? " A note has been sent to the customer." : ""
        }`,
      });

      // Close the dialog
      setIsStatusDialogOpen(false);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  // Loading skeleton for the order detail page
  if (loading) {
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
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
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

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-full">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-48 mt-2" />
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

                  <Separator className="my-3" />
                  <div>
                    <Skeleton className="h-5 w-28 mb-1" />
                    <Skeleton className="h-4 w-48" />
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
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
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

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          {error || "The order you're looking for doesn't exist."}
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
                    onClick={handleOpenStatusDialog}>
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
                  ) : orderItems.length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">
                      No items found for this order.
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
                              GHS {item.price?.toFixed(2) || "0.00"} ×{" "}
                              {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          GHS{" "}
                          {item.total?.toFixed(2) ||
                            (item.price * item.quantity).toFixed(2) ||
                            "0.00"}
                        </p>
                      </div>
                    ))
                  )}

                  <Separator />

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>GHS {order.subtotal?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Shipping</p>
                      <p>GHS {order.shipping_fee?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Tax</p>
                      <p>GHS {order.tax?.toFixed(2) || "0.00"}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <p>Total</p>
                      <p>GHS {order.total?.toFixed(2) || "0.00"}</p>
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
                    </div>
                  </div>
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
                  <p className="text-sm text-muted-foreground">
                    {order.customer?.email || "No email provided"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer?.phone || "No phone provided"}
                  </p>
                </div>

                {order.shipping_method === "delivery" && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Shipping Address
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address || "No address provided"}
                        {order.shipping_address && order.city ? ", " : ""}
                        {order.city || ""}
                      </p>
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
                    <p>GHS {order.subtotal?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Shipping</p>
                    <p>GHS {order.shipping_fee?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Tax</p>
                    <p>GHS {order.tax?.toFixed(2) || "0.00"}</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>GHS {order.total?.toFixed(2) || "0.00"}</p>
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
        order={{
          ...order,
          items: orderItems, // Ensure order items are passed to PrintOrderDialog
        }}
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
