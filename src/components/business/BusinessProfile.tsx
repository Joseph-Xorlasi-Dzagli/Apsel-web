import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  MapPin,
  PencilLine,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Label } from "@/components/ui/label";
import { useBusiness } from "@/hooks/useBusiness";
import { Skeleton } from "@/components/ui/skeleton";

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  bio: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "Bio must be at least 10 characters if provided",
    })
    .refine((val) => !val || val.length <= 500, {
      message: "Bio must be less than 500 characters",
    }),
});

const contactSchema = z.object({
  manager: z.string().min(2, "Manager name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  whatsapp: z
    .string()
    .min(10, "WhatsApp number must be at least 10 characters"),
});

const addressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  postal_code: z.string().min(3, "Postal code must be at least 3 characters"),
});

// Added payment schema
const paymentSchema = z.object({
  account_number: z
    .string()
    .min(8, "Account number must be at least 8 characters"),
  account_holder: z
    .string()
    .min(2, "Account holder name must be at least 2 characters"),
  bank_name: z.string().min(2, "Bank name must be at least 2 characters"),
});

// Skeleton loader for business profile
const BusinessProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="border-none">
        <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
          <Skeleton className="h-28 w-28 rounded-lg" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
        <div className="mt-6 p-6">
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </Card>

      <div className="space-y-3">
        <Skeleton className="h-6 w-1/4 mb-2" />
        <Card>
          <div className="p-4 space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>

        <Skeleton className="h-6 w-1/4 mt-6 mb-2" />
        <Card>
          <div className="p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>

        <Skeleton className="h-6 w-1/4 mt-6 mb-2" />
        <Card>
          <div className="p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>

        <Skeleton className="h-6 w-1/4 mt-6 mb-2" />
        <Card>
          <div className="p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
};

