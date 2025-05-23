import { useEffect } from "react";
import { Bell, Check, Trash2, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  useNotifications,
  NotificationType
} from "@/hooks/UseNotifications";

const Notifications = () => {
  const isMobile = useIsMobile();
  const {
    filteredNotifications,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    formatDate,
    loadMoreNotifications, 
    hasMore,
  } = useNotifications();

  // Toggle a filter
  const toggleFilter = (type: NotificationType) => {
    setFilters({ ...filters, [type]: !filters[type] });
  };

  // Get notification type badge
  const getNotificationTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "order":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200">
            Order
          </Badge>
        );
      case "inventory":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200">
            Inventory
          </Badge>
        );
      case "system":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200">
            System
          </Badge>
        );
      case "promotion":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200">
            Promotion
          </Badge>
        );
      default:
        return null;
    }
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

      {/* Search input */}
      <div className="max-w-md mb-4">
        <Input
          type="search"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <Card className="border-none">
        <CardContent>
          <Tabs
            defaultValue="all"
            onValueChange={setActiveTab}
            value={activeTab}>
            <TabsList
              className={`w-full grid ${
                isMobile ? "grid-cols-3" : "grid-cols-3 w-[400px] mx-auto"
              } mb-4`}>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {filteredNotifications.filter((n) => !n.isRead).length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filteredNotifications.filter((n) => !n.isRead).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {loading && filteredNotifications.length === 0 ? (
                <LoadingState />
              ) : (
                renderNotificationList(filteredNotifications)
              )}
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              {loading && filteredNotifications.length === 0 ? (
                <LoadingState />
              ) : (
                renderNotificationList(filteredNotifications)
              )}
            </TabsContent>

            <TabsContent value="read" className="mt-0">
              {loading && filteredNotifications.length === 0 ? (
                <LoadingState />
              ) : (
                renderNotificationList(filteredNotifications)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  // Loading state
  function LoadingState() {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg border">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-60" />
                  <Skeleton className="h-2 w-20 mt-2" />
                </div>
              </div>
              <div className="flex space-x-1">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Helper function to render notification list
  function renderNotificationList(notifications: any[]) {
    if (notifications.length === 0) {
      return (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertTitle>No notifications</AlertTitle>
          <AlertDescription>
            You don't have any{" "}
            {activeTab === "unread"
              ? "unread"
              : activeTab === "read"
              ? "read"
              : ""}{" "}
            notifications at the moment.
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
            }`}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    notification.type === "order"
                      ? "bg-blue-100"
                      : notification.type === "inventory"
                      ? "bg-amber-100"
                      : notification.type === "system"
                      ? "bg-purple-100"
                      : "bg-green-100"
                  }`}>
                  <Bell
                    className={`h-4 w-4 ${
                      notification.type === "order"
                        ? "text-blue-700"
                        : notification.type === "inventory"
                        ? "text-amber-700"
                        : notification.type === "system"
                        ? "text-purple-700"
                        : "text-green-700"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {getNotificationTypeBadge(notification.type)}
                    {!notification.isRead && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {notification.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-gray-400">
                      {formatDate(notification.date)}
                    </p>
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="text-xs text-blue-600 hover:underline">
                        View details
                      </a>
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
                    title="Mark as read">
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Load more button */}
        {hasMore && (
          <div className="pt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={loadMoreNotifications}
              disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
};

export default Notifications;
