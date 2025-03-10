import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PaymentAccountForm, paymentAccountSchema } from "./validation";
import { formatCardNumber } from "./utils";

interface PaymentAccountStepProps {
  onNext: (data: PaymentAccountForm) => void;
  onPrevious: () => void;
  defaultValues?: Partial<PaymentAccountForm>;
}

export const PaymentAccountStep = ({
  onNext,
  onPrevious,
  defaultValues,
}: PaymentAccountStepProps) => {
  const form = useForm<PaymentAccountForm>({
    resolver: zodResolver(paymentAccountSchema),
    defaultValues: defaultValues || {
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Payment Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-700 flex items-start">
                <div className="mr-2 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  Your payment information is secure and encrypted. We use this
                  for processing transactions within the platform.
                </div>
              </div>

              <FormField
                control={form.control}
                name="cardHolderName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>CARD HOLDER NAME</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter card holder name"
                        />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
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
                    <Label htmlFor={field.name}>CARD NUMBER</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter card number"
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={19}
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
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
                      <Label htmlFor={field.name}>EXPIRY DATE</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="MM/YY"
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d]/g, "");
                            if (value.length > 2) {
                              value =
                                value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            field.onChange(value);
                          }}
                          maxLength={5}
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
                      <Label htmlFor={field.name}>CVC</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="***"
                          type="password"
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600">
                Continue
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={onPrevious}
                className="text-cyan-500">
                Go back
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
