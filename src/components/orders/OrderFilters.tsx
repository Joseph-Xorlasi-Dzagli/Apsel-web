
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderFiltersProps {
  statusFilter: OrderStatus | "all";
  setStatusFilter: (status: OrderStatus | "all") => void;
  timeFilter: "today" | "week" | "month" | "all";
  setTimeFilter: (time: "today" | "week" | "month" | "all") => void;
}

export function OrderFilters({
  statusFilter,
  setStatusFilter,
  timeFilter,
  setTimeFilter,
}: OrderFiltersProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">Status</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className={isMobile ? "flex-1" : ""}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={isMobile ? "flex-1" : ""}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "processing" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("processing")}
            className={isMobile ? "flex-1" : ""}
          >
            Processing
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
            className={isMobile ? "flex-1" : ""}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === "canceled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("canceled")}
            className={isMobile ? "flex-1" : ""}
          >
            Canceled
          </Button>
        </div>
      </div>

      <div className={isMobile ? "mt-2" : "ml-auto"}>
        <h3 className="mb-2 text-sm font-medium text-foreground">Time Period</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={timeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("all")}
          >
            All Time
          </Button>
          <Button
            variant={timeFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("today")}
          >
            Today
          </Button>
          <Button
            variant={timeFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("week")}
          >
            This Week
          </Button>
          <Button
            variant={timeFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("month")}
          >
            This Month
          </Button>
        </div>
      </div>
    </div>
  );
}
