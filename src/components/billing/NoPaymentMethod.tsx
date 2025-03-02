
import React from "react";
import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AddPaymentMethodForm from "./AddPaymentMethodForm";

interface NoPaymentMethodProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
}

const NoPaymentMethod = ({ 
  paymentMethod, 
  handleSelectPaymentMethod,
  setHasPaymentMethod 
}: NoPaymentMethodProps) => {
  return (
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
            <AddPaymentMethodForm 
              paymentMethod={paymentMethod} 
              handleSelectPaymentMethod={handleSelectPaymentMethod}
              setHasPaymentMethod={setHasPaymentMethod}
            />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default NoPaymentMethod;
