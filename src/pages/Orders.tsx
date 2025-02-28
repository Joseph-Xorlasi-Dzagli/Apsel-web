
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderList } from "@/components/orders/OrderList";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderStats } from "@/components/orders/OrderStats";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus, sampleOrders } from "@/lib/data";

const Orders = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month" | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                View and manage all your customer orders
              </CardDescription>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <OrderFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
            />

            <OrderList
              orders={currentOrders}
              currentPage={currentPage}
              totalPages={totalPages}
              totalOrders={totalOrders}
              onPageChange={setCurrentPage}
              ordersPerPage={ordersPerPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
