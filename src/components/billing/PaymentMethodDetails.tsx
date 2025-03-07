
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const paymentMethodSchema = z.object({
  cardHolderName: z.string().min(1, "Card holder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
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
}

const PaymentMethodDetails = ({ 
  selectedMethod, 
  onClose,
  onSave,
  onDelete,
  isEditing = false,
  onEdit
}: PaymentMethodDetailsProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: selectedMethod ? {
      cardHolderName: selectedMethod.cardHolderName,
      cardNumber: `************${selectedMethod.lastFour}`,
      expiryDate: selectedMethod.expiryDate,
      cvv: ''
    } : undefined
  });

  const onSubmit = (data: PaymentMethodForm) => {
    onSave(data);
    toast({
      title: selectedMethod ? "Payment method updated" : "Payment method added",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const handleDelete = () => {
    if (selectedMethod && onDelete) {
      onDelete(selectedMethod.id);
      toast({
        title: "Payment method deleted",
        description: "The payment method has been removed successfully.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardHolderName">Card Holder Name</Label>
              <Input
                id="cardHolderName"
                {...register("cardHolderName")}
                defaultValue={selectedMethod?.cardHolderName}
              />
              {errors.cardHolderName && (
                <p className="text-sm text-destructive">
                  {errors.cardHolderName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                {...register("cardNumber")}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && (
                <p className="text-sm text-destructive">
                  {errors.cardNumber.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  {...register("expiryDate")}
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="text-sm text-destructive">
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  {...register("cvv")}
                  placeholder="123"
                />
                {errors.cvv && (
                  <p className="text-sm text-destructive">
                    {errors.cvv.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button type="submit" className="flex-1">
                {isEditing ? "Save Changes" : "Add Payment Method"}
              </Button>

              {isEditing && selectedMethod && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" type="button" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this payment method?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodDetails;
