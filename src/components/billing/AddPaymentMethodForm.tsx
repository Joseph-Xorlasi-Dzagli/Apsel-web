
import React, { useState } from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddPaymentMethodFormProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
}

const AddPaymentMethodForm = ({ 
  paymentMethod, 
  handleSelectPaymentMethod,
  setHasPaymentMethod
}: AddPaymentMethodFormProps) => {
  const { toast } = useToast();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    if (paymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required card details",
        variant: "destructive"
      });
      return;
    }
    
    setHasPaymentMethod(true);
    toast({
      title: "Payment method saved",
      description: "Your payment method has been saved successfully"
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-2">
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
            <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-500">G</span>
            </div>
            <span>Google Pay</span>
          </div>
          {paymentMethod === 'gpay' && <CheckCircle className="h-5 w-5 text-brand" />}
        </div>
      </div>
      
      {paymentMethod === 'card' && (
        <div className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input 
              id="cardName"
              name="cardName"
              value={cardDetails.cardName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input 
                id="expiry"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleChange}
                placeholder="123"
                type="password"
                maxLength={4}
              />
            </div>
          </div>
        </div>
      )}
      
      <Button className="w-full mt-6" onClick={handleSave}>
        Save Payment Method
      </Button>
    </div>
  );
};

export default AddPaymentMethodForm;
