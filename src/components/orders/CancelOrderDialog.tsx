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
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sendNote: boolean, note?: string) => void;
  orderId: string;
}

// Define validation schema with Zod
const cancelOrderSchema = z.object({
  sendNote: z.boolean().default(false),
  note: z
    .string()
    .max(500, "Note must be less than 500 characters")
    .optional()
    .refine(
      (val) => {
        // If sendNote is true, note must not be empty
        return val !== "" && val !== undefined;
      },
      {
        message: "Please add a note to the customer",
        path: ["note"],
      }
    ),
});

type CancelOrderForm = z.infer<typeof cancelOrderSchema>;

export function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  orderId,
}: CancelOrderDialogProps) {
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<CancelOrderForm>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: {
      sendNote: false,
      note: "",
    },
    mode: "onChange",
  });

  const watchSendNote = form.watch("sendNote");

  const handleConfirm = (data: CancelOrderForm) => {
    setSubmitAttempted(true);

    // If sendNote is true but note is empty, show validation error
    if (data.sendNote && (!data.note || data.note.trim() === "")) {
      form.setError("note", {
        type: "manual",
        message: "Please add a note to the customer",
      });
      return;
    }

    onConfirm(data.sendNote, data.sendNote ? data.note : undefined);
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4">
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                Canceling this order will immediately notify the customer and
                update their order status.
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="sendNote"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="sendNote"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="sendNote" className="text-sm">
                    Send note to customer
                  </Label>
                </FormItem>
              )}
            />

            {watchSendNote && (
              <>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add note to customer"
                          className="h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert className="bg-muted">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    The note will be included in the cancellation email sent to
                    the customer.
                  </AlertDescription>
                </Alert>
              </>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
