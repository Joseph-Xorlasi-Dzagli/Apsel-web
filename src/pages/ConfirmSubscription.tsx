import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  CreditCard,
  CheckCircle,
  Check,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import PaymentMethodDetails from "@/components/billing/PaymentMethodDetails";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ConfirmSubscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("gpay");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] =
    useState<boolean>(false);

  const handleSubscribe = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/billing");
      toast({
        title: "Subscription Confirmed",
        description: "Your Merchant plan is now active.",
      });
    }, 2000);
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  const handleAddPaymentMethod = (data: any) => {
    console.log("New payment method added:", data);
    setShowAddPaymentMethod(false);
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-1"
          onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Confirm Subscription</h1>
      </div>

      {showSuccess ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6 bg-brand rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-white" />
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 h-2 w-2 bg-brand-light rounded-full animate-pulse" />
                <div className="absolute top-4 left-0 h-1 w-1 bg-brand-light rounded-full animate-pulse" />
                <div className="absolute bottom-2 right-4 h-3 w-3 bg-brand-light rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-4 h-2 w-2 bg-brand-light rounded-full animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">
              Thank you for subscribing!
            </h2>
            <p className="mb-6 text-muted-foreground">
              Enjoy Your Merchant Plan
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setShowSuccess(false);
                navigate("/billing");
              }}>
              LET'S GO!
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-brand-light p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-brand">Merchant</h2>
                <p className="text-xl font-bold mt-2">
                  Ghc 150.00<span className="text-sm font-normal">/month</span>
                </p>
                <p className="text-sm mb-2">You're saving 20%</p>
                <p className="text-brand font-medium">Renews 30th March 2024</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select a payment method to complete your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "gpay" ? "border-brand" : ""
                  }`}
                  onClick={() => handleSelectPaymentMethod("gpay")}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">UPI</span>
                    <span className="text-sm text-muted-foreground">
                      ending in 1234
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "gpay"
                        ? "border-brand bg-brand"
                        : "border-gray-300"
                    }`}>
                    {paymentMethod === "gpay" && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "visa" ? "border-brand" : ""
                  }`}
                  onClick={() => handleSelectPaymentMethod("visa")}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Visa</span>
                    <span className="text-sm text-muted-foreground">
                      ending in 5678
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "visa"
                        ? "border-brand bg-brand"
                        : "border-gray-300"
                    }`}>
                    {paymentMethod === "visa" && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                <div
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === "mastercard" ? "border-brand" : ""
                  }`}
                  onClick={() => handleSelectPaymentMethod("mastercard")}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Master Card</span>
                    <span className="text-sm text-muted-foreground">
                      ending in 9012
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "mastercard"
                        ? "border-brand bg-brand"
                        : "border-gray-300"
                    }`}>
                    {paymentMethod === "mastercard" && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-6">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowAddPaymentMethod(true)}>
                  <Plus className="h-4 w-4" />
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span>Merchant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span>Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Ghc 150.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-600">-Ghc 30.00</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Ghc 120.00</span>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  By confirming your subscription, you agree to our Terms of
                  Service and Privacy Policy. You can cancel anytime.
                </p>

                <Button
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold mt-4"
                  onClick={handleSubscribe}>
                  Confirm Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Payment Method Sheet */}
      <Sheet open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Payment Method</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <PaymentMethodDetails
              onClose={() => setShowAddPaymentMethod(false)}
              onSave={handleAddPaymentMethod}
              isStandalone={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ConfirmSubscription;
