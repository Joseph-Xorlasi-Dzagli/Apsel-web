import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, X } from "lucide-react";
import { CustomerType } from "@/lib/data";
import { formatPhoneNumber } from "@/components/business/setup/utils";
import { customerFormSchema, type CustomerFormValues } from "./validation";

interface CustomerFormProps {
  customer: CustomerType | null;
  onSubmit: (data: CustomerFormValues) => void;
  onCancel?: () => void;
  onDelete?: (customer: CustomerType) => void;
  isSubmitting: boolean;
}

export function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting,
}: CustomerFormProps) {
  // Form setup
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          location: customer.location,
          status: customer.status,
          notes: customer.notes || "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          company: "",
          location: "",
          status: "active",
          notes: "",
        },
  });

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(event.target.value);
    form.setValue("phone", formattedPhone);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company *</FormLabel>
                <FormControl>
                  <Input placeholder="Company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone number"
                    {...field}
                    onChange={(e) => {
                      handlePhoneChange(e);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about this customer"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          {customer && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          {customer && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(customer)}
              disabled={isSubmitting}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
