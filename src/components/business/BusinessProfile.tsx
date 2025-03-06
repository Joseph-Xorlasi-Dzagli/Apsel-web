
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  MapPin, 
  PencilLine 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessProfile = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: "G-Connect Mobile Accessories",
    bio: "This Food so tasty & delicious. Breakfast so fast Delivered in my place. Chef is very friendly. I'm really like chef for Home Food Order. Thanks.",
    manager: "Joseph Akurugu Avoka",
    email: "hello@halallab.co",
    phone: "408-841-0926",
    whatsapp: "+233206252066",
    paymentAccount: "2134  xxxx  xxxx",
    address: "3891 Ranchview Dr. Richardson, California 62539",
  });

  const toggleStoreStatus = () => {
    setIsOpen(!isOpen);
    toast({
      title: `Store is now ${!isOpen ? "Open" : "Closed"}`,
      description: `You've changed your store status to ${!isOpen ? "Open" : "Closed"}`,
    });
  };

  const handleEdit = (field: string) => {
    setIsEditing(true);
    toast({
      title: "Edit mode activated",
      description: `You can now edit the ${field} information`,
    });
  };

  const saveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your business profile has been updated",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-40 w-40 rounded-lg bg-brand-light">
          <AvatarImage
            src="/public/lovable-uploads/b49be610-428d-44e3-a192-c598d6fc460b.png"
            alt="G-Connect Logo"
          />
          <AvatarFallback className="text-brand text-2xl">GC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{businessData.name}</h2>
          <div className="flex items-center justify-between mt-2">
            <Badge
              variant={isOpen ? "default" : "destructive"}
              className={`cursor-pointer text-sm px-4 py-1 ${isOpen ? "bg-brand" : ""}`}
              onClick={toggleStoreStatus}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
            <Button
              variant="ghost"
              className="text-brand hover:text-brand/90"
              onClick={() => setIsEditing(!isEditing)}>
              EDIT
            </Button>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1 mt-2">
              BIO
            </h3>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={businessData.bio}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, bio: e.target.value })
                  }
                  className="w-full resize-none"
                />
                <Button size="sm" onClick={saveChanges}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="relative">
                <p className="text-sm">
                  {businessData.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="text-brand" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">MANAGER</p>
                  <p className="text-sm">{businessData.manager}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit("manager")}>
                <PencilLine size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-500" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">EMAIL</p>
                  <p className="text-sm">{businessData.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit("email")}>
                <PencilLine size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="text-blue-500" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">PHONE NUMBER</p>
                  <p className="text-sm">{businessData.phone}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit("phone")}>
                <PencilLine size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-green-500" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">
                    WHATSAPP ACCOUNT
                  </p>
                  <p className="text-sm">{businessData.whatsapp}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit("whatsapp")}>
                <PencilLine size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-500" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">
                    PAYMENT ACCOUNT
                  </p>
                  <p className="text-sm">{businessData.paymentAccount}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit("paymentAccount")}>
                <PencilLine size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="text-purple-500" size={20} />
                <div>
                  <p className="text-xs text-muted-foreground">ADDRESS</p>
                  <p className="text-sm">{businessData.address}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit("address")}>
                <PencilLine size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessProfile;
