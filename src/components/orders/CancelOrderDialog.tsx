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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sendNote: boolean, note?: string) => void;
  orderId: string;
}

export function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}: CancelOrderDialogProps) {
  const [sendNote, setSendNote] = useState(false);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(sendNote, sendNote ? note : undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Order #{orderId}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently cancel the order
            and remove it from active orders.
          </DialogDescription>
        </DialogHeader>

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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="destructive">
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
