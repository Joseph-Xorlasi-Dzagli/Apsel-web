import { useState } from "react";
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
import {
  Search,
  PlusCircle,
  Grid,
  List as ListIcon,
  Calendar,
  X,
  CreditCard,
  ShoppingCart,
  Truck,
  User,
  Tag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Order,
  OrderStatus,
  sampleOrders,
  sampleTransactions,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/sales/DateRangePicker";
import { DateRange } from "react-day-picker";
import { addDays, format, subDays } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<
    "today" | "week" | "month" | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const ordersPerPage = 10;

  // New state for selected order
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New state for active details tab
  const [activeDetailsTab, setActiveDetailsTab] = useState("summary");

  // For transaction totals
  const [totalTimeframe, setTotalTimeframe] = useState<
    "daily" | "weekly" | "monthly" | "yearly" | "custom"
  >("daily");
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(today, 7),
    to: today,
  });

  const handleCreateOrder = () => {
    toast({
      title: "Create Order Feature",
      description: "This feature will be available soon!",
    });
  };

  // Handler for selecting an order
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveDetailsTab("summary"); // Reset to summary tab when selecting a new order
  };

  // Handler for viewing order details
  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  // Handler for closing the details panel
  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Filter orders based on search, status and time
  const filterOrders = () => {
    let filtered = [...sampleOrders];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by time
    if (timeFilter !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (timeFilter) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter((order) => new Date(order.date) >= startDate);
    }

    return filtered;
  };

  const filteredOrders = filterOrders();
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Calculate transaction totals for different time periods
  const calculateTransactionTotal = (
    period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
  ) => {
    let startDate: Date;
    const now = new Date();

    switch (period) {
      case "daily":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "monthly":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "yearly":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "custom":
        if (dateRange?.from) {
          startDate = dateRange.from;
        } else {
          startDate = new Date(0);
        }
        break;
      default:
        startDate = new Date(0);
    }

    const endDate = period === "custom" && dateRange?.to ? dateRange.to : now;

    const filteredTransactions = sampleTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const total = filteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === "sale" ? transaction.amount : 0);
    }, 0);

    return total.toFixed(2);
  };

  // Helper function to get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "canceled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
    }
  };

  // Sample data for order details sections
  // In a real application, these would come from your API or data store
  const getSampleOrderItems = (orderId: string) => [
    { id: "1", name: "Product A", quantity: 2, price: 25.99, total: 51.98 },
    { id: "2", name: "Product B", quantity: 1, price: 35.5, total: 35.5 },
    { id: "3", name: "Product C", quantity: 3, price: 12.75, total: 38.25 },
  ];

  const getSamplePaymentDetails = (orderId: string) => ({
    method: "Credit Card",
    cardType: "Visa",
    lastFour: "4242",
    transactionId: `TXN-${orderId}-${Math.floor(Math.random() * 10000)}`,
    status: "Approved",
    date: new Date().toISOString(),
  });

  const getSampleShippingDetails = (orderId: string) => ({
    method: "Express Delivery",
    carrier: "GHL Express",
    trackingNumber: `TRK-${Math.floor(Math.random() * 1000000)}`,
    estimatedDelivery: format(addDays(new Date(), 3), "MMM dd, yyyy"),
    status: "In Transit",
  });

  return (
    <div>
      <div className={"space-y-6"}>
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
            <Link to="/orders/create">
              <Button onClick={handleCreateOrder} size="sm">
                <PlusCircle className="mr-2 h-4 w-5" />
                Create Order
              </Button>
            </Link>
          </div>
        </div>

        <OrderStats orders={sampleOrders} />

        <Card className="border-none">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                <div className="w-full">
                  <OrderFilters
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    timeFilter={timeFilter}
                    setTimeFilter={setTimeFilter}
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

              <div className="flex flex-col w-full md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                  {/* Modified OrderList with onSelect handler */}
                  <OrderList
                    orders={currentOrders}
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
                {/* Enhanced Order Details Panel with Tabs */}
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
                          <h3 className="text-lg font-semibold">
                            Order #{selectedOrder.id}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(
                              selectedOrder.status
                            )}`}>
                            {selectedOrder.status}
                          </Badge>
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
                                    {selectedOrder.customerName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Date
                                  </p>
                                  <p>
                                    {format(
                                      new Date(selectedOrder.date),
                                      "MMM dd, yyyy"
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
                                    +233 55 123 4567
                                  </p>
                                  <p className="text-sm">
                                    {selectedOrder.customerName
                                      .toLowerCase()
                                      .replace(" ", ".")}
                                    @example.com
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Delivery Address
                                  </p>
                                  <p className="text-sm">
                                    123 Main Street, Accra, Ghana
                                  </p>
                                </div>

                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Order Summary
                                  </p>
                                  <div className="flex justify-between text-sm">
                                    <p>Items ({selectedOrder.items})</p>
                                    <p>
                                      GHC{" "}
                                      {(selectedOrder.total * 0.85).toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <p>Shipping</p>
                                    <p>
                                      GHC{" "}
                                      {(selectedOrder.total * 0.1).toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <p>Tax</p>
                                    <p>
                                      GHC{" "}
                                      {(selectedOrder.total * 0.05).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t">
                                <div className="flex justify-between text-lg">
                                  <p className="font-bold">Total</p>
                                  <p className="font-bold">
                                    GHC {selectedOrder.total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Items Tab Content */}
                          <TabsContent value="items" className="space-y-4">
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
                                {getSampleOrderItems(selectedOrder.id).map(
                                  (item) => (
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
                                        GHC {item.price.toFixed(2)}
                                      </div>
                                      <div className="col-span-3 text-right font-medium">
                                        GHC {item.total.toFixed(2)}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="rounded-md border p-3 space-y-2">
                              <div className="flex justify-between text-sm">
                                <p>Subtotal ({selectedOrder.items} items)</p>
                                <p>
                                  GHC {(selectedOrder.total * 0.85).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex justify-between text-sm">
                                <p>Shipping</p>
                                <p>
                                  GHC {(selectedOrder.total * 0.1).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex justify-between text-sm">
                                <p>Tax</p>
                                <p>
                                  GHC {(selectedOrder.total * 0.05).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex justify-between text-base pt-2 border-t font-medium">
                                <p>Total</p>
                                <p>GHC {selectedOrder.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Payment Tab Content */}
                          <TabsContent value="payment" className="space-y-4">
                            {(() => {
                              const paymentDetails = getSamplePaymentDetails(
                                selectedOrder.id
                              );
                              return (
                                <div className="space-y-6">
                                  <div className="flex items-center space-x-4">
                                    <div className="rounded-full bg-blue-100 p-2">
                                      <CreditCard className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {paymentDetails.method}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {paymentDetails.cardType} ending in{" "}
                                        {paymentDetails.lastFour}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="rounded-md border p-4 space-y-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Transaction ID
                                      </p>
                                      <p className="font-mono text-sm">
                                        {paymentDetails.transactionId}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Payment Status
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800">
                                        {paymentDetails.status}
                                      </Badge>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Payment Date
                                      </p>
                                      <p>
                                        {format(
                                          new Date(paymentDetails.date),
                                          "MMM dd, yyyy"
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="border rounded-md p-4">
                                    <div className="flex justify-between text-lg">
                                      <p className="font-bold">Total Paid</p>
                                      <p className="font-bold">
                                        GHC {selectedOrder.total.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </TabsContent>

                          {/* Shipping Tab Content */}
                          <TabsContent value="shipping" className="space-y-4">
                            {(() => {
                              const shippingDetails = getSampleShippingDetails(
                                selectedOrder.id
                              );
                              return (
                                <div className="space-y-6">
                                  <div className="flex items-center space-x-4">
                                    <div className="rounded-full bg-purple-100 p-2">
                                      <Truck className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {shippingDetails.method}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {shippingDetails.carrier}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="rounded-md border p-4 space-y-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Shipping Address
                                      </p>
                                      <p className="text-sm">
                                        123 Main Street, Accra, Ghana
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Tracking Number
                                      </p>
                                      <p className="font-mono text-sm">
                                        {shippingDetails.trackingNumber}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Estimated Delivery
                                      </p>
                                      <p>{shippingDetails.estimatedDelivery}</p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        Status
                                      </p>
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-100 text-blue-800">
                                        {shippingDetails.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="rounded-md border p-4 space-y-2">
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium">
                                        Package Contents
                                      </p>
                                      <p className="text-sm">
                                        {selectedOrder.items} items
                                      </p>
                                    </div>
                                    <div className="flex justify-between">
                                      <p className="text-sm font-medium">
                                        Package Weight
                                      </p>
                                      <p className="text-sm">2.4 kg</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;
