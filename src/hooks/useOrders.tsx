import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";
import { convertFirestoreData } from "@/utils/dbUtils";
import { OrderStatus } from "@/types/order";
import { getStatusColorByName } from "@/services/firestoreService";

export function useOrders() {
  const { toast } = useToast();
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{
    status?: OrderStatus | "all";
    searchTerm?: string;
    startDate?: Date;
    endDate?: Date;
  }>({
    status: "all",
    searchTerm: "",
    startDate: undefined,
    endDate: undefined,
  });

  // Fetch initial orders
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders with filters applied
  const fetchOrders = async (reset: boolean = true) => {
    try {
      setLoading(true);

      // Get the authenticated user's business ID
      if (!auth.currentUser) {
        // Handle not authenticated
        setLoading(false);
        return;
      }

      // Get business ID
      const businessRef = collection(db, "businesses");
      const businessQuery = query(
        businessRef,
        where("owner_id", "==", auth.currentUser.uid)
      );
      const businessSnapshot = await getDocs(businessQuery);

      if (businessSnapshot.empty) {
        // No business found
        setLoading(false);
        setAllOrders([]);
        setFilteredOrders([]);
        return;
      }

      const businessId = businessSnapshot.docs[0].id;

      // Build the orders query
      const ordersRef = collection(db, "orders");
      let ordersQuery = query(
        ordersRef,
        where("business_id", "==", businessId),
        orderBy("created_at", "desc"),
        limit(50) // Fetch a reasonable number of orders
      );

      // Apply pagination if not resetting
      if (!reset && lastVisible) {
        ordersQuery = query(ordersQuery, startAfter(lastVisible));
      }

      const ordersSnapshot = await getDocs(ordersQuery);

      // Process orders
      const fetchedOrders = ordersSnapshot.docs.map((doc) =>
        convertFirestoreData({ id: doc.id, ...(doc.data() || {}) })
      );

      // Update state
      if (reset) {
        setAllOrders(fetchedOrders);
      } else {
        setAllOrders((prev) => [...prev, ...fetchedOrders]);
      }

      // Set the last visible document for pagination
      const lastDoc = ordersSnapshot.docs[ordersSnapshot.docs.length - 1];
      setLastVisible(lastDoc);
      setHasMore(ordersSnapshot.docs.length === 50);

      // Apply filters to the fetched orders
      applyFilters(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to orders
  const applyFilters = (orders = allOrders) => {
    let result = [...orders];

    // Filter by status
    if (filters.status && filters.status !== "all") {
      result = result.filter(
        (order) => order.status.toLowerCase() === filters.status
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(search) ||
          (order.customer?.name &&
            order.customer.name.toLowerCase().includes(search)) ||
          (order.customer?.email &&
            order.customer.email.toLowerCase().includes(search)) ||
          (order.customer?.phone &&
            order.customer.phone.toLowerCase().includes(search))
      );
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = filters.startDate;
      result = result.filter((order) => {
        const orderDate = order.created_at;
        return orderDate >= startDate;
      });
    }

    if (filters.endDate) {
      const endDate = filters.endDate;
      result = result.filter((order) => {
        const orderDate = order.created_at;
        return orderDate <= endDate;
      });
    }

    setFilteredOrders(result);
  };

  // Update filters
  const updateFilters = (newFilters: any) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      return updated;
    });
  };

  // Watch for filter changes and apply them
  useEffect(() => {
    applyFilters();
  }, [filters, allOrders]);

  // Fetch order items for the selected order
  const fetchOrderItems = async (orderId: string) => {
    try {
      setItemsLoading(true);

      // Get items from order_items subcollection
      const itemsRef = collection(db, "orders", orderId, "items");
      const itemsSnapshot = await getDocs(itemsRef);

      const items = itemsSnapshot.docs.map((doc) =>
        convertFirestoreData({ id: doc.id, ...(doc.data() || {}) })
      );

      // Ensure all items have required fields
      const processedItems = items.map((item) => ({
        ...item,
        name: item.name || "Unknown Product",
        price: item.price || 0,
        quantity: item.quantity || 1,
        total:
          item.total || (item.price ? item.price * (item.quantity || 1) : 0),
      }));

      setOrderItems(processedItems);
      return processedItems;
    } catch (error) {
      console.error("Error fetching order items:", error);
      toast({
        title: "Error",
        description: "Failed to load order items",
        variant: "destructive",
      });
      return [];
    } finally {
      setItemsLoading(false);
    }
  };

  // Enhanced function to set the selected order and load its details
  const selectOrder = async (order: any) => {
    try {
      if (!order) {
        setSelectedOrder(null);
        setOrderItems([]);
        return;
      }

      // If we only have a partial order object, fetch the full details
      if (!order.customer || !order.shipping_address) {
        const fullOrder = await getOrderById(order.id);
        if (fullOrder) {
          setSelectedOrder(fullOrder);
        } else {
          setSelectedOrder(order); // Fallback to the partial data
        }
      } else {
        setSelectedOrder(order);
      }

      // Always fetch the latest items
      await fetchOrderItems(order.id);
    } catch (error) {
      console.error("Error selecting order:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
      // Still set the order with what we have to avoid a blank state
      setSelectedOrder(order);
    }
  };

  // Watch for selected order changes
  useEffect(() => {
    if (selectedOrder) {
      // This is now handled by the selectOrder function
      // Keeping this effect for any additional side effects that might be needed
    } else {
      setOrderItems([]);
    }
  }, [selectedOrder?.id]);

  // Get a single order by ID with complete details
  const getOrderById = async (orderId: string) => {
    try {
      setLoading(true);

      // Get the order document
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        return null;
      }

      // Convert the data and timestamps
      const orderData = convertFirestoreData({
        id: orderDoc.id,
        ...(orderDoc.data() || {}),
      });

      // If the order has a customer ID, fetch the customer details
      if (orderData.customer?.id) {
        try {
          const customerDoc = await getDoc(
            doc(db, "customers", orderData.customer.id)
          );
          if (customerDoc.exists()) {
            const customerData = convertFirestoreData({
              id: customerDoc.id,
              ...(customerDoc.data() || {}),
            });

            // Merge customer data, keeping original customer fields from order
            orderData.customer = {
              ...orderData.customer,
              ...customerData,
              // Ensure the embedded customer fields take precedence if they differ
              name: orderData.customer.name || customerData.name,
              email: orderData.customer.email || customerData.email,
              phone: orderData.customer.phone || customerData.phone,
            };

            // Add a flag to indicate this customer has full details
            orderData.customer.hasFullDetails = true;
          }
        } catch (customerError) {
          console.error("Error fetching customer details:", customerError);
          // Continue with the order's embedded customer data
        }
      }

      // Ensure all required fields have at least default values
      const ensuredOrder = {
        ...orderData,
        status: orderData.status || "pending",
        shipping_method: orderData.shipping_method || "pickup",
        payment_status: orderData.payment_status || "unpaid",
        payment_method: orderData.payment_method || "Unknown",
        subtotal: orderData.subtotal || 0,
        shipping_fee: orderData.shipping_fee || 0,
        tax: orderData.tax || 0,
        total: orderData.total || 0,
        item_count: orderData.item_count || 0,
        shipping_address: orderData.shipping_address || "",
        city: orderData.city || "",
        customer: orderData.customer || {
          name: "Unknown Customer",
          email: "",
          phone: "",
        },
      };

      return ensuredOrder;
    } catch (error) {
      console.error("Error fetching order:", error);
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


  

  // Update order status
  const updateStatus = async (
    orderId: string,
    status: OrderStatus,
    notes?: string
  ): Promise<boolean> => {
    try {
      const orderRef = doc(db, "orders", orderId);

      // Assume businessId is available from context or auth
      const businessId = auth.currentUser?.uid || ""; // Replace if needed

      // Get status color
      const statusColor = await getStatusColorByName(businessId, status);

      const updateData: any = {
        status,
        status_color: statusColor,
        updated_at: serverTimestamp(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      if (status === "completed") {
        updateData.completed_at = serverTimestamp();
      }

      await updateDoc(orderRef, updateData);

      const historyRef = collection(db, "order_history");
      await addDoc(historyRef, {
        order_id: orderId,
        status,
        status_color: statusColor,
        notes: notes || "",
        created_by: auth.currentUser?.uid || "",
        created_at: serverTimestamp(),
      });

      setAllOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
                status_color: statusColor,
                updated_at: new Date(),
                notes: notes || order.notes,
              }
            : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                status,
                status_color: statusColor,
                updated_at: new Date(),
                notes: notes || prev.notes,
              }
            : null
        );
      }

      toast({
        title: "Status Updated",
        description: `Order status changed to ${status}`,
      });

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      return false;
    }
  };
  

  // Load more orders
  const loadMore = async () => {
    if (!hasMore) return;

    await fetchOrders(false);
  };

  // Cancel an order
  const cancelOrder = async (orderId: string, note?: string) => {
    try {
      // Get the order document first to check if cancelable
      const orderRef = doc(db, "orders", orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
        return false;
      }

      const orderData = orderDoc.data();

      // Check if order is already canceled or completed
      if (orderData.status === "canceled") {
        toast({
          title: "Error",
          description: "Order is already canceled",
          variant: "destructive",
        });
        return false;
      }

      if (orderData.status === "completed") {
        toast({
          title: "Error",
          description: "Cannot cancel a completed order",
          variant: "destructive",
        });
        return false;
      }

      // Update the order status to canceled
      await updateDoc(orderRef, {
        status: "canceled",
        updated_at: serverTimestamp(),
        cancellation_note: note || "",
        canceled_at: serverTimestamp(),
      });

      // Add entry to order history
      await addDoc(collection(db, "order_history"), {
        order_id: orderId,
        status: "canceled",
        notes: note || "Order canceled",
        created_by: auth.currentUser?.uid || "",
        created_at: serverTimestamp(),
      });

      // Send notification if needed
      if (orderData.customer?.email && note) {
        // In a real application, you'd call a cloud function or service here
        // to send an email notification to the customer
        console.log(
          `Would send email to ${orderData.customer.email} with note: ${note}`
        );
      }

      // Update the orders list to reflect the cancellation
      setAllOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "canceled",
                updated_at: new Date(),
                cancellation_note: note || "",
                canceled_at: new Date(),
              }
            : order
        )
      );

      // Update selected order if this is the one being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          status: "canceled",
          updated_at: new Date(),
          cancellation_note: note || "",
          canceled_at: new Date(),
        }));
      }

      // Show success message
      toast({
        title: "Order Canceled",
        description: "The order has been canceled successfully",
      });

      return true;
    } catch (error) {
      console.error("Error canceling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    allOrders,
    filteredOrders,
    selectedOrder,
    setSelectedOrder: selectOrder, // Replace with enhanced function
    getOrderById,
    cancelOrder,
    orderItems,
    loading,
    itemsLoading,
    hasMore,
    filters,
    loadMore,
    updateFilters,
    updateStatus,
    fetchOrderItems,
  };
}
