
import { useState } from "react";
import { ArrowLeft, Plus, CreditCard, CheckCircle, Check, Receipt, Clock, Calendar, CreditCard as CardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment methods</p>
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
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand" />
                <p className="text-brand font-medium">Renews in 3 days</p>
              </div>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Payment Methods</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="rounded-full bg-brand hover:bg-brand-dark">
                  <Plus className="h-4 w-4" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'gpay' ? 'border-brand bg-brand-light/30' : ''}`}
                onClick={() => handleSelectPaymentMethod('gpay')}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-500">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google Pay</p>
                    <p className="text-sm text-muted-foreground">Default</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'gpay' ? 'bg-brand border-0' : ''}`}>
                  {paymentMethod === 'gpay' && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'visa' ? 'border-brand bg-brand-light/30' : ''}`}
                onClick={() => handleSelectPaymentMethod('visa')}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                    <span className="font-bold text-white">V</span>
                  </div>
                  <div>
                    <p className="font-medium">Visa •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 04/25</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'visa' ? 'bg-brand border-0' : ''}`}>
                  {paymentMethod === 'visa' && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
              <div 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${paymentMethod === 'mastercard' ? 'border-brand bg-brand-light/30' : ''}`}
                onClick={() => handleSelectPaymentMethod('mastercard')}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="font-bold text-white">M</span>
                  </div>
                  <div>
                    <p className="font-medium">MasterCard •••• 8412</p>
                    <p className="text-sm text-muted-foreground">Expires 12/24</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'mastercard' ? 'bg-brand border-0' : ''}`}>
                  {paymentMethod === 'mastercard' && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
            </div>
          ) : (
            <Card>
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
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-brand-light/30 rounded-md">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand" />
                <span className="font-medium">Next billing date</span>
              </div>
              <span className="font-medium">June 30, 2024</span>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <span>Current plan</span>
                <span className="font-medium">Merchant</span>
              </div>
              <div className="flex justify-between">
                <span>Billing period</span>
                <span className="font-medium">Monthly</span>
              </div>
              <div className="flex justify-between border-t pt-3 mt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold">Ghc 150.00/month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your recent billing transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Receipt className="h-4 w-4" />
              <span>Download All</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Merchant Plan</p>
                  <p className="text-sm text-muted-foreground">March 1, 2024</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Ghc 150.00</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Receipt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Merchant Plan</p>
                  <p className="text-sm text-muted-foreground">February 1, 2024</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Ghc 150.00</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Receipt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Merchant Plan</p>
                  <p className="text-sm text-muted-foreground">January 1, 2024</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Ghc 150.00</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Receipt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Your billing contact and address details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Billing Contact</p>
                  <p className="font-medium">John Doe</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">G-Connect Mobile</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">john.doe@example.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">123 Main St, Accra, Ghana</p>
              </div>
              <Button variant="outline" className="mt-2 w-full sm:w-auto">
                <CardIcon className="mr-2 h-4 w-4" />
                Update Information
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
