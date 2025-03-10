import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
});

interface ForgotPasswordProps {
  onSubmit: (data: any) => void;
  onGoBack: () => void;
  authMethod: "email" | "phone";
  onToggleAuthMethod: () => void;
}

export const ForgotPassword = ({
  onSubmit,
  onGoBack,
  authMethod,
  onToggleAuthMethod,
}: ForgotPasswordProps) => {
  const schema = authMethod === "email" ? emailSchema : phoneSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  return (
    <div className="space-y-6 animate-in-slide">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGoBack}
          className="h-8 w-8 p-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Forgot Password</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {authMethod === "email" ? (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Email</label>
                    <button
                      type="button"
                      onClick={onToggleAuthMethod}
                      className="text-sm font-medium text-cyan-500">
                      Use phone number
                    </button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="example@email.com"
                        className="pr-10"
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your email to receive a OTP
                  </p>
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Phone Number</label>
                    <button
                      type="button"
                      onClick={onToggleAuthMethod}
                      className="text-sm font-medium text-cyan-500">
                      Use email
                    </button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Enter your phone number"
                        className="pr-10"
                      />
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your phone number to receive a OTP
                  </p>
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600">
              Confirm
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={onGoBack}
              className="text-cyan-500">
              Go back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
