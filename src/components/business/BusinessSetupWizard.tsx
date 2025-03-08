import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Upload,
  CreditCard,
  Building,
  MapPin,
  User,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

// Validation schemas for each step
const businessProfileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
});

const businessContactSchema = z.object({
  manager: z.string().min(2, "Manager name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .transform((val) => val.replace(/\D/g, "")), // Clean for validation
});

const paymentAccountSchema = z.object({
  cardHolderName: z
    .string()
    .min(3, "Card holder name must be at least 3 characters"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card number must be 16 digits")
    .or(
      z
        .string()
        .regex(
          /^\d{4} \d{4} \d{4} \d{4}$/,
          "Format must be XXXX XXXX XXXX XXXX"
        )
    ),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Format must be MM/YY")
    .refine((value) => {
      const [month, year] = value.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const numYear = parseInt(year, 10);
      const numMonth = parseInt(month, 10);
      return (
        numYear > currentYear ||
        (numYear === currentYear && numMonth >= currentMonth)
      );
    }, "Card expiration date must be in the future"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

const businessAddressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  region: z.string().min(2, "Region must be at least 2 characters"),
});

type BusinessProfileForm = z.infer<typeof businessProfileSchema>;
type BusinessContactForm = z.infer<typeof businessContactSchema>;
type PaymentAccountForm = z.infer<typeof paymentAccountSchema>;
type BusinessAddressForm = z.infer<typeof businessAddressSchema>;

interface BusinessSetupWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const BusinessSetupWizard = ({
  onComplete,
  onCancel,
}: BusinessSetupWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<BusinessProfileForm>({
    name: "",
    bio: "",
  });
  const [contactData, setContactData] = useState<BusinessContactForm>({
    manager: "",
    email: "",
    phone: "",
  });
  const [paymentData, setPaymentData] = useState<PaymentAccountForm>({
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [addressData, setAddressData] = useState<BusinessAddressForm>({
    street: "",
    country: "",
    postalCode: "",
    region: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalSteps = 4;

  // Generate a valid business email
  const generateBusinessEmail = () => {
    const businessName = profileData.name || "business";
    const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `contact@${sanitizedName}.com`;
  };

  // Input Handlers
  const capitalizeFirstLetter = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    return match[1]
      ? `(${match[1]})${match[2] ? " " + match[2] : ""}${
          match[3] ? "-" + match[3] : ""
        }`
      : value; // Return original value if not enough digits
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = cleaned.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, "").slice(0, 4);
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const restrictToNumbers = (value: string) => value.replace(/\D/g, "");

  const capitalizeWords = (value: string) =>
    value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Set up form handlers for each step
  const profileForm = useForm<BusinessProfileForm>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: profileData,
  });

  const contactForm = useForm<BusinessContactForm>({
    resolver: zodResolver(businessContactSchema),
    defaultValues: contactData,
  });

  const paymentForm = useForm<PaymentAccountForm>({
    resolver: zodResolver(paymentAccountSchema),
    defaultValues: paymentData,
  });

  const addressForm = useForm<BusinessAddressForm>({
    resolver: zodResolver(businessAddressSchema),
    defaultValues: addressData,
  });

  const handleNextStep = (data: any) => {
    switch (step) {
      case 1:
        setProfileData(data);
        break;
      case 2:
        setContactData(data);
        break;
      case 3:
        setPaymentData(data);
        break;
      case 4:
        setAddressData(data);
        break;
      default:
        break;
    }

    if (step < totalSteps) {
      setStep(step + 1);
      switch (step + 1) {
        case 2:
          contactForm.reset({
            manager: "",
            email: generateBusinessEmail(), // Initial suggestion only
            phone: "",
          });
          break;
        case 3:
          paymentForm.reset({
            cardHolderName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
          });
          break;
        case 4:
          addressForm.reset({
            street: "",
            country: "",
            postalCode: "",
            region: "",
          });
          break;
        default:
          break;
      }
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      switch (step - 1) {
        case 1:
          profileForm.reset(profileData);
          break;
        case 2:
          contactForm.reset(contactData);
          break;
        case 3:
          paymentForm.reset(paymentData);
          break;
        default:
          break;
      }
    } else {
      onCancel();
    }
  };

  const handleCompleteSetup = () => {
    const completeData = {
      ...profileData,
      ...contactData,
      ...paymentData,
      ...addressData,
    };
    onComplete(completeData);
    setShowConfirmation(false);
    toast({
      title: "Business profile setup complete",
      description: "Your business profile has been created successfully.",
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleNextStep)}
                  className="space-y-6">
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
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>BUSINESS NAME</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter business name"
                              onChange={(e) =>
                                field.onChange(
                                  capitalizeFirstLetter(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>BIO</Label>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us about your business"
                              rows={4}
                              onChange={(e) =>
                                field.onChange(e.target.value.slice(0, 500))
                              }
                            />
                          </FormControl>
                          <div className="text-sm text-gray-500">
                            {field.value.length}/500 characters
                          </div>
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
                      onClick={handlePreviousStep}
                      className="text-cyan-500">
                      Go back
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">Business Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...contactForm}>
                <form
                  onSubmit={contactForm.handleSubmit(handleNextStep)}
                  className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={contactForm.control}
                      name="manager"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>MANAGER</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter manager name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>EMAIL</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter email address"
                              type="email"
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>PHONE NUMBER</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="(123) 456-7890"
                              value={field.value || ""}
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(
                                  e.target.value
                                );
                                field.onChange(formatted);
                              }}
                              maxLength={14}
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
                      onClick={handlePreviousStep}
                      className="text-cyan-500">
                      Go back
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">Payment Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form
                  onSubmit={paymentForm.handleSubmit(handleNextStep)}
                  className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={paymentForm.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>CARD HOLDER NAME</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter card holder name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>CARD NUMBER</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="XXXX XXXX XXXX XXXX"
                              onChange={(e) =>
                                field.onChange(formatCardNumber(e.target.value))
                              }
                              maxLength={19}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor={field.name}>EXPIRY DATE</Label>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="MM/YY"
                                onChange={(e) =>
                                  field.onChange(
                                    formatExpiryDate(e.target.value)
                                  )
                                }
                                maxLength={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor={field.name}>CVC</Label>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="***"
                                type="password"
                                onChange={(e) =>
                                  field.onChange(
                                    restrictToNumbers(e.target.value)
                                  )
                                }
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
                      onClick={handlePreviousStep}
                      className="text-cyan-500">
                      Go back
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl">Business Address</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...addressForm}>
                <form
                  onSubmit={addressForm.handleSubmit(handleNextStep)}
                  className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={addressForm.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>
                            STREET NAME & NUMBER
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter street name & number"
                              onChange={(e) =>
                                field.onChange(capitalizeWords(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addressForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor={field.name}>COUNTRY</Label>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter country"
                                onChange={(e) =>
                                  field.onChange(
                                    capitalizeFirstLetter(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={addressForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <Label htmlFor={field.name}>POSTAL CODE</Label>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter postal code"
                                onChange={(e) =>
                                  field.onChange(e.target.value.toUpperCase())
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={addressForm.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <Label htmlFor={field.name}>REGION</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter region"
                              onChange={(e) =>
                                field.onChange(
                                  capitalizeFirstLetter(e.target.value)
                                )
                              }
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
                      onClick={handlePreviousStep}
                      className="text-cyan-500">
                      Go back
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  const getStepIcon = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return <Building className="h-5 w-5" />;
      case 2:
        return <User className="h-5 w-5" />;
      case 3:
        return <CreditCard className="h-5 w-5" />;
      case 4:
        return <MapPin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 mr-2"
          onClick={handlePreviousStep}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">
          {step === 1 && "Business Profile"}
          {step === 2 && "Business Contact"}
          {step === 3 && "Payment Account"}
          {step === 4 && "Business Address"}
        </h2>
      </div>

      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full mb-2 ${
                i + 1 === step
                  ? "bg-cyan-500 text-white"
                  : i + 1 < step
                  ? "bg-cyan-100 text-cyan-500"
                  : "bg-gray-100 text-gray-400"
              }`}>
              {getStepIcon(i + 1)}
            </div>
            <div
              className={`h-1 w-full ${
                i === totalSteps - 1
                  ? "hidden"
                  : i + 1 < step
                  ? "bg-cyan-500"
                  : "bg-gray-200"
              }`}
            />
          </div>
        ))}
      </div>

      {renderStepContent()}

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleCompleteSetup}
        title="Complete Business Setup"
        description="Your business profile is now ready. Are you sure you want to complete the setup?"
        confirmText="Complete Setup"
        cancelText="Review Again"
      />
    </div>
  );
};

export default BusinessSetupWizard;
