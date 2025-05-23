import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Tag, X, MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderStatusDialog } from "@/components/orders/OrderStatusDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrderStatusColorByName } from "@/services/firestoreService";
import { useOrders } from "@/hooks/useOrders";

interface OrderListProps {
  businessId: string;
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  onPageChange: (page: number) => void;
  ordersPerPage: number;
  viewMode?: "list" | "tile";
  onSelectOrder?: (order: Order) => void;
  onViewOrder?: (orderId: string) => void;
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
  businessId,
  orders,
  currentPage,
  totalPages,
  totalOrders,
  onPageChange,
  ordersPerPage,
  viewMode = "list",
  onSelectOrder,
  onViewOrder,
}: OrderListProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  // Changed to false by default
  const [showControls, setShowControls] = useState(false);

  const startItem = (currentPage - 1) * ordersPerPage + 1;
  const endItem = Math.min(currentPage * ordersPerPage, totalOrders);
  const [statusColors, setStatusColors] = useState<Record<string, string>>({});
  const {
      updateStatus,
    } = useOrders();



  useEffect(() => {
    const fetchColors = async () => {
      const colorMap: Record<string, string> = {};

      await Promise.all(
        orders.map(async (order) => {
          try {
            const color = await getOrderStatusColorByName(
              businessId,
              order.status
            );
            const safeColor = color || "gray"; // fallback
            colorMap[order.id] = safeColor;
          } catch (err) {
            console.error(`Failed to fetch color for order ${order.id}`, err);
            colorMap[order.id] = "gray"; // fallback
          }
        })
      );

      setStatusColors(colorMap);
    };

    if (orders.length > 0) {
      fetchColors();
    }
  }, [orders]);
  

  // Toggle visibility of checkboxes and action buttons
  const toggleControls = () => {
    setShowControls((prev) => !prev);
    // Clear selections when hiding controls
    if (showControls) {
      setSelectedOrderIds([]);
    }
  };

  // Handle cancel action - hide controls and clear selections
  const handleCancel = () => {
    setSelectedOrderIds([]);
    setShowControls(false);
  };

  // Handle row click to select an order
  const handleRowClick = (order: Order) => {
    setSelectedOrderId(order.id);
    if (onSelectOrder) {
      onSelectOrder(order);
    }
  };

  // Handle view button click
  const handleViewClick = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation(); // Prevent row click from firing
    if (onViewOrder) {
      onViewOrder(orderId);
    }
  };

  // Handle checkbox click
  const handleCheckboxClick = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation(); // Prevent row click

    setSelectedOrderIds((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  // Select all orders on current page
  const handleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((order) => order.id));
    }
  };

  // Open status change dialog
  const handleOpenStatusDialog = () => {
    if (selectedOrderIds.length > 0) {
      setIsStatusDialogOpen(true);
    }
  };

  // Update order statuses
  const handleUpdateStatus = async (
    newStatus: OrderStatus,
    sendNote: boolean,
    note?: string
  ): Promise<void> => {
    // In a real app, this would call an API to update the status
    // For each selected order, call updateStatus (assuming updateStatus is available in scope)
    for (const orderId of selectedOrderIds) {
      const success =  await updateStatus(
        orderId,
        newStatus,
        sendNote ? note : undefined
      );
      if (!success) {
        console.error(`Failed to update order ${orderId} to status ${newStatus}`);
      }
    }
    console.log(
      `Updating ${selectedOrderIds.length} orders to status: ${newStatus}`
    );
    console.log(`Send note to customer: ${sendNote ? "Yes" : "No"}`);
    if (note) {
      console.log(`Note: ${note}`);
    }

    // Close the dialog, clear selections, and hide controls
    setIsStatusDialogOpen(false);
    setSelectedOrderIds([]);
    setShowControls(false); // Added this line to close controls after updating status
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar - Show when orders are selected and controls are visible */}
      {showControls && (
        <div className="flex items-center justify-between bg-muted/30 py-2 px-4 rounded-md">
          <span className="font-medium">
            {selectedOrderIds.length > 0
              ? `${selectedOrderIds.length} Orders Selected`
              : "Select orders to change status"}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleOpenStatusDialog}
              disabled={selectedOrderIds.length === 0}>
              <Tag className="h-4 w-4" />
              Change Status
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleCancel}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {viewMode === "list" ? (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {showControls && (
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        selectedOrderIds.length === orders.length &&
                        orders.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                )}
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={toggleControls}>
                        {showControls ? "Hide Controls" : "Show Controls"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className={`${
                    selectedOrderId === order.id
                      ? "hover:bg-blue-100"
                      : "hover:bg-muted/50"
                  } cursor-pointer ${
                    selectedOrderId === order.id ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleRowClick(order)}>
                  {showControls && (
                    <TableCell
                      className="w-10"
                      onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrderIds.includes(order.id)}
                        onCheckedChange={() => {
                          setSelectedOrderIds((prev) =>
                            prev.includes(order.id)
                              ? prev.filter((id) => id !== order.id)
                              : [...prev, order.id]
                          );
                        }}
                        aria-label={`Select order ${order.id}`}
                        className="mr-2"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    {format(new Date(order.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`bg-${statusColors[order.id]}-100`}>
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
                      onClick={(e) => handleViewClick(e, order.id)}>
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
            <Card
              key={order.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedOrderId === order.id ? "border-blue-500" : ""
              }`}
              onClick={() => handleRowClick(order)}>
              <CardContent className="p-5">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {showControls && (
                      <Checkbox
                        checked={selectedOrderIds.includes(order.id)}
                        onCheckedChange={() => {
                          setSelectedOrderIds((prev) =>
                            prev.includes(order.id)
                              ? prev.filter((id) => id !== order.id)
                              : [...prev, order.id]
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select order ${order.id}`}
                      />
                    )}
                    <span className="font-medium text-sm">
                      Order #{order.id}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(order.status)}`}>
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
                    <span className="font-bold text-brand">
                      GHC {order.total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={(e) => handleViewClick(e, order.id)}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalOrders} orders
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => onPageChange(index + 1)}
                  isActive={currentPage === index + 1}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Status Change Dialog */}
      <OrderStatusDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleUpdateStatus}
        orderCount={selectedOrderIds.length}
      />
    </div>
  );
}
