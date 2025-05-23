import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertFirestoreData } from "@/utils/dbUtils";

// Define the notification type
export type NotificationType = "order" | "inventory" | "system" | "promotion";

// Define the notification interface
export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  date: Date;
  actionUrl?: string;
  business_id: string;
  order_id?: string;
  customer_id?: string;
}

export function useNotifications() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    order: true,
    inventory: true,
    system: true,
    promotion: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications when business data is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);
        setError(null);

        const notificationsRef = collection(db, "order_notifications");
        const q = query(
          notificationsRef,
          where("business_id", "==", business.id),
          orderBy("created_at", "desc"),
          limit(50) // Increase limit to show more notifications initially
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setNotifications([]);
          setFilteredNotifications([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        const fetchedNotifications: Notification[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedNotifications.push({
            id: doc.id,
            title: data.title || "",
            description: data.message || "",
            type: data.type || "system",
            isRead: data.is_read || false,
            date: data.created_at
              ? (data.created_at as Timestamp).toDate()
              : new Date(),
            actionUrl: data.action_url || generateActionUrl(data),
            business_id: data.business_id,
            order_id: data.order_id,
            customer_id: data.customer_id,
          });
        });

        setNotifications(fetchedNotifications);
        setFilteredNotifications(fetchedNotifications);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(fetchedNotifications.length === 50); // Update this to match our new limit
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [business, businessLoading, toast]);

  // Generate action URL based on notification type
  const generateActionUrl = (data: any): string => {
    if (data.order_id) {
      return `/orders/${data.order_id}`;
    } else if (data.type === "inventory") {
      return "/inventory";
    } else if (data.type === "system" && data.subject === "sales_report") {
      return "/analytics";
    }
    return "";
  };

  // Filter notifications based on active tab and filter selections
  useEffect(() => {
    let filtered = [...notifications];

    // Filter by tab (read status)
    if (activeTab === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead);
    } else if (activeTab === "read") {
      filtered = filtered.filter((notification) => notification.isRead);
    }

    // Filter by type
    filtered = filtered.filter((notification) => filters[notification.type]);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.description.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, filters, searchQuery]);

  // Load more notifications
  const loadMoreNotifications = useCallback(async () => {
    if (!business || !lastVisible || !hasMore) return;

    try {
      setLoading(true);

      const notificationsRef = collection(db, "order_notifications");
      const q = query(
        notificationsRef,
        where("business_id", "==", business.id),
        orderBy("created_at", "desc"),
        startAfter(lastVisible),
        limit(50) // Increase this to match our initial fetch limit
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const fetchedNotifications: Notification[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          id: doc.id,
          title: data.title || "",
          description: data.message || "",
          type: data.type || "system",
          isRead: data.is_read || false,
          date: data.created_at
            ? (data.created_at as Timestamp).toDate()
            : new Date(),
          actionUrl: data.action_url || generateActionUrl(data),
          business_id: data.business_id,
          order_id: data.order_id,
          customer_id: data.customer_id,
        });
      });

      setNotifications((prev) => [...prev, ...fetchedNotifications]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(fetchedNotifications.length === 50); // Update to match new limit
    } catch (err: any) {
      console.error("Error loading more notifications:", err);
      toast({
        title: "Error",
        description: "Failed to load more notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [business, lastVisible, hasMore, toast]);

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "order_notifications", notificationId);
      await updateDoc(notificationRef, {
        is_read: true,
        updated_at: serverTimestamp(),
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!business || notifications.length === 0) return;

    try {
      // Get all unread notification IDs
      const unreadIds = notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => notification.id);

      if (unreadIds.length === 0) return;

      // Update each notification in Firestore
      const updatePromises = unreadIds.map((id) => {
        const notificationRef = doc(db, "order_notifications", id);
        return updateDoc(notificationRef, {
          is_read: true,
          updated_at: serverTimestamp(),
        });
      });

      await Promise.all(updatePromises);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, "order_notifications", notificationId);
      await deleteDoc(notificationRef);

      // Update local state
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (err: any) {
      console.error("Error deleting notification:", err);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!business || notifications.length === 0) return;

    try {
      // Get all notification IDs
      const notificationIds = notifications.map(
        (notification) => notification.id
      );

      // Delete each notification in Firestore
      const deletePromises = notificationIds.map((id) => {
        const notificationRef = doc(db, "order_notifications", id);
        return deleteDoc(notificationRef);
      });

      await Promise.all(deletePromises);

      // Update local state
      setNotifications([]);
      setFilteredNotifications([]);

      toast({
        title: "Success",
        description: "All notifications cleared",
      });
    } catch (err: any) {
      console.error("Error clearing notifications:", err);
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
      });
    }
  };

  // Format the date relative to now
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return {
    notifications,
    filteredNotifications,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    hasMore,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    formatDate,
  };
}
