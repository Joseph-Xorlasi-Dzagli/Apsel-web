
import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentMethodsListProps {
  paymentMethod: string;
  handleSelectPaymentMethod: (method: string) => void;
  setHasPaymentMethod: (hasMethod: boolean) => void;
  handleAddNew: (method: string) => void;
}

const PaymentMethodsList = ({
  paymentMethod,
  handleSelectPaymentMethod,
  setHasPaymentMethod,
  handleAddNew,
}: PaymentMethodsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Methods</h2>
          <Button
            size="sm"
            className="rounded-full bg-brand hover:bg-brand-dark"
            onClick={() => handleAddNew("new")}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "gpay" ? "border-brand bg-brand-light/30" : ""
            } w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]`}
            onClick={() => handleSelectPaymentMethod("gpay")}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-bold text-blue-500">G</span>
              </div>
              <div>
                <p className="font-medium">Google Pay</p>
                <p className="text-sm text-muted-foreground">Default</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === "gpay" ? "bg-brand border-0" : ""
              }`}>
              {paymentMethod === "gpay" && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
          </div>

          <div
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "visa" ? "border-brand bg-brand-light/30" : ""
            } w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]`}
            onClick={() => handleSelectPaymentMethod("visa")}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="font-bold text-white">V</span>
              </div>
              <div>
                <p className="font-medium">Visa •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 04/25</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === "visa" ? "bg-brand border-0" : ""
              }`}>
              {paymentMethod === "visa" && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
          </div>

          <div
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
              paymentMethod === "mastercard"
                ? "border-brand bg-brand-light/30"
                : ""
            } w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]`}
            onClick={() => handleSelectPaymentMethod("mastercard")}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                <span className="font-bold text-white">M</span>
              </div>
              <div>
                <p className="font-medium">MasterCard •••• 8412</p>
                <p className="text-sm text-muted-foreground">Expires 12/24</p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                paymentMethod === "mastercard" ? "bg-brand border-0" : ""
              }`}>
              {paymentMethod === "mastercard" && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsList;
