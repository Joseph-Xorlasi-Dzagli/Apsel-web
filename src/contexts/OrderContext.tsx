import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useAuthContext } from "./AuthContext";
import { useBusiness } from "@/hooks/useBusiness";
import { useToast } from "@/hooks/use-toast";
import {
  getOrdersByBusiness,
  getOrder,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStatuses,
  addOrderStatus,
  updateOrderStatus as updateOrderStatusItem,
  deleteOrderStatus,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";

interface OrderContextType {
  orders: any[];
  orderStatuses: any[];
  selectedOrder: any | null;
  filteredOrders: any[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMoreOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Promise<any>;
  createOrder: (orderData: any) => Promise<string>;
  cancelOrder: (orderId: string, note?: string) => Promise<void>;
  updateStatus: (
    orderId: string,
    status: string,
    note?: string
  ) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setTimeFilter: (timeFrame: string) => void;
  setSelectedOrder: (order: any | null) => void;
  // Order statuses management
  createOrderStatus: (statusData: any) => Promise<string>;
  updateOrderStatusItem: (statusId: string, statusData: any) => Promise<void>;
  deleteOrderStatus: (statusId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
}

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps) {
  const { currentUser } = useAuthContext();
  const { business, loading: businessLoading } = useBusiness();
  const { toast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Fetch orders when business data is available
  useEffect(() => {
    const fetchOrders = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch order statuses first
        const fetchedOrderStatuses = await getOrderStatuses(business.id);
        setOrderStatuses(
          fetchedOrderStatuses.map((status) => convertFirestoreData(status))
        );

        // Then fetch orders
        const { orders: fetchedOrders, lastDoc } = await getOrdersByBusiness(
          business.id
        );

        const processedOrders = fetchedOrders.map((order) =>
          convertFirestoreData(order)
        );

        setOrders(processedOrders);
        setFilteredOrders(processedOrders);
        setLastVisible(lastDoc);
        setHasMore(fetchedOrders.length === 10); // Assuming pageSize is 10
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [business, businessLoading, toast]);

  // Filter orders based on search, status and time
  useEffect(() => {
    if (!orders.length) return;

    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          (order.customer?.name &&
            order.customer.name.toLowerCase().includes(term))
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

      filtered = filtered.filter((order) =>
        order.created_at instanceof Date
          ? order.created_at >= startDate
          : new Date(order.created_at) >= startDate
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, timeFilter]);

  // Load more orders
  const loadMoreOrders = async () => {
    if (!business || !lastVisible || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const { orders: fetchedOrders, lastDoc } = await getOrdersByBusiness(
        business.id,
        null, // No status filter at this level
        lastVisible
      );

      const processedOrders = fetchedOrders.map((order) =>
        convertFirestoreData(order)
      );

      setOrders((prev) => [...prev, ...processedOrders]);
      setLastVisible(lastDoc);
      setHasMore(fetchedOrders.length === 10); // Assuming pageSize is 10
    } catch (err: any) {
      console.error("Error loading more orders:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load more orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get a specific order by ID
  const getOrderById = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);

      const orderData = await getOrder(orderId);
      if (orderData) {
        const processedOrder = convertFirestoreData(orderData);
        return processedOrder;
      }
      return null;
    } catch (err: any) {
      console.error("Error fetching order:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required to create an order",
        variant: "destructive",
      });
      throw new Error("Business data is required");
    }

    try {
      // Add business ID to the order data
      const orderWithBusinessId = {
        ...orderData,
        business_id: business.id,
      };

      // Create the order
      const orderId = await addOrder(orderWithBusinessId);

      // Fetch the new order to get complete data
      const newOrder = await getOrder(orderId);

      if (newOrder) {
        const processedOrder = convertFirestoreData(newOrder);

        // Update local state
        setOrders((prev) => [processedOrder, ...prev]);

        toast({
          title: "Order Created",
          description: `Order #${orderId} has been created successfully.`,
        });

        return orderId;
      }

      return orderId;
    } catch (err: any) {
      console.error("Error creating order:", err);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string, note?: string) => {
    try {
      await updateOrderStatus(orderId, "canceled", note);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "canceled", notes: note || order.notes }
            : order
        )
      );

      // Update selected order if it's the one being canceled
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: "canceled",
          notes: note || prev.notes,
        }));
      }

      toast({
        title: "Order Canceled",
        description: `Order #${orderId} has been canceled${
          note ? " with a note to the customer" : ""
        }.`,
      });
    } catch (err: any) {
      console.error("Error canceling order:", err);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update order status
  const updateStatus = async (
    orderId: string,
    status: string,
    note?: string
  ) => {
    try {
      await updateOrderStatus(orderId, status, note);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status, notes: note || order.notes }
            : order
        )
      );

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status,
          notes: note || prev.notes,
        }));
      }

      toast({
        title: "Status Updated",
        description: `Order #${orderId} status has been updated to ${status}${
          note ? " with a note to the customer" : ""
        }.`,
      });
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Create a new order status
  const createOrderStatus = async (statusData: any) => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data is required to create a status",
        variant: "destructive",
      });
      throw new Error("Business data is required");
    }

    try {
      // Add business ID to the status data
      const statusWithBusinessId = {
        ...statusData,
        business_id: business.id,
      };

      // Create the status
      const statusId = await addOrderStatus(statusWithBusinessId);

      // Fetch all statuses to ensure we have the latest
      const fetchedOrderStatuses = await getOrderStatuses(business.id);
      setOrderStatuses(
        fetchedOrderStatuses.map((status) => convertFirestoreData(status))
      );

      toast({
        title: "Status Created",
        description: `${statusData.name} has been added to your order statuses.`,
      });

      return statusId;
    } catch (err: any) {
      console.error("Error creating order status:", err);
      toast({
        title: "Error",
        description: "Failed to create order status",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update an order status
  const updateOrderStatusItemFunction = async (
    statusId: string,
    statusData: any
  ) => {
    try {
      await updateOrderStatusItem(statusId, statusData, statusData.notes || "");

      // Fetch all statuses to ensure we have the latest
      const fetchedOrderStatuses = await getOrderStatuses(business.id);
      setOrderStatuses(
        fetchedOrderStatuses.map((status) => convertFirestoreData(status))
      );

      toast({
        title: "Status Updated",
        description: `${statusData.name} has been updated.`,
      });
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete an order status
  const deleteOrderStatusFunction = async (statusId: string) => {
    try {
      await deleteOrderStatus(statusId);

      // Update local state
      setOrderStatuses((prev) =>
        prev.filter((status) => status.id !== statusId)
      );

      toast({
        title: "Status Deleted",
        description: `The status has been removed.`,
      });
    } catch (err: any) {
      console.error("Error deleting order status:", err);
      toast({
        title: "Error",
        description: "Failed to delete order status",
        variant: "destructive",
      });
      throw err;
    }
  };

  const value = {
    orders,
    orderStatuses,
    selectedOrder,
    filteredOrders,
    loading,
    error,
    hasMore,
    loadMoreOrders,
    getOrderById,
    createOrder,
    cancelOrder,
    updateStatus,
    setSearchTerm,
    setStatusFilter,
    setTimeFilter,
    setSelectedOrder,
    createOrderStatus,
    updateOrderStatusItem: updateOrderStatusItemFunction,
    deleteOrderStatus: deleteOrderStatusFunction,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export default OrderContext;
