
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionSuccessModalProps {
  setShowSuccess: (show: boolean) => void;
}

const SubscriptionSuccessModal = ({ setShowSuccess }: SubscriptionSuccessModalProps) => {
  return (
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
  );
};

export default SubscriptionSuccessModal;
