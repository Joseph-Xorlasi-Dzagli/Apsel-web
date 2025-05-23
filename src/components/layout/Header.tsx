import { useState, useEffect } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBusiness } from "@/hooks/useBusiness";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertFirestoreData } from "@/utils/dbUtils";
import { Skeleton } from "@/components/ui/skeleton";

// Type for notifications
interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  date: Date;
  actionUrl?: string;
}

export function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuthContext();
  const { business, loading: businessLoading } = useBusiness();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (businessLoading || !business) return;

      try {
        setLoading(true);

        const notificationsRef = collection(db, "order_notifications");
        const q = query(
          notificationsRef,
          where("business_id", "==", business.id),
          where("is_read", "==", false),
          orderBy("created_at", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const notificationsList: Notification[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notificationsList.push({
            id: doc.id,
            title: data.title || "",
            description: data.message || "",
            type: data.type || "system",
            isRead: false,
            date: data.created_at ? data.created_at.toDate() : new Date(),
            actionUrl: data.action_url || getActionUrl(data),
          });
        });

        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [business, businessLoading]);

  // Generate action URL based on notification type
  const getActionUrl = (data: any): string => {
    if (data.order_id) {
      return `/orders/${data.order_id}`;
    } else if (data.type === "inventory") {
      return "/inventory";
    } else if (data.type === "system" && data.subject === "sales_report") {
      return "/analytics";
    }
    return "";
  };

  // Format the time relative to now
  const formatRelativeTime = (date: Date): string => {
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

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const notificationRef = doc(db, "order_notifications", id);
      await updateDoc(notificationRef, {
        is_read: true,
        updated_at: serverTimestamp(),
      });

      // Update local state
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Navigate to settings
  const goToSettings = () => {
    navigate("/settings");
  };

  // Navigate to profile
  const goToProfile = () => {
    navigate("/business-hub");
  };

  if (isMobile) {
    return (
      <div className="flex justify-end items-center p-4 mr-4">
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Link to="/notifications">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-blue-600">
                    View all
                  </Button>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loading ? (
                <div className="p-3 space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-1/4 mt-1" />
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3">
                    <div className="flex justify-between w-full">
                      <span className="font-medium">{notification.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="h-auto p-0 text-xs text-muted-foreground">
                        Mark as read
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {notification.description}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(notification.date)}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={business?.logo_url || ""} />
                  <AvatarFallback className="bg-brand/10 text-brand">
                    {business?.name ? business.name.charAt(0) : "B"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={goToProfile}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={goToSettings}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell size={18} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand text-white text-[10px] rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              <Link to="/notifications">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-blue-600">
                  View all
                </Button>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {loading ? (
              <div className="p-3 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2 w-1/4 mt-1" />
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="h-auto p-0 text-xs text-muted-foreground">
                      Mark as read
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {notification.description}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(notification.date)}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={business?.logo_url || ""} />
                <AvatarFallback className="bg-brand/10 text-brand">
                  {business?.name ? business.name.charAt(0) : "B"}
                </AvatarFallback>
              </Avatar>
              <span>{business?.name || "Business"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={goToProfile}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={goToSettings}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
