
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OrderStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: OrderStatus, sendNote: boolean, note?: string) => void;
  orderCount: number;
  mode?: "status" | "delete";
}

export function OrderStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  orderCount,
  mode = "status"
}: OrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("processing");
  const [sendNote, setSendNote] = useState(false);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    if (mode === "status") {
      onConfirm(selectedStatus, sendNote, sendNote ? note : undefined);
    } else {
      // For delete mode, we don't need a status
      onConfirm("canceled", sendNote, sendNote ? note : undefined);
    }
  };

  const handleStatusSelect = (status: OrderStatus) => {
    setSelectedStatus(status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "status" 
              ? `Change Status for ${orderCount} Order${orderCount > 1 ? 's' : ''}` 
              : `Cancel and Delete ${orderCount} Order${orderCount > 1 ? 's' : ''}?`}
          </DialogTitle>
          <DialogDescription>
            {mode === "status" 
              ? "Select a new status for the selected orders." 
              : "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        
        {mode === "status" && (
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted" onClick={() => handleStatusSelect("processing")}>
                <Checkbox id="processing" checked={selectedStatus === "processing"} />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="processing" className="text-base font-medium">Processing</Label>
                    <div className="h-4 w-4 bg-blue-500 rounded-sm"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Order is being processed</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted" onClick={() => handleStatusSelect("completed")}>
                <Checkbox id="completed" checked={selectedStatus === "completed"} />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="completed" className="text-base font-medium">Completed</Label>
                    <div className="h-4 w-4 bg-green-500 rounded-sm"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Order has been fulfilled</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted" onClick={() => handleStatusSelect("pending")}>
                <Checkbox id="pending" checked={selectedStatus === "pending"} />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pending" className="text-base font-medium">Pending</Label>
                    <div className="h-4 w-4 bg-yellow-500 rounded-sm"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Order is awaiting processing</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted" onClick={() => handleStatusSelect("canceled")}>
                <Checkbox id="canceled" checked={selectedStatus === "canceled"} />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="canceled" className="text-base font-medium">Canceled</Label>
                    <div className="h-4 w-4 bg-red-500 rounded-sm"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Order has been canceled</span>
                </div>
              </div>
            </div>
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
            <Label htmlFor="sendNote" className="text-sm">Send note to customer</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            variant={mode === "delete" ? "destructive" : "default"}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