const BusinessProfile = () => {
  const { toast } = useToast();
  const {
    business,
    businessContact,
    businessAddress,
    loading,
    savingData,
    setSavingData,
    updateBusiness,
    updateContact,
    updateAddress,
    toggleBusinessStatus,
  } = useBusiness();

  const [isOpen, setIsOpen] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<any>(null);

  // Initialize forms once data is loaded
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      manager: "",
      email: "",
      phone: "",
      whatsapp: "",
    },
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      account_number: "",
      account_holder: "",
      bank_name: "",
    },
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (business) {
      setIsOpen(business.is_open);
      profileForm.reset({
        name: business.name || "",
        bio: business.bio || "",
      });
    }
  }, [business, profileForm]);

  useEffect(() => {
    if (businessContact) {
      contactForm.reset({
        manager: businessContact.manager || "",
        email: businessContact.email || "",
        phone: businessContact.phone || "",
        whatsapp: businessContact.whatsapp || "",
      });
    }
  }, [businessContact, contactForm]);

  useEffect(() => {
    if (businessAddress) {
      addressForm.reset({
        street: businessAddress.street || "",
        city: businessAddress.city || "",
        state: businessAddress.state || "",
        country: businessAddress.country || "",
        postal_code: businessAddress.postal_code || "",
      });
    }
  }, [businessAddress, addressForm]);

  // For payment account, we'd typically have another hook to fetch this data
  // For now, we'll use dummy data in the UI
  useEffect(() => {
    paymentForm.reset({
      account_number: "2134 xxxx xxxx",
      account_holder: business?.name || "",
      bank_name: "GCB Bank",
    });
  }, [business, paymentForm]);

  const handleStoreToggle = async () => {
    try {
      await toggleBusinessStatus();
      setIsOpen(!isOpen);
    } catch (error) {
      console.error("Error toggling store status:", error);
    }
  };

  const handleProfileEdit = () => {
    setActiveField("profile");
    profileForm.reset({
      name: business?.name || "",
      bio: business?.bio || "",
    });
  };

  const handleContactEdit = () => {
    setActiveField("contact");
    contactForm.reset({
      manager: businessContact?.manager || "",
      email: businessContact?.email || "",
      phone: businessContact?.phone || "",
      whatsapp: businessContact?.whatsapp || "",
    });
  };

  const handleAddressEdit = () => {
    setActiveField("address");
    addressForm.reset({
      street: businessAddress?.street || "",
      city: businessAddress?.city || "",
      state: businessAddress?.state || "",
      country: businessAddress?.country || "",
      postal_code: businessAddress?.postal_code || "",
    });
  };

  const handlePaymentEdit = () => {
    setActiveField("payment");
    paymentForm.reset({
      account_number: "2134 xxxx xxxx", // This would come from a payment hook
      account_holder: business?.name || "",
      bank_name: "GCB Bank",
    });
  };

  const handleSavePayment = (data: any) => {
    setConfirmData({ section: "payment", data });
    setShowConfirmation(true);
  };

  const handleSaveProfile = (data: any) => {
    setConfirmData({ section: "profile", data });
    setShowConfirmation(true);
  };

  const handleSaveContact = (data: any) => {
    setConfirmData({ section: "contact", data });
    setShowConfirmation(true);
  };

  const handleSaveAddress = (data: any) => {
    setConfirmData({ section: "address", data });
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setActiveField(null);
  };

  const confirmSave = async () => {
    if (!confirmData) return;

    const { section, data } = confirmData;
    setSavingData(true);

    try {
      if (section === "profile") {
        await updateBusiness(data);
      } else if (section === "contact") {
        await updateContact(data);
      } else if (section === "address") {
        await updateAddress(data);
      } else if (section === "payment") {
        // This would typically go through a payment account update service
        toast({
          title: "Feature Coming Soon",
          description:
            "Payment account updates will be available in a future update.",
        });
      }

      setActiveField(null);
      setShowConfirmation(false);
    } catch (error) {
      console.error(`Error updating ${section}:`, error);
      toast({
        title: "Update Failed",
        description: `There was a problem updating your ${section} information.`,
        variant: "destructive",
      });
    } finally {
      setSavingData(false);
    }
  };

  if (loading) {
    return <BusinessProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-none">
        <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
          <Avatar className="h-28 w-28 rounded-lg bg-brand-light border border-brand/20">
            <AvatarImage src={business?.logo_url || ""} alt="Business Logo" />
            <AvatarFallback className="text-brand text-2xl">
              {business?.name?.substring(0, 2) || "BZ"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {activeField === "profile" ? (
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleSaveProfile)}
                  className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>BUSINESS NAME</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter business name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <Label>BIO</Label>
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
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!profileForm.formState.isDirty || savingData}>
                      {savingData ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={savingData}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {business?.name || "My Business"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand"
                    onClick={handleProfileEdit}>
                    <PencilLine size={16} className="mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={isOpen ? "default" : "destructive"}
                    className={`cursor-pointer text-sm px-4 py-1 ${
                      isOpen ? "bg-brand" : ""
                    }`}
                    onClick={handleStoreToggle}>
                    {isOpen ? "Open" : "Closed"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {isOpen
                      ? "Your store is open for business"
                      : "Your store is currently closed"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            ABOUT BUSINESS
          </h3>
          {activeField === "profile" ? null : (
            <div className="relative bg-muted/30 p-4 rounded-lg">
              <p className="text-sm">
                {business?.bio || "No business description added yet."}
              </p>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Contact Information</h3>
        </div>

        {activeField === "contact" ? (
          <Card className="p-4">
            <Form {...contactForm}>
              <form
                onSubmit={contactForm.handleSubmit(handleSaveContact)}
                className="space-y-4">
                <FormField
                  control={contactForm.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <Label>MANAGER</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter manager name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>EMAIL</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter email address"
                          type="email"
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
                    <FormItem>
                      <Label>PHONE NUMBER</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <Label>WHATSAPP ACCOUNT</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter WhatsApp number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!contactForm.formState.isDirty || savingData}>
                    {savingData ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={savingData}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        ) : (
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-brand">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">MANAGER</p>
                    <p className="text-sm">
                      {businessContact?.manager || "Not set"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand"
                    onClick={handleContactEdit}>
                    <PencilLine size={16} />
                  </Button>
                </div>
              </CardContent>

              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">EMAIL</p>
                    <p className="text-sm">
                      {businessContact?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      PHONE NUMBER
                    </p>
                    <p className="text-sm">
                      {businessContact?.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <h3 className="text-lg font-medium">Channels</h3>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-green-500">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  WHATSAPP ACCOUNT
                </p>
                <p className="text-sm">
                  {businessContact?.whatsapp || "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <h3 className="text-lg font-medium">Payment Account</h3>
        </div>

        {activeField === "payment" ? (
          <Card className="p-4">
            <Form {...paymentForm}>
              <form
                onSubmit={paymentForm.handleSubmit(handleSavePayment)}
                className="space-y-4">
                <FormField
                  control={paymentForm.control}
                  name="account_number"
                  render={({ field }) => (
                    <FormItem>
                      <Label>ACCOUNT NUMBER</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter account number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="account_holder"
                  render={({ field }) => (
                    <FormItem>
                      <Label>ACCOUNT HOLDER</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter account holder name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>BANK NAME</Label>
                      <FormControl>
                        <Input {...field} placeholder="Enter bank name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!paymentForm.formState.isDirty || savingData}>
                    {savingData ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={savingData}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-500">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    PAYMENT ACCOUNT
                  </p>
                  <p className="text-sm">2134 xxxx xxxx</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {business?.name || "Account Holder"} • GCB Bank
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand"
                  onClick={handlePaymentEdit}>
                  <PencilLine size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mt-3">
          <h3 className="text-lg font-medium">Address</h3>
        </div>

        {activeField === "address" ? (
          <Card className="p-4">
            <Form {...addressForm}>
              <form
                onSubmit={addressForm.handleSubmit(handleSaveAddress)}
                className="space-y-4">
                <FormField
                  control={addressForm.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <Label>STREET NAME & NUMBER</Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter street name & number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <Label>CITY</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <Label>STATE</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <Label>COUNTRY</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter country" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <Label>POSTAL CODE</Label>
                        <FormControl>
                          <Input {...field} placeholder="Enter postal code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={!addressForm.formState.isDirty || savingData}>
                    {savingData ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={savingData}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-purple-500">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">ADDRESS</p>
                  {businessAddress ? (
                    <p className="text-sm">
                      {businessAddress.street}, {businessAddress.city},{" "}
                      {businessAddress.state} {businessAddress.postal_code},{" "}
                      {businessAddress.country}
                    </p>
                  ) : (
                    <p className="text-sm">No address set</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand"
                  onClick={handleAddressEdit}>
                  <PencilLine size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmSave}
        title="Save Changes"
        description="Are you sure you want to save these changes to your business profile?"
        confirmText="Save"
        cancelText="Cancel"
      />
    </div>
  );
};

export default BusinessProfile;
