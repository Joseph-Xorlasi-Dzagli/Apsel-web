
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  MapPin, 
  PencilLine,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessProfile = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState({
    name: "G-Connect Mobile Accessories",
    bio: "This Food so tasty & delicious. Breakfast so fast Delivered in my place. Chef is very friendly. I'm really like chef for Home Food Order. Thanks.",
    manager: "Joseph Akurugu Avoka",
    email: "hello@halallab.co",
    phone: "408-841-0926",
    whatsapp: "+233206252066",
    paymentAccount: "2134 xxxx xxxx",
    address: "3891 Ranchview Dr. Richardson, California 62539",
  });

  // Temporary state for editing
  const [tempValue, setTempValue] = useState("");

  const toggleStoreStatus = () => {
    setIsOpen(!isOpen);
    toast({
      title: `Store is now ${!isOpen ? "Open" : "Closed"}`,
      description: `You've changed your store status to ${!isOpen ? "Open" : "Closed"}`,
    });
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(businessData[field as keyof typeof businessData]);
  };

  const saveChange = () => {
    if (editingField) {
      setBusinessData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
      
      toast({
        title: "Updated successfully",
        description: `Your ${editingField} information has been updated`,
      });
      
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const renderEditableField = (field: string, icon: React.ReactNode, label: string, value: string, iconColor: string = "text-brand") => {
    const isEditing = editingField === field;
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={iconColor}>{icon}</div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                {isEditing ? (
                  field === 'bio' ? (
                    <Textarea 
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="mt-1"
                    />
                  )
                ) : (
                  <p className="text-sm">{value}</p>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  className="text-red-500">
                  <X size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveChange}
                  className="text-green-500">
                  <Save size={18} />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-brand"
                onClick={() => handleEdit(field)}>
                <PencilLine size={18} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-28 w-28 rounded-lg bg-brand-light border border-brand/20">
            <AvatarImage
              src="/lovable-uploads/b49be610-428d-44e3-a192-c598d6fc460b.png"
              alt="G-Connect Logo"
            />
            <AvatarFallback className="text-brand text-2xl">GC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {editingField === 'name' ? (
              <div className="space-y-2">
                <Input
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="text-xl font-semibold"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={cancelEdit} variant="outline" className="text-red-500">Cancel</Button>
                  <Button size="sm" onClick={saveChange} className="bg-brand">Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{businessData.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand"
                  onClick={() => handleEdit('name')}>
                  <PencilLine size={16} className="mr-1" />
                  Edit
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={isOpen ? "default" : "destructive"}
                className={`cursor-pointer text-sm px-4 py-1 ${isOpen ? "bg-brand" : ""}`}
                onClick={toggleStoreStatus}>
                {isOpen ? "Open" : "Closed"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isOpen ? "Your store is open for business" : "Your store is currently closed"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">ABOUT BUSINESS</h3>
          {editingField === 'bio' ? (
            <div className="space-y-2">
              <Textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full resize-none"
                rows={4}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={cancelEdit} variant="outline" className="text-red-500">Cancel</Button>
                <Button size="sm" onClick={saveChange} className="bg-brand">Save</Button>
              </div>
            </div>
          ) : (
            <div className="relative bg-muted/30 p-4 rounded-lg">
              <p className="text-sm">{businessData.bio}</p>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-brand"
                onClick={() => handleEdit('bio')}>
                <PencilLine size={16} />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Contact Information</h3>
        
        {renderEditableField('manager', <User size={20} />, 'MANAGER', businessData.manager)}
        {renderEditableField('email', <Mail size={20} />, 'EMAIL', businessData.email, 'text-blue-500')}
        {renderEditableField('phone', <Phone size={20} />, 'PHONE NUMBER', businessData.phone, 'text-blue-500')}
        {renderEditableField('whatsapp', <MessageSquare size={20} />, 'WHATSAPP ACCOUNT', businessData.whatsapp, 'text-green-500')}
        
        <h3 className="text-lg font-medium mt-6">Payment & Location</h3>
        
        {renderEditableField('paymentAccount', <CreditCard size={20} />, 'PAYMENT ACCOUNT', businessData.paymentAccount, 'text-blue-500')}
        {renderEditableField('address', <MapPin size={20} />, 'ADDRESS', businessData.address, 'text-purple-500')}
      </div>
    </div>
  );
};

export default BusinessProfile;
