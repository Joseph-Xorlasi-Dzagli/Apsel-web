
import { useState } from "react";
import { Bell, Check, Trash2, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the notification type
type NotificationType = "order" | "inventory" | "system" | "promotion";

// Define the notification interface
interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  isRead: boolean;
  date: Date;
  actionUrl?: string;
}

const Notifications = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Order Received",
      description: "You have received a new order #ORD-12345 for $125.99",
      type: "order",
      isRead: false,
      date: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      actionUrl: "/orders/12345"
    },
    {
      id: "2",
      title: "Low Stock Alert",
      description: "Wireless Headphones is running low on stock (Only 3 left)",
      type: "inventory",
      isRead: false,
      date: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      actionUrl: "/inventory"
    },
    {
      id: "3",
      title: "Payment Received",
      description: "Payment of $89.99 received for order #ORD-12340",
      type: "order",
      isRead: true,
      date: new Date(Date.now() - 5 * 3600000), // 5 hours ago
      actionUrl: "/orders/12340"
    },
    {
      id: "4",
      title: "System Maintenance",
      description: "Scheduled maintenance will occur tomorrow at 2:00 AM UTC",
      type: "system",
      isRead: true,
      date: new Date(Date.now() - 24 * 3600000), // 1 day ago
    },
    {
      id: "5",
      title: "Weekly Sales Report",
      description: "Your weekly sales report is now available",
      type: "system",
      isRead: false,
      date: new Date(Date.now() - 48 * 3600000), // 2 days ago
      actionUrl: "/analytics"
    },
    {
      id: "6",
      title: "Flash Sale Starting",
      description: "Your scheduled 24-hour flash sale starts tomorrow",
      type: "promotion",
      isRead: true,
      date: new Date(Date.now() - 72 * 3600000), // 3 days ago
    },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState("all");
  
  // State for filter selections
  const [filters, setFilters] = useState({
    order: true,
    inventory: true,
    system: true,
    promotion: true,
  });

  // Format the date relative to now
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  // Filter notifications based on active tab and filter selections
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread" && notification.isRead) {
      return false;
    }
    
    if (activeTab === "read" && !notification.isRead) {
      return false;
    }
    
    return filters[notification.type];
  });

  // Get notification type badge
  const getNotificationTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "order":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Order</Badge>;
      case "inventory":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Inventory</Badge>;
      case "system":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">System</Badge>;
      case "promotion":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Promotion</Badge>;
      default:
        return null;
    }
  };

  // Toggle a filter
  const toggleFilter = (type: NotificationType) => {
    setFilters({ ...filters, [type]: !filters[type] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and stay updated
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter size={16} />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by type</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="order"
                      checked={filters.order}
                      onCheckedChange={() => toggleFilter("order")}
                    />
                    <label htmlFor="order" className="text-sm font-medium">
                      Orders
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inventory"
                      checked={filters.inventory}
                      onCheckedChange={() => toggleFilter("inventory")}
                    />
                    <label htmlFor="inventory" className="text-sm font-medium">
                      Inventory
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="system"
                      checked={filters.system}
                      onCheckedChange={() => toggleFilter("system")}
                    />
                    <label htmlFor="system" className="text-sm font-medium">
                      System
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="promotion"
                      checked={filters.promotion}
                      onCheckedChange={() => toggleFilter("promotion")}
                    />
                    <label htmlFor="promotion" className="text-sm font-medium">
                      Promotions
                    </label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="gap-1">
            <Check size={16} />
            <span>Mark all as read</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            className="gap-1">
            <Trash2 size={16} />
            <span>Clear all</span>
          </Button>
        </div>
      </div>

      <Card className="border-none">
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList
              className={`w-full grid ${
                isMobile ? "grid-cols-3" : "grid-cols-3 w-[400px] mx-auto"
              } mb-4`}>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {notifications.filter((n) => !n.isRead).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>

            <TabsContent value="read" className="mt-0">
              {renderNotificationList(filteredNotifications)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  // Helper function to render notification list
  function renderNotificationList(notifications: Notification[]) {
    if (notifications.length === 0) {
      return (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>No notifications</AlertTitle>
          <AlertDescription>
            You don't have any {activeTab === "unread" ? "unread" : activeTab === "read" ? "read" : ""} notifications at the moment.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-lg border transition-colors ${
              notification.isRead ? "bg-white" : "bg-blue-50"
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  notification.type === "order" ? "bg-blue-100" :
                  notification.type === "inventory" ? "bg-amber-100" :
                  notification.type === "system" ? "bg-purple-100" :
                  "bg-green-100"
                }`}>
                  <Bell className={`h-4 w-4 ${
                    notification.type === "order" ? "text-blue-700" :
                    notification.type === "inventory" ? "text-amber-700" :
                    notification.type === "system" ? "text-purple-700" :
                    "text-green-700"
                  }`} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {getNotificationTypeBadge(notification.type)}
                    {!notification.isRead && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-gray-400">{formatDate(notification.date)}</p>
                    {notification.actionUrl && (
                      <a href={notification.actionUrl} className="text-xs text-blue-600 hover:underline">View details</a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                {!notification.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default Notifications;
