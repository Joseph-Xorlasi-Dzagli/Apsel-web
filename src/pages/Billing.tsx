
import { useState } from "react";
import { ArrowLeft, Plus, CreditCard, CheckCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Billing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>("merchant");
  const [paymentMethod, setPaymentMethod] = useState<string>("gpay");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(true);

  const handleSubscribe = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      toast({
        title: "Subscription Confirmed",
        description: "Your Merchant plan is now active.",
      });
    }, 2000);
  };

  const handleSelectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Billing</h1>
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
            <h2 className="text-xl font-bold mb-2">Thank you for subscribing!</h2>
            <p className="mb-6 text-muted-foreground">Enjoy Your Merchant Plan</p>
            <Button 
              className="w-full" 
              onClick={() => setShowSuccess(false)}
            >
              LET'S GO!
            </Button>
          </div>
        </div>
      ) : null}

      <Card className="mb-6 bg-brand-light border-0">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground uppercase">CURRENT PACKAGE</p>
          <h2 className="text-2xl font-bold text-brand mt-1">Merchant</h2>
          <p className="text-sm mb-2">You're saving 20%</p>
          <p className="text-brand font-medium">Renews in 3days</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Billing Account</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full bg-brand hover:bg-brand-dark">
              <Plus className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Payment Method</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-brand' : ''}`}
                onClick={() => handleSelectPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span>Credit/Debit Card</span>
                </div>
                {paymentMethod === 'card' && <CheckCircle className="h-5 w-5 text-brand" />}
              </div>
              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'gpay' ? 'border-brand' : ''}`}
                onClick={() => handleSelectPaymentMethod('gpay')}
              >
                <div className="flex items-center gap-3">
                  <span>Google Pay</span>
                </div>
                {paymentMethod === 'gpay' && <CheckCircle className="h-5 w-5 text-brand" />}
              </div>
              <Button className="w-full mt-6" onClick={() => setHasPaymentMethod(true)}>
                Save Payment Method
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {hasPaymentMethod ? (
        <div className="space-y-3 mb-10">
          <div 
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'gpay' ? 'border-brand' : ''}`}
            onClick={() => handleSelectPaymentMethod('gpay')}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">UPI</span>
            </div>
            <div className={`w-5 h-5 rounded border ${paymentMethod === 'gpay' ? 'bg-brand' : ''}`} />
          </div>
          <div 
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'visa' ? 'border-brand' : ''}`}
            onClick={() => handleSelectPaymentMethod('visa')}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">Visa</span>
            </div>
            <div className={`w-5 h-5 rounded border ${paymentMethod === 'visa' ? 'bg-brand' : ''}`} />
          </div>
          <div 
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'mastercard' ? 'border-brand' : ''}`}
            onClick={() => handleSelectPaymentMethod('mastercard')}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">Master Card</span>
            </div>
            <div className={`w-5 h-5 rounded border ${paymentMethod === 'mastercard' ? 'bg-brand' : ''}`} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 mb-10">
          <div className="bg-brand-light p-4 rounded-lg mb-4">
            <CreditCard className="h-12 w-12 text-brand" />
          </div>
          <h3 className="text-xl font-bold mb-2">Add billing account</h3>
          <p className="text-center text-muted-foreground mb-8">
            It seems like you haven't yet added any billing account.
          </p>
        </div>
      )}

      <Button 
        className="w-full bg-brand hover:bg-brand-dark text-white font-bold uppercase"
        onClick={() => navigate("/billing/plans")}  
      >
        Choose Subscription Plan
      </Button>
    </div>
  );
};

export default Billing;
