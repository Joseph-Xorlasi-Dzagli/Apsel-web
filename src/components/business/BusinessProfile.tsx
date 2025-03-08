import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Save,
  X,
  Upload,
  Building,
  Store,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Label } from "@/components/ui/label";

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
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
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
});

const BusinessProfile = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<any>(null);

  // Initial business data
  const [businessData, setBusinessData] = useState({
    name: "G-Connect Mobile Accessories",
    bio: "This Food so tasty & delicious. Breakfast so fast Delivered in my place. Chef is very friendly. I'm really like chef for Home Food Order. Thanks.",
    manager: "Joseph Akurugu Avoka",
    email: "hello@halallab.co",
    phone: "408-841-0926",
    whatsapp: "+233206252066",
    paymentAccount: "2134 xxxx xxxx",
    address: {
      street: "3891 Ranchview Dr.",
      city: "Richardson",
      state: "California",
      postalCode: "62539",
      country: "United States",
    },
    industry: "Technology",
  });

  // Create forms for each section
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: businessData.name,
      bio: businessData.bio,
    },
  });

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      manager: businessData.manager,
      email: businessData.email,
      phone: businessData.phone,
      whatsapp: businessData.whatsapp,
    },
  });

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: businessData.address.street,
      city: businessData.address.city,
      state: businessData.address.state,
      country: businessData.address.country,
      postalCode: businessData.address.postalCode,
    },
  });

  const toggleStoreStatus = () => {
    setIsOpen(!isOpen);
    toast({
      title: `Store is now ${!isOpen ? "Open" : "Closed"}`,
      description: `You've changed your store status to ${
        !isOpen ? "Open" : "Closed"
      }`,
    });
  };

  const handleProfileEdit = () => {
    setActiveField("profile");
    profileForm.reset({
      name: businessData.name,
      bio: businessData.bio,
    });
  };

  const handleContactEdit = () => {
    setActiveField("contact");
    contactForm.reset({
      manager: businessData.manager,
      email: businessData.email,
      phone: businessData.phone,
      whatsapp: businessData.whatsapp,
    });
  };

  const handleAddressEdit = () => {
    setActiveField("address");
    addressForm.reset({
      street: businessData.address.street,
      city: businessData.address.city,
      state: businessData.address.state,
      country: businessData.address.country,
      postalCode: businessData.address.postalCode,
    });
  };

  const handlePaymentEdit = () => {
    // Redirect to payment methods page
    toast({
      title: "Edit Payment Methods",
      description: "Redirecting to payment methods management.",
    });
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

  const confirmSave = () => {
    if (!confirmData) return;

    const { section, data } = confirmData;

    if (section === "profile") {
      setBusinessData((prev) => ({
        ...prev,
        name: data.name,
        bio: data.bio,
      }));
    } else if (section === "contact") {
      setBusinessData((prev) => ({
        ...prev,
        manager: data.manager,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
      }));
    } else if (section === "address") {
      setBusinessData((prev) => ({
        ...prev,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
        },
      }));
    }

    setActiveField(null);
    setShowConfirmation(false);

    toast({
      title: "Profile Updated",
      description: `Your ${section} information has been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-none">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-28 w-28 rounded-lg bg-brand-light border border-brand/20">
            <AvatarImage
              src="/lovable-uploads/b49be610-428d-44e3-a192-c598d6fc460b.png"
              alt="G-Connect Logo"
            />
            <AvatarFallback className="text-brand text-2xl">GC</AvatarFallback>
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
                    <Button type="submit">Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{businessData.name}</h2>
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
                    onClick={toggleStoreStatus}>
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

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            ABOUT BUSINESS
          </h3>
          {activeField === "profile" ? null : (
            <div className="relative bg-muted/30 p-4 rounded-lg">
              <p className="text-sm">{businessData.bio}</p>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Contact Information</h3>
          {activeField !== "contact" && (
            <Button
              variant="outline"
              size="sm"
              className="text-brand"
              onClick={handleContactEdit}>
              <PencilLine size={16} className="mr-1" />
              Edit
            </Button>
          )}
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
                  <Button type="submit">Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
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
                    <p className="text-sm">{businessData.manager}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">EMAIL</p>
                    <p className="text-sm">{businessData.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      PHONE NUMBER
                    </p>
                    <p className="text-sm">{businessData.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    <p className="text-sm">{businessData.whatsapp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <h3 className="text-lg font-medium">Payment & Location</h3>
          {activeField !== "address" && (
            <Button
              variant="outline"
              size="sm"
              className="text-brand"
              onClick={handleAddressEdit}>
              <PencilLine size={16} className="mr-1" />
              Edit
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-blue-500">
                <CreditCard size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">PAYMENT ACCOUNT</p>
                <p className="text-sm">{businessData.paymentAccount}</p>
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
                    name="postalCode"
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
                  <Button type="submit">Save Changes</Button>
                  <Button variant="outline" onClick={handleCancel}>
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
                  <p className="text-sm">
                    {businessData.address.street}, {businessData.address.city},{" "}
                    {businessData.address.state}{" "}
                    {businessData.address.postalCode},{" "}
                    {businessData.address.country}
                  </p>
                </div>
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
