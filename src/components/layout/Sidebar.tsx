
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  HelpCircle, 
  CreditCard,
  CircleUser,
  PackageSearch,
  Store,
  Menu,
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, path, active, onClick }: SidebarItemProps) => {
  return (
    <Link 
      to={path} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active 
          ? "text-brand bg-brand-light" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setOpen(false);
    }
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-brand-light">
            <AvatarImage src="/public/lovable-uploads/afb7fc95-0412-459d-8b48-a4d8fe164514.png" />
            <AvatarFallback className="text-brand">GC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-medium text-sm">G-Connect Mobile</h2>
            <p className="text-xs text-muted-foreground">Accessories</p>
          </div>
        </div>
      </div>
      
      <div className="px-2 flex-1 py-2 space-y-1">
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          path="/" 
          active={location.pathname === "/"} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<ShoppingBag size={20} />} 
          label="Orders" 
          path="/orders" 
          active={location.pathname.startsWith("/orders")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<PackageSearch size={20} />} 
          label="Inventory" 
          path="/inventory" 
          active={location.pathname.startsWith("/inventory")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<BarChart3 size={20} />} 
          label="Analytics" 
          path="/analytics" 
          active={location.pathname.startsWith("/analytics")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<LineChart size={20} />} 
          label="Sales Chart" 
          path="/sales-chart" 
          active={location.pathname.startsWith("/sales-chart")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<Store size={20} />} 
          label="Business Hub" 
          path="/business-hub" 
          active={location.pathname.startsWith("/business-hub")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<CreditCard size={20} />} 
          label="Billing" 
          path="/billing" 
          active={location.pathname.startsWith("/billing")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<Bell size={20} />} 
          label="Notifications" 
          path="/notifications" 
          active={location.pathname.startsWith("/notifications")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<HelpCircle size={20} />} 
          label="Help & FAQs" 
          path="/faqs" 
          active={location.pathname.startsWith("/faqs")} 
          onClick={closeMobileMenu}
        />
        <SidebarItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          path="/settings" 
          active={location.pathname.startsWith("/settings")} 
          onClick={closeMobileMenu}
        />
      </div>
      
      <div className="p-4 mt-auto border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive" 
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-3" />
          Log Out
        </Button>
      </div>
    </div>
  );
  
  if (isMobile) {
    return (
      <>
        <div className="fixed top-4 left-4 z-40">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }
  
  return (
    <div className="w-64 border-r h-screen sticky top-0 flex-shrink-0">
      {sidebarContent}
    </div>
  );
}
