// OrderStatusDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBusiness } from "@/hooks/useBusiness";
import { getOrderStatusesByBusiness } from "@/services/firestoreService";
import { useToast } from "@/hooks/use-toast";

// Order status type
export type OrderStatus = string;

// Status object interface
interface StatusItem {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface OrderStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    status: OrderStatus,
    sendNote: boolean,
    note?: string
  ) => Promise<void>;
  orderCount?: number;
  mode?: "status" | "delete";
  orderId?: string;
  currentStatus?: OrderStatus;
}


export function OrderStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  orderCount,
  orderId,
  mode = "status",
  currentStatus,
}: OrderStatusDialogProps) {
  const { business } = useBusiness();
  const { toast } = useToast();

  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedStatusColor, setSelectedStatusColor] = useState<string>("");
  const [sendNote, setSendNote] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch statuses from Firestore
  useEffect(() => {
    const fetchStatuses = async () => {
      if (!business || !isOpen) return;

      try {
        setLoading(true);
        const fetchedStatuses = await getOrderStatusesByBusiness(business.id);

        // If no custom statuses found, use defaults
        if (fetchedStatuses.length === 0) {
          const defaultStatuses = [
            {
              id: "pending",
              name: "Pending",
              color: "#f59e0b",
              description: "Order is awaiting processing",
            },
            {
              id: "processing",
              name: "Processing",
              color: "#3b82f6",
              description: "Order is being processed",
            },
            {
              id: "completed",
              name: "Completed",
              color: "#10b981",
              description: "Order has been fulfilled",
            },
            {
              id: "canceled",
              name: "Canceled",
              color: "#ef4444",
              description: "Order has been canceled",
            },
          ];

          setStatuses(defaultStatuses);

          // Find matching status from defaults
          if (currentStatus) {
            const matchedStatus = defaultStatuses.find(
              (s) => s.name.toLowerCase() === currentStatus.toLowerCase()
            );

            if (matchedStatus) {
              setSelectedStatus(matchedStatus.id);
              setSelectedStatusColor(matchedStatus.color);
            } else {
              setSelectedStatus(defaultStatuses[0].id);
              setSelectedStatusColor(defaultStatuses[0].color);
            }
          } else {
            setSelectedStatus(defaultStatuses[0].id);
            setSelectedStatusColor(defaultStatuses[0].color);
          }
        } else {
          setStatuses(fetchedStatuses);

          // Find matching status by name (case insensitive)
          if (currentStatus) {
            const matchedStatus = fetchedStatuses.find(
              (s) => s.name.toLowerCase() === currentStatus.toLowerCase()
            );

            if (matchedStatus) {
              setSelectedStatus(matchedStatus.id);
              setSelectedStatusColor(matchedStatus.color);
              console.log("Matched status:", matchedStatus);
            } else {
              setSelectedStatus(fetchedStatuses[0].id);
              setSelectedStatusColor(fetchedStatuses[0].color);
            }
          } else {
            setSelectedStatus(fetchedStatuses[0].id);
            setSelectedStatusColor(fetchedStatuses[0].color);
          }
        }
      } catch (error) {
        console.error("Error fetching order statuses:", error);
        toast({
          title: "Error",
          description: "Failed to load order statuses",
          variant: "destructive",
        });

        // Fallback to default statuses
        const defaultStatuses = [
          {
            id: "pending",
            name: "Pending",
            color: "#f59e0b",
            description: "Order is awaiting processing",
          },
          {
            id: "processing",
            name: "Processing",
            color: "#3b82f6",
            description: "Order is being processed",
          },
          {
            id: "completed",
            name: "Completed",
            color: "#10b981",
            description: "Order has been fulfilled",
          },
          {
            id: "canceled",
            name: "Canceled",
            color: "#ef4444",
            description: "Order has been canceled",
          },
        ];

        setStatuses(defaultStatuses);

        // Select the current status or default
        if (currentStatus) {
          const matchedStatus = defaultStatuses.find(
            (s) => s.name.toLowerCase() === currentStatus.toLowerCase()
          );

          if (matchedStatus) {
            setSelectedStatus(matchedStatus.id);
            setSelectedStatusColor(matchedStatus.color);
          } else {
            setSelectedStatus("processing");
            setSelectedStatusColor("#3b82f6");
          }
        } else {
          setSelectedStatus("processing");
          setSelectedStatusColor("#3b82f6");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [business, isOpen, currentStatus, toast]);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      let finalStatusName = "";
      let finalStatusColor = "";

      if (mode === "status") {
        const selectedStatusObj = statuses.find((s) => s.id === selectedStatus);

        if (selectedStatusObj) {
          finalStatusName = selectedStatusObj.name;
          finalStatusColor = selectedStatusObj.color || "#6b7280"; // Gray fallback
        } else {
          finalStatusName = selectedStatus;
          finalStatusColor = "#6b7280"; // Fallback color
        }
      } else {
        const canceledStatus = statuses.find(
          (s) => s.name.toLowerCase() === "canceled"
        );

        finalStatusName = canceledStatus?.name || "Canceled";
        finalStatusColor = canceledStatus?.color || "#ef4444";
      }

      await onConfirm(
        finalStatusName,
        sendNote,
        sendNote ? note : undefined,
      );

      // Reset form on success
      setNote("");
      setSendNote(false);
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleStatusSelect = (statusId: string) => {
    setSelectedStatus(statusId);

    // Also set the color
    const selectedStatusObj = statuses.find((s) => s.id === statusId);
    if (selectedStatusObj) {
      setSelectedStatusColor(selectedStatusObj.color);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {!orderId
              ? mode === "status"
                ? `Change Status for ${orderCount} Order${
                    orderCount > 1 ? "s" : ""
                  }`
                : `Cancel and Delete ${orderCount} Order${
                    orderCount > 1 ? "s" : ""
                  }?`
              : mode === "status"
              ? `Change Status for Order #${orderId}`
              : ""}
          </DialogTitle>
          <DialogDescription>
            {mode === "status"
              ? "Select a new status for the selected orders."
              : "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {mode === "status" && (
          <div className="grid gap-4 py-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {statuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted"
                    onClick={() => handleStatusSelect(status.id)}>
                    <Checkbox
                      id={status.id}
                      checked={selectedStatus === status.id}
                    />
                    <div className="grid gap-1.5">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={status.id}
                          className="text-base font-medium">
                          {status.name}
                        </Label>
                        <div
                          className="h-4 w-4 rounded-sm"
                          style={{ backgroundColor: status.color }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {status.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Note to customer section */}
        <div className="space-y-3">
          {sendNote && (
            <Textarea
              placeholder="Add note to customer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-24"
            />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendNote"
              checked={sendNote}
              onCheckedChange={(checked) => setSendNote(checked === true)}
            />
            <Label htmlFor="sendNote" className="text-sm">
              Send note to customer
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting || loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant={mode === "delete" ? "destructive" : "default"}
            disabled={isSubmitting || loading}>
            {isSubmitting ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
