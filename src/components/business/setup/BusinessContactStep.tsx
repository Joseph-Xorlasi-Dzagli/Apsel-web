import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone } from "lucide-react";
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
import { BusinessContactForm, businessContactSchema } from "./validation";
import { useEffect } from "react";
import { generateBusinessEmail } from "./utils";

interface BusinessContactStepProps {
  onNext: (data: BusinessContactForm) => void;
  onPrevious: () => void;
  defaultValues?: Partial<BusinessContactForm>;
}

export const BusinessContactStep = ({
  onNext,
  onPrevious,
  defaultValues,
}: BusinessContactStepProps) => {
  const form = useForm<BusinessContactForm>({
    resolver: zodResolver(businessContactSchema),
    defaultValues: defaultValues || {
      manager: "",
      email: "",
      phone: "",
    },
  });

  // If business name is available in defaultValues, generate a suggested email
  // useEffect(() => {
  //   if (!defaultValues?.email && defaultValues?.name) {
  //     const suggestedEmail = generateBusinessEmail(defaultValues.name);
  //     form.setValue("email", suggestedEmail);
  //   }
  // }, [defaultValues, form]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Business Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>MANAGER</Label>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="Enter manager name" />
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>EMAIL</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter email address"
                          type="email"
                        />
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>PHONE NUMBER</Label>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="Enter phone number" />
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
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
