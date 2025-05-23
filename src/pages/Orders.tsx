import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderList } from "@/components/orders/OrderList";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderStats } from "@/components/orders/OrderStats";
import { useIsMobile } from "@/hooks/use-mobile";
import { PrintOrderDialog } from "@/components/orders/PrintOrderDialog";
import { OrderStatusDialog } from "@/components/orders/OrderStatusDialog";
import { useOrders } from "@/hooks/useOrders";
import { OrderStatus } from "@/types/order";
import {
  getOrderItems,
  getOrderStatusColorByName,
} from "@/services/firestoreService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { subDays } from "date-fns";
import {
  Search,
  PlusCircle,
  Grid,
  Printer,
  ListIcon,
  X,
  CreditCard,
  ShoppingCart,
  Truck,
  User,
  Tag,
} from "lucide-react";

const Orders = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Orders state using custom hook
  const {
    filteredOrders,
    selectedOrder,
    setSelectedOrder,
    orderItems,
    loading,
    itemsLoading,
    filters,
    updateFilters,
    updateStatus,
    fetchOrderItems,
  } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const ordersPerPage = 10;
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [activeDetailsTab, setActiveDetailsTab] = useState("summary");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [printOrderData, setPrintOrderData] = useState<any>(null);
  const [statusColor, setStatusColor] = useState<string>("gray"); // default

  useEffect(() => {
    const fetchStatusColor = async () => {
      if (selectedOrder?.business_id && selectedOrder?.status) {
        try {
          const color = await getOrderStatusColorByName(
            selectedOrder.business_id,
            selectedOrder.status
          );

          if (color) {
            setStatusColor(color);
          } else {
            setStatusColor("gray"); // fallback
          }
        } catch (err) {
          console.error("Failed to fetch status color:", err);
          setStatusColor("gray");
        }
      }
    };

    fetchStatusColor();
  }, [selectedOrder?.business_id, selectedOrder?.status]);

  // Update search term filter
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, updateFilters]);

  // Handle status filter change
  const handleStatusFilterChange = (status: OrderStatus | "all") => {
    updateFilters({ status });
  };

  // Handle time filter change
  const handleTimeFilterChange = (
    timeFilter: "today" | "week" | "month" | "all"
  ) => {
    let startDate: Date | undefined;
    const now = new Date();

    switch (timeFilter) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "all":
        startDate = undefined;
        break;
    }

    updateFilters({ startDate });
  };

  // Navigate to create order page
  const handleCreateOrder = () => {
    navigate("/orders/create");
  };

  // Open status change dialog
  const handleOpenStatusDialog = () => {
    setIsStatusDialogOpen(true);
  };

  // Handle updating order status
  const handleUpdateStatus = async (
    newStatus: OrderStatus,
    sendNote: boolean,
    note?: string
  ): Promise<void> => {
    if (!selectedOrder) return;

    const success = await updateStatus(
      selectedOrder.id,
      newStatus,
      sendNote ? note : undefined
    );

    if (success) {
      setIsStatusDialogOpen(false);
    }
  };

  // Handler for selecting an order and fetching its items
  const handleSelectOrder = async (order: any) => {
    setSelectedOrder(order);
    setActiveDetailsTab("summary");

    // Explicitly fetch order items when selecting an order
    if (order && order.id) {
      await fetchOrderItems(order.id);
    }
  };

  // Handler for viewing order details
  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  // Handler for closing the details panel
  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Handle print dialog
  const handlePrint = async () => {
    if (selectedOrder) {
      try {
        // Ensure we have the order items before printing
        let items = orderItems;

        // If items aren't loaded yet, fetch them
        if (!items || items.length === 0) {
          items = await getOrderItems(selectedOrder.id);
        }

        // Create a complete order object with items for printing
        const orderForPrinting = {
          ...selectedOrder,
          items: items,
        };

        setPrintOrderData(orderForPrinting);
        setIsPrintDialogOpen(true);
      } catch (error) {
        console.error("Error preparing order for printing:", error);
        toast({
          title: "Error",
          description: "Could not prepare order for printing",
          variant: "destructive",
        });
      }
    }
  };

  // Pagination calculations
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Helper function to get status color
  const getStatusColor = async (business_id: string, status: OrderStatus) => {
    const color = await getOrderStatusColorByName(
      business_id,
      status as string
    );
    if (!color) {
      console.error("No color found for status:", status);
      return "bg-gray-200"; // Default color
    }
    console.log("Status color:", color);
    return color;
  };

  /**
   * Safely formats a number with toFixed
   */
  const safeToFixed = (value: any, decimals = 2): string => {
    // If null or undefined, return zeros
    if (value == null) return "0.00";

    // Convert to number if it's not already
    const number = typeof value === "number" ? value : Number(value);

    // Check if conversion resulted in a valid number
    if (isNaN(number)) return "0.00";

    // Safely apply toFixed
    try {
      return number.toFixed(decimals);
    } catch (err) {
      console.error("Error formatting number:", err);
      return "0.00";
    }
  };

  // Format dates from Firebase
  const formatFirebaseDate = (date: any): string => {
    if (!date) return "N/A";

    // If it's already a Date object
    if (date instanceof Date) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    }

    // If it's a Firebase timestamp
    if (date && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    }

    return "N/A";
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              Manage your customer orders.
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/orders/statuses">
                <Tag className="h-4 w-4 mr-1" /> Manage Statuses
              </Link>
            </Button>
            <Button onClick={handleCreateOrder} size="sm">
              <PlusCircle className="mr-2 h-4 w-5" />
              Create Order
            </Button>
          </div>
        </div>

        <OrderStats orders={filteredOrders} />

        <Card className="border-none">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                <div className="w-full">
                  <OrderFilters
                    statusFilter={filters.status || "all"}
                    setStatusFilter={handleStatusFilterChange}
                    timeFilter={
                      filters.startDate
                        ? filters.startDate.getTime() ===
                          new Date().setHours(0, 0, 0, 0)
                          ? "today"
                          : filters.startDate.getTime() >
                            subDays(new Date(), 8).getTime()
                          ? "week"
                          : "month"
                        : "all"
                    }
                    setTimeFilter={handleTimeFilterChange}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex">
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="icon"
                      className="rounded-r-none"
                      onClick={() => setViewMode("list")}>
                      <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "tile" ? "default" : "outline"}
                      size="icon"
                      className="rounded-l-none"
                      onClick={() => setViewMode("tile")}>
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {loading && filteredOrders.length === 0 ? (
                <div className="flex justify-center items-center p-12">
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-3">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                  <h3 className="font-medium text-lg">No orders found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {filters.status !== "all" ||
                    filters.searchTerm ||
                    filters.startDate
                      ? "Try adjusting your filters to see more results."
                      : "Create your first order to get started."}
                  </p>
                  {!(
                    filters.status !== "all" ||
                    filters.searchTerm ||
                    filters.startDate
                  ) && (
                    <Button onClick={handleCreateOrder} className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Order
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col w-full md:flex-row gap-6">
                  <div className="w-full md:w-2/3">
                    <OrderList
                      businessId={currentOrders[0]?.business_id}
                      orders={currentOrders.map((order) => ({
                        id: order.id,
                        customerName:
                          order.customer?.name || "Unknown Customer",
                        date: formatFirebaseDate(order.created_at),
                        status: order.status,
                        total: order.total,
                        items: order.item_count,
                        shippingMethod: order.shipping_method,
                      }))}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalOrders={totalOrders}
                      onPageChange={setCurrentPage}
                      ordersPerPage={ordersPerPage}
                      viewMode={viewMode}
                      onSelectOrder={handleSelectOrder}
                      onViewOrder={handleViewOrder}
                    />
                  </div>

                  {/* Order Details Panel with Tabs */}
                  {selectedOrder ? (
                    <div
                      className={`${
                        isMobile
                          ? "fixed inset-0 z-50 bg-background p-4"
                          : "md:w-1/3"
                      }`}>
                      <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Order Details</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCloseDetails}>
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent className="h-[700px] overflow-y-auto">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-row gap-4">
                              <h3 className="text-lg font-semibold">
                                Order #{selectedOrder.id.substring(0, 8)}
                              </h3>
                              <Badge
                                variant="outline"
                                onClick={handleOpenStatusDialog}
                                className={`bg-${statusColor}-100 cursor-pointer`}>
                                {selectedOrder.status}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePrint}>
                              <Printer className="mr-2 h-4 w-4" />
                              Print
                            </Button>
                          </div>

                          {/* Details Navigation Tabs */}
                          <Tabs
                            value={activeDetailsTab}
                            onValueChange={setActiveDetailsTab}
                            className="w-full">
                            <TabsList className="grid grid-cols-4 mb-6">
                              <TabsTrigger
                                value="summary"
                                className="flex items-center gap-1 text-xs">
                                <User className="h-3 w-3" />
                                Summary
                              </TabsTrigger>
                              <TabsTrigger
                                value="items"
                                className="flex items-center gap-1 text-xs">
                                <ShoppingCart className="h-3 w-3" />
                                Cart
                              </TabsTrigger>
                              <TabsTrigger
                                value="payment"
                                className="flex items-center gap-1 text-xs">
                                <CreditCard className="h-3 w-3" />
                                Payment
                              </TabsTrigger>
                              <TabsTrigger
                                value="shipping"
                                className="flex items-center gap-1 text-xs">
                                <Truck className="h-3 w-3" />
                                Shipping
                              </TabsTrigger>
                            </TabsList>

                            {/* Summary Tab Content */}
                            <TabsContent value="summary" className="space-y-4">
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Customer
                                    </p>
                                    <p className="font-medium">
                                      {selectedOrder.customer?.name || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Date
                                    </p>
                                    <p>
                                      {formatFirebaseDate(
                                        selectedOrder.created_at
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="border-t pt-4 space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Contact Information
                                    </p>
                                    <p className="font-medium">
                                      {selectedOrder.customer?.phone || "N/A"}
                                    </p>
                                    <p className="text-sm">
                                      {selectedOrder.customer?.email || "N/A"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Delivery Address
                                    </p>
                                    <p className="text-sm">
                                      {selectedOrder.shipping_address || "N/A"}
                                      {selectedOrder.shipping_address &&
                                      selectedOrder.city
                                        ? ", "
                                        : ""}
                                      {selectedOrder.city || ""}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Order Summary
                                    </p>
                                    <div className="flex justify-between text-sm">
                                      <p>
                                        Items ({selectedOrder.item_count || 0})
                                      </p>
                                      <p>
                                        GHS{" "}
                                        {safeToFixed(selectedOrder?.subtotal)}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <p>Shipping</p>
                                      <p>
                                        GHS{" "}
                                        {safeToFixed(
                                          selectedOrder?.shipping_fee
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <p>Tax</p>
                                      <p>
                                        GHS {safeToFixed(selectedOrder?.tax)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-4 border-t">
                                  <div className="flex justify-between text-lg">
                                    <p className="font-bold">Total</p>
                                    <p>
                                      GHS {safeToFixed(selectedOrder?.total)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            {/* Items Tab Content */}
                            <TabsContent value="items" className="space-y-4">
                              {itemsLoading ? (
                                <div className="flex justify-center py-8">
                                  <p>Loading items...</p>
                                </div>
                              ) : orderItems.length === 0 ? (
                                <div className="flex justify-center py-8">
                                  <p>No items found for this order.</p>
                                </div>
                              ) : (
                                <>
                                  <div className="rounded-md border">
                                    <div className="bg-muted p-2 grid grid-cols-12 text-xs font-medium">
                                      <div className="col-span-5">Product</div>
                                      <div className="col-span-2 text-center">
                                        Qty
                                      </div>
                                      <div className="col-span-2 text-right">
                                        Price
                                      </div>
                                      <div className="col-span-3 text-right">
                                        Total
                                      </div>
                                    </div>
                                    <div className="divide-y">
                                      {orderItems.map((item) => (
                                        <div
                                          key={item.id}
                                          className="p-3 grid grid-cols-12 items-center text-sm">
                                          <div className="col-span-5 font-medium">
                                            {item.name}
                                          </div>
                                          <div className="col-span-2 text-center">
                                            {item.quantity}
                                          </div>
                                          <div className="col-span-2 text-right">
                                            GHS {safeToFixed(item?.price)}
                                          </div>
                                          <div className="col-span-3 text-right font-medium">
                                            GHS {safeToFixed(item?.total)}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="rounded-md border p-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <p>
                                        Subtotal (
                                        {selectedOrder.item_count ||
                                          orderItems.length}{" "}
                                        items)
                                      </p>
                                      <p>
                                        GHS{" "}
                                        {safeToFixed(selectedOrder?.subtotal)}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <p>Shipping</p>
                                      <p>
                                        GHS{" "}
                                        {safeToFixed(
                                          selectedOrder?.shipping_fee
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <p>Tax</p>
                                      <p>
                                        GHS {safeToFixed(selectedOrder?.tax)}
                                      </p>
                                    </div>
                                    <div className="flex justify-between text-base pt-2 border-t font-medium">
                                      <p>Total</p>
                                      <p>
                                        GHS {safeToFixed(selectedOrder?.total)}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </TabsContent>

                            {/* Payment Tab Content */}
                            <TabsContent value="payment" className="space-y-4">
                              <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                  <div className="rounded-full bg-blue-100 p-2">
                                    <CreditCard className="h-6 w-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {selectedOrder.payment_method ||
                                        "Unknown Method"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedOrder.payment_status === "paid"
                                        ? "Payment completed"
                                        : "Payment pending"}
                                    </p>
                                  </div>
                                </div>

                                <div className="rounded-md border p-4 space-y-3">
                                  {selectedOrder.payment_reference && (
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Transaction ID
                                      </p>
                                      <p className="font-mono text-sm">
                                        {selectedOrder.payment_reference}
                                      </p>
                                    </div>
                                  )}

                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Payment Status
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className={
                                        selectedOrder.payment_status === "paid"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }>
                                      {selectedOrder.payment_status === "paid"
                                        ? "Paid"
                                        : "Unpaid"}
                                    </Badge>
                                  </div>

                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Payment Date
                                    </p>
                                    <p>
                                      {formatFirebaseDate(
                                        selectedOrder.created_at
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="border rounded-md p-4">
                                  <div className="flex justify-between text-lg">
                                    <p className="font-bold">
                                      Total{" "}
                                      {selectedOrder.payment_status === "paid"
                                        ? "Paid"
                                        : "Due"}
                                    </p>
                                    <p className="font-bold">
                                      GHS {safeToFixed(selectedOrder?.total)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            {/* Shipping Tab Content */}
                            <TabsContent value="shipping" className="space-y-4">
                              <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                  <div className="rounded-full bg-purple-100 p-2">
                                    <Truck className="h-6 w-6 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {selectedOrder.shipping_method ===
                                      "delivery"
                                        ? "Delivery"
                                        : "Pickup"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedOrder.shipping_method ===
                                      "delivery"
                                        ? "Shipping to customer address"
                                        : "Customer will pick up"}
                                    </p>
                                  </div>
                                </div>

                                {selectedOrder.shipping_method ===
                                  "delivery" && (
                                  <div className="rounded-md border p-4 space-y-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Shipping Address
                                      </p>
                                      <p className="text-sm">
                                        {selectedOrder.shipping_address ||
                                          "N/A"}
                                        {selectedOrder.shipping_address &&
                                        selectedOrder.city
                                          ? ", "
                                          : ""}
                                        {selectedOrder.city || ""}
                                      </p>
                                    </div>

                                    {selectedOrder.tracking_number && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">
                                          Tracking Number
                                        </p>
                                        <p className="font-mono text-sm">
                                          {selectedOrder.tracking_number}
                                        </p>
                                      </div>
                                    )}

                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Status
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className={`${getStatusColor(
                                          selectedOrder.business_id,
                                          selectedOrder.status as OrderStatus
                                        )}`}>
                                        {selectedOrder.status}
                                      </Badge>
                                    </div>
                                  </div>
                                )}

                                <div className="rounded-md border p-4 space-y-2">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium">
                                      Package Contents
                                    </p>
                                    <p className="text-sm">
                                      {selectedOrder.item_count ||
                                        (orderItems
                                          ? orderItems.length
                                          : 0)}{" "}
                                      items
                                    </p>
                                  </div>
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium">
                                      Shipping Fee
                                    </p>
                                    <p className="text-sm">
                                      GHS{" "}
                                      {safeToFixed(selectedOrder?.shipping_fee)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <div className="pt-6">
                            <Button
                              className="w-full"
                              onClick={() => handleViewOrder(selectedOrder.id)}>
                              View Full Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className={`${isMobile ? "hidden" : "md:w-1/3"}`}>
                      <Card className="h-full flex flex-col justify-center items-center p-6">
                        <div className="text-center space-y-4">
                          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto" />
                          <CardTitle>No Order Selected</CardTitle>
                          <CardDescription>
                            Select an order from the list to view its details
                          </CardDescription>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Change Dialog */}
      {selectedOrder && (
        <OrderStatusDialog
          isOpen={isStatusDialogOpen}
          onClose={() => setIsStatusDialogOpen(false)}
          onConfirm={handleUpdateStatus}
          orderId={selectedOrder.id}
        />
      )}

      {/* Print Order Dialog */}
      <PrintOrderDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        order={printOrderData}
      />
    </div>
  );
};

export default Orders;