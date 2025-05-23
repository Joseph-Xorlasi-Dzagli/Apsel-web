
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
  LineChart,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ApselLogo from "@/components/img/apsel.png";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

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
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Redirect to login page or home page after logout
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);

      toast({
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setOpen(false);
    }
  };
  
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-7 pt-10 pb-4 flex justify-left">
        <img src={ApselLogo} alt="Apsel Logo" className="h-6 w-auto" />
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
          icon={<PackageSearch size={20} />}
          label="Inventory"
          path="/inventory"
          active={location.pathname.startsWith("/inventory")}
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
          icon={<Users size={20} />}
          label="Customers"
          path="/customers"
          active={location.pathname.startsWith("/customers")}
          onClick={closeMobileMenu}
        />
        {/* <SidebarItem 
          icon={<BarChart3 size={20} />} 
          label="Analytics" 
          path="/analytics" 
          active={location.pathname.startsWith("/analytics")} 
          onClick={closeMobileMenu}
        /> */}
        {/* <SidebarItem 
          icon={<LineChart size={20} />} 
          label="Sales Chart" 
          path="/sales-chart" 
          active={location.pathname.startsWith("/sales-chart")} 
          onClick={closeMobileMenu}
        /> */}
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
          onClick={handleLogout}>
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
