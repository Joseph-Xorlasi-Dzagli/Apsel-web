
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Order, sampleOrders, sampleProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Printer,
  ExternalLink,
  Truck,
  Package,
  CheckCircle,
  AlarmClock,
  XCircle,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { PrintOrderDialog } from "@/components/orders/PrintOrderDialog";

// Helper function to generate random order items
const generateOrderItems = (orderId: string) => {
  const randomCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const items = [];
  
  // Find the order to get the total
  const order = sampleOrders.find(o => o.id === orderId);
  if (!order) return [];
  
  // Get random products to assign to this order
  const availableProducts = [...sampleProducts];
  let remainingTotal = order.total * 0.85; // Assume 15% goes to shipping & fees
  
  for (let i = 0; i < randomCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableProducts.length);
    const product = availableProducts[randomIndex];
    
    if (product) {
      const quantity = Math.floor(Math.random() * 2) + 1;
      const itemTotal = product.price * quantity;
      
      // Adjust to make sure we don't exceed the order total
      const adjustedItemTotal = i === randomCount - 1 ? remainingTotal : Math.min(itemTotal, remainingTotal * 0.7);
      const adjustedPrice = adjustedItemTotal / quantity;
      
      items.push({
        id: `${orderId}-item-${i}`,
        productId: product.id,
        name: product.name,
        price: adjustedPrice,
        quantity,
        total: adjustedItemTotal,
        image: product.image
      });
      
      remainingTotal -= adjustedItemTotal;
      
      // Remove this product so we don't select it again
      availableProducts.splice(randomIndex, 1);
    }
  }
  
  return items;
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingFee, setShippingFee] = useState(0);
  const [tax, setTax] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      // Find the order in our sample data
      const foundOrder = sampleOrders.find(order => order.id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Generate random order items
        const items = generateOrderItems(id);
        setOrderItems(items);
        
        // Calculate shipping fee and tax
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const calculatedShippingFee = foundOrder.total * 0.1; // 10% of total
        const calculatedTax = foundOrder.total * 0.05; // 5% of total
        
        setShippingFee(calculatedShippingFee);
        setTax(calculatedTax);
      }
      
      setLoading(false);
    }
  }, [id]);
  
  const handlePrint = () => {
    setIsPrintDialogOpen(true);
  };

  const handleCancelOrder = (sendNote: boolean, note?: string) => {
    if (!order) return;

    // In a real app, this would make an API call to update the order
    setOrder({
      ...order,
      status: "canceled",
    });

    toast({
      title: "Order Canceled",
      description: `Order #${order.id} has been canceled.${
        sendNote && note ? " A note has been sent to the customer." : ""
      }`,
    });

    setIsCancelDialogOpen(false);
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
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
              Order #{order.id}
            </h1>
            <p className="text-muted-foreground">{formatDate(order.date)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>

        {order.status !== "canceled" && (
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setIsCancelDialogOpen(true)}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Order
          </Button>
        )}
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
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Order details and items</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Badge className={`status-${order.status}`}>
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

                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-md border">
                          <AvatarImage src={item.image} />
                          <AvatarFallback className="rounded-md">
                            {item.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            GHS {item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">GHS {item.total.toFixed(2)}</p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>
                        GHS{" "}
                        {orderItems
                          .reduce((sum, item) => sum + item.total, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Shipping</p>
                      <p>GHS {shippingFee.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Tax</p>
                      <p>GHS {tax.toFixed(2)}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <p>Total</p>
                      <p>GHS {order.total.toFixed(2)}</p>
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
                        {order.shippingMethod === "delivery"
                          ? "Your order will be delivered to your address."
                          : "Your order will be available for pickup at our store."}
                      </p>
                      {order.status === "completed" && (
                        <p className="text-sm text-status-completed mt-2">
                          Delivered on {formatDate(order.date)}
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
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {order.customerName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div>
                  <p className="text-sm font-medium mb-1">Contact Details</p>
                  <p className="text-sm text-muted-foreground">
                    customer@example.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +233 20 123 4567
                  </p>
                </div>

                {order.shippingMethod === "delivery" && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="text-sm font-medium mb-1">
                        Shipping Address
                      </p>
                      <p className="text-sm text-muted-foreground">
                        123 Main Street
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Accra, Ghana
                      </p>
                    </div>
                  </>
                )}

                <Button className="w-full mt-2" variant="outline" asChild>
                  <Link to="#">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Customer Profile
                  </Link>
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
                    {order.status === "pending" ? "Unpaid" : "Paid"}
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
                    <p className="text-sm font-medium">Mobile Money</p>
                    <p className="text-xs text-muted-foreground">
                      **** **** **** 1234
                    </p>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>
                      GHS{" "}
                      {orderItems
                        .reduce((sum, item) => sum + item.total, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Shipping</p>
                    <p>GHS {shippingFee.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-muted-foreground">Tax</p>
                    <p>GHS {tax.toFixed(2)}</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>GHS {order.total.toFixed(2)}</p>
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
        order={order}
      />
    </div>
  );
};

export default OrderDetail;
