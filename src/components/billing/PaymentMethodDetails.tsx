import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Pencil, Trash2, X, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

const paymentMethodSchema = z.object({
  cardHolderName: z.string().min(3, "Card holder name must be at least 3 characters"),
  cardNumber: z.string()
    .regex(/^\d{16}$/, "Card number must be 16 digits")
    .or(z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Format must be XXXX XXXX XXXX XXXX")),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Format must be MM/YY")
    .refine((value) => {
      const [month, year] = value.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const numYear = parseInt(year, 10);
      const numMonth = parseInt(month, 10);
      
      // Ensure the card doesn't expire in the past
      return numYear > currentYear || (numYear === currentYear && numMonth >= currentMonth);
    }, "Card expiration date must be in the future"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodDetailsProps {
  selectedMethod?: {
    id: string;
    type: string;
    lastFour: string;
    expiryDate: string;
    cardHolderName: string;
  } | null;
  onClose: () => void;
  onSave: (data: PaymentMethodForm) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  isStandalone?: boolean;
}

const PaymentMethodDetails = ({
  selectedMethod,
  onClose,
  onSave,
  onDelete,
  isEditing = false,
  onEdit,
  isStandalone,
}: PaymentMethodDetailsProps) => {
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [formData, setFormData] = useState<PaymentMethodForm | null>(null);

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: selectedMethod
      ? {
          cardHolderName: selectedMethod.cardHolderName,
          cardNumber: `XXXX XXXX XXXX ${selectedMethod.lastFour}`,
          expiryDate: selectedMethod.expiryDate,
          cvv: "",
        }
      : {
          cardHolderName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        },
    mode: "onChange",
  });

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleSubmit = (data: PaymentMethodForm) => {
    setFormData(data);
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    if (formData) {
      onSave(formData);
      setShowSaveConfirm(false);
      toast({
        title: selectedMethod
          ? "Payment method updated"
          : "Payment method added",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedMethod && onDelete) {
      onDelete(selectedMethod.id);
      setShowDeleteConfirm(false);
      toast({
        title: "Payment method deleted",
        description: "The payment method has been removed successfully.",
      });
    }
  };

  return (
    <Card className={`w-full ${isStandalone ? "border-none p-0 m-0" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {!isStandalone && (
          <>
            <CardTitle className="text-xl font-bold">
              {selectedMethod && !isEditing
                ? "Payment Method Details"
                : isEditing
                ? "Edit Payment Method"
                : "Add Payment Method"}
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedMethod && !isEditing && onEdit ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                  type="button">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </CardHeader>
      <CardContent>
        {selectedMethod && !isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  •••• •••• •••• {selectedMethod.lastFour}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {selectedMethod.expiryDate}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Card Holder</Label>
              <p className="text-sm">{selectedMethod.cardHolderName}</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4">
              <Alert className="bg-muted border-muted-foreground/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {isEditing
                    ? "You are editing a payment method. All fields must be filled in again."
                    : "Enter your card details to add a new payment method."}
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="cardHolderName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>Card Holder Name</Label>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>Card Number</Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1234 5678 9012 3456"
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={19} // 16 digits + 3 spaces
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor={field.name}>Expiry Date</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="MM/YY"
                          maxLength={5}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d]/g, "");
                            if (value.length > 2) {
                              value =
                                value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor={field.name}>CVV</Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="123"
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 mt-6">
                {isEditing && selectedMethod && (
                  <Button
                    variant="destructive"
                    type="button"
                    size="icon"
                    onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button type="submit" className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  {isEditing ? "Save Changes" : "Add Payment Method"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Payment Method"
        description="Are you sure you want to delete this payment method? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmationDialog
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={confirmSave}
        title={isEditing ? "Update Payment Method" : "Add Payment Method"}
        description={
          isEditing
            ? "Are you sure you want to save these changes to your payment method?"
            : "Are you sure you want to add this new payment method to your account?"
        }
        confirmText={isEditing ? "Update" : "Add"}
        cancelText="Cancel"
      />
    </Card>
  );
};

export default PaymentMethodDetails;
