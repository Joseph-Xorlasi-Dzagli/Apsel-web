import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessOverview } from "@/components/business/BusinessOverview";
import { MarketInsights } from "@/components/business/MarketInsights";
import { CompetitorAnalysis } from "@/components/business/CompetitorAnalysis";
import { GrowthOpportunities } from "@/components/business/GrowthOpportunities";
import BusinessProfile from "@/components/business/BusinessProfile";
import BusinessSetupWizard from "@/components/business/BusinessSetupWizard";
import { useToast } from "@/hooks/use-toast";

const BusinessHub = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  const handleCompleteSetup = (data: any) => {
    console.log("Business setup complete with data:", data);
    setIsFirstTimeUser(false);
    toast({
      title: "Setup Complete",
      description: "Your business profile has been set up successfully.",
    });
  };

  const handleCancelSetup = () => {
    if (
      confirm("Are you sure you want to cancel the business setup process?")
    ) {
      setIsFirstTimeUser(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Hub</h1>
        <p className="text-muted-foreground">
          {isFirstTimeUser
            ? "Complete your business profile setup"
            : "Manage your business profile and insights"}
        </p>
      </div>

      {isFirstTimeUser ? (
        <BusinessSetupWizard
          onComplete={handleCompleteSetup}
          onCancel={handleCancelSetup}
        />
      ) : (
        <Card className="border-none">
          <CardContent className="p-0">
            <Tabs
              defaultValue="profile"
              onValueChange={(value) => setActiveTab(value)}
              className="w-full">
              <div className="p-6">
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <BusinessProfile />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessHub;
