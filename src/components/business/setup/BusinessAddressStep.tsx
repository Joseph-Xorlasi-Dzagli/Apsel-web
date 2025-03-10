import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
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
import { BusinessAddressForm, businessAddressSchema } from "./validation";

interface BusinessAddressStepProps {
  onNext: (data: BusinessAddressForm) => void;
  onPrevious: () => void;
  defaultValues?: Partial<BusinessAddressForm>;
}

export const BusinessAddressStep = ({
  onNext,
  onPrevious,
  defaultValues,
}: BusinessAddressStepProps) => {
  const form = useForm<BusinessAddressForm>({
    resolver: zodResolver(businessAddressSchema),
    defaultValues: defaultValues || {
      street: "",
      country: "",
      postalCode: "",
      region: "",
    },
  });

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Business Address</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>STREET NAME & NUMBER</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter street name & number"
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor={field.name}>COUNTRY</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor={field.name}>POSTAL CODE</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter postal code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>REGION</Label>
                    <FormControl>
                      <Input {...field} placeholder="Enter region" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
