import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  UserPlus,
  Settings as SettingsIcon,
  Save,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState({
    name: "G-Connect Mobile",
    email: "admin@gconnect.com",
    phone: "+1 (555) 123-4567",
    industry: "Technology", // Add initial value for industry
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const saveNotifications = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const savePassword = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been successfully changed.",
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6 text-brand" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className="hidden md:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/public/lovable-uploads/afb7fc95-0412-459d-8b48-a4d8fe164514.png" />
                  <AvatarFallback className="text-brand bg-brand-light text-2xl">
                    GC
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Photo</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Upload New
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={profileForm.industry}
                      onChange={handleProfileChange}
                    />
                  </div>
                                    <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full md:w-auto" onClick={saveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Order Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new orders and status changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Inventory Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when products are low in stock
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Sales Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly sales performance reports
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Marketing Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Get promotions and marketing tips
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button onClick={saveNotifications}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button onClick={savePassword}>Update Password</Button>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Enable 2FA</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription plans and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-md bg-brand-light border-brand/20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <p className="text-xl font-bold text-brand">Merchant</p>
                    <p className="text-sm text-muted-foreground">
                      You're saving 20%
                    </p>
                  </div>
                  <span className="text-brand font-medium">
                    Renews in 3 days
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-brand hover:bg-brand-dark"
                    onClick={() => navigate("/billing")}>
                    Manage Subscription
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 04/2025
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/billing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Payment Methods
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Billing History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">April 2023</p>
                      <p className="text-sm text-muted-foreground">
                        Merchant Plan
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Ghc 150.00</span>
                      <Button variant="ghost" size="sm">
                        Receipt
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">March 2023</p>
                      <p className="text-sm text-muted-foreground">
                        Merchant Plan
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Ghc 150.00</span>
                      <Button variant="ghost" size="sm">
                        Receipt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
