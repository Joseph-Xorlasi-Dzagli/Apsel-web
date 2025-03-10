import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Phone, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface LoginProps {
  onSubmit: (data: any) => void;
  onForgotPassword: () => void;
  onSignup: () => void;
  authMethod: "email" | "phone";
  onToggleAuthMethod: () => void;
}

export const Login = ({
  onSubmit,
  onForgotPassword,
  onSignup,
  authMethod,
  onToggleAuthMethod,
}: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const schema = authMethod === "email" ? emailSchema : phoneSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="space-y-6 animate-in-slide">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
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
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm font-medium text-cyan-500">
                    Forgot Password?
                  </button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600">
            Log In
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <button
            onClick={onSignup}
            className="font-medium text-cyan-500 hover:underline">
            Sign Up
          </button>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => console.log("Google sign in")}>
        {/* <Google className="h-5 w-5 mr-2" /> */}
        Continue with Google
      </Button>
    </div>
  );
};
