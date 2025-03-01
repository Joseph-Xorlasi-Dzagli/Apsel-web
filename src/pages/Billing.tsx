
import { useState } from "react";
import { ArrowLeft, Plus, CreditCard, CheckCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 md:hidden" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        </div>
        <Button 
          className="bg-brand hover:bg-brand-dark text-white"
          onClick={() => navigate("/billing/plans")}
        >
          Change Plan
        </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-2 bg-brand-light border-0">
          <CardHeader className="pb-2">
            <p className="text-sm text-muted-foreground uppercase">CURRENT PACKAGE</p>
            <CardTitle className="text-2xl text-brand">Merchant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">You're saving 20%</p>
            <div className="flex justify-between items-center">
              <p className="text-brand font-medium">Renews in 3 days</p>
              <p className="text-2xl font-bold">Ghc 150<span className="text-sm font-normal">/month</span></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={billingPeriod} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="annual" 
                  onClick={() => setBillingPeriod("annual")}
                >
                  Annual (Save 20%)
                </TabsTrigger>
                <TabsTrigger 
                  value="monthly" 
                  onClick={() => setBillingPeriod("monthly")}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Payment Methods</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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
        <Card className="mb-10">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="bg-brand-light p-4 rounded-lg mb-4">
              <CreditCard className="h-12 w-12 text-brand" />
            </div>
            <h3 className="text-xl font-bold mb-2">Add billing account</h3>
            <p className="text-center text-muted-foreground mb-8 max-w-md">
              It seems like you haven't yet added any billing account.
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-brand hover:bg-brand-dark text-white">
                  Add Payment Method
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
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b">
                <div>
                  <p className="font-medium">Merchant Plan</p>
                  <p className="text-sm text-muted-foreground">March 1, 2024</p>
                </div>
                <p className="font-medium">Ghc 150.00</p>
              </div>
              <div className="flex justify-between pb-4 border-b">
                <div>
                  <p className="font-medium">Merchant Plan</p>
                  <p className="text-sm text-muted-foreground">February 1, 2024</p>
                </div>
                <p className="font-medium">Ghc 150.00</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Merchant Plan</p>
                  <p className="text-sm text-muted-foreground">January 1, 2024</p>
                </div>
                <p className="font-medium">Ghc 150.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Billing Contact</p>
                <p className="font-medium">John Doe</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">john.doe@example.com</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">123 Main St, Accra, Ghana</p>
              </div>
              <Button variant="outline" className="mt-2">Update Information</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
