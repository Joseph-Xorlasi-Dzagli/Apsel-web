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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XCircle } from "lucide-react";

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

  const handleCancel = () => {
    onConfirm(sendNote, sendNote ? note : undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Cancel Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order #{orderId}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="send-note"
                checked={sendNote}
                onChange={(e) => setSendNote(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="send-note" className="font-normal">
                Send a note to the customer
              </Label>
            </div>

            {sendNote && (
              <Textarea
                id="note"
                placeholder="Enter a note to the customer explaining the cancelation"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px]"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No, go back
          </Button>
          <Button variant="destructive" onClick={handleCancel}>
            Yes, cancel order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
