import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Briefcase, Users, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessProfileForm, businessProfileSchema } from "./validation";
import { industries, employeeCounts } from "./utils";

interface BusinessProfileStepProps {
  onNext: (data: BusinessProfileForm) => void;
  onPrevious: () => void;
  defaultValues?: Partial<BusinessProfileForm>;
}

export const BusinessProfileStep = ({
  onNext,
  onPrevious,
  defaultValues,
}: BusinessProfileStepProps) => {
  const form = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: defaultValues || {
      name: "",
      industry: "",
      employeeCount: "",
      bio: "",
    },
  });

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Label>UPLOAD PROFILE PHOTO</Label>
                <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center w-full cursor-pointer hover:bg-muted/50">
                  <Avatar className="h-20 w-20 bg-muted">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <Upload className="h-8 w-8 text-blue-500" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="mt-2 text-blue-500">Add</span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>BUSINESS NAME</Label>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="Enter business name" />
                        <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>INDUSTRY</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <div className="flex w-full items-center justify-between">
                            <SelectValue placeholder="Select industry" />
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem
                            key={industry.value}
                            value={industry.value}>
                            {industry.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>COMPANY SIZE</Label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <div className="flex w-full items-center justify-between">
                            <SelectValue placeholder="Select company size" />
                            <Users className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employeeCounts.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            {count.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label htmlFor={field.name}>BIO</Label>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about your business"
                        rows={4}
                      />
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
