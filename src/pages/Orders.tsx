
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderList } from "@/components/orders/OrderList";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderStats } from "@/components/orders/OrderStats";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, PlusCircle, Grid, List as ListIcon, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus, sampleOrders, sampleTransactions } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/sales/DateRangePicker";
import { DateRange } from "react-day-picker";
import { addDays, format, subDays } from "date-fns";

const Orders = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month" | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "tile">("list");
  const ordersPerPage = 10;
  
  // For transaction totals
  const [totalTimeframe, setTotalTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
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
  const calculateTransactionTotal = (period: "daily" | "weekly" | "monthly" | "yearly" | "custom") => {
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
    
    const filteredTransactions = sampleTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    const total = filteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'sale' ? transaction.amount : 0);
    }, 0);
    
    return total.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your customer orders.</p>
        </div>
        <Button onClick={handleCreateOrder}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Order
        </Button>
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

            <OrderList
              orders={currentOrders}
              currentPage={currentPage}
              totalPages={totalPages}
              totalOrders={totalOrders}
              onPageChange={setCurrentPage}
              ordersPerPage={ordersPerPage}
              viewMode={viewMode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
