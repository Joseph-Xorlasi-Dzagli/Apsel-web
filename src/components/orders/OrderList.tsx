
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Order, OrderStatus } from "@/lib/data";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin } from "lucide-react";

interface OrderListProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
  ordersPerPage: number;
  viewMode?: "list" | "tile";
}

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

export function OrderList({
  orders,
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
  ordersPerPage,
  viewMode = "list"
}: OrderListProps) {
  const navigate = useNavigate();
  const startItem = (currentPage - 1) * ordersPerPage + 1;
  const endItem = Math.min(currentPage * ordersPerPage, totalOrders);

  return (
    <div className="space-y-4">
      {viewMode === "list" ? (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    {format(new Date(order.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>GHC {order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    {order.shippingMethod === "delivery" ? (
                      <Truck className="h-5 w-5 text-purple-500" />
                    ) : (
                      <MapPin className="h-5 w-5 text-orange-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/orders/${order.id}`)}>
              <CardContent className="p-5">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Order #{order.id}</span>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Date</span>
                    <span>{format(new Date(order.date), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Items</span>
                    <span>{order.items} items</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <div className="flex items-center gap-1">
                      {order.shippingMethod === "delivery" ? (
                        <>
                          <Truck className="h-4 w-4 text-purple-500" />
                          <span>Delivery</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 text-orange-500" />
                          <span>Pickup</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-brand">GHC {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalOrders} orders
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => onPageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
