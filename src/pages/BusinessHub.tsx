import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessOverview } from "@/components/business/BusinessOverview";
import { MarketInsights } from "@/components/business/MarketInsights";
import { CompetitorAnalysis } from "@/components/business/CompetitorAnalysis";
import { GrowthOpportunities } from "@/components/business/GrowthOpportunities";
import BusinessProfile from "@/components/business/BusinessProfile";
import BusinessSetupWizard from "@/components/business/BusinessSetupWizard";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import { Loader2 } from "lucide-react";

const BusinessHub = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { isFirstTimeSetup, loading } = useBusiness();

  const [activeTab, setActiveTab] = useState<string>("profile");

  const handleCompleteSetup = (data: any) => {
    console.log("Business setup complete with data:", data);
    toast({
      title: "Setup Complete",
      description: "Your business profile has been set up successfully.",
    });
  };

  const handleCancelSetup = () => {
    if (
      confirm("Are you sure you want to cancel the business setup process?")
    ) {
      // Navigate back to dashboard or another page
      window.location.href = "/";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-500 mb-4" />
        <p className="text-muted-foreground">Loading business profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Hub</h1>
        <p className="text-muted-foreground">
          {isFirstTimeSetup
            ? "Complete your business profile setup"
            : "Manage your business profile and insights"}
        </p>
      </div>

      {isFirstTimeSetup ? (
        <BusinessSetupWizard
          onComplete={handleCompleteSetup}
          onCancel={handleCancelSetup}
        />
      ) : (
        <Card className="border-none">
          <CardContent className="p-0">
            <BusinessProfile />

            {/* <Tabs
              defaultValue="profile"
              onValueChange={(value) => setActiveTab(value)}
              className="w-full">
              <TabsList className="grid grid-cols-4 h-auto p-2 bg-muted mx-6 mt-6">
                <TabsTrigger value="profile" className="py-2">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="overview" className="py-2">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="insights" className="py-2">
                  Insights
                </TabsTrigger>
                <TabsTrigger value="growth" className="py-2">
                  Growth
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <BusinessProfile />
                </TabsContent>

                <TabsContent value="overview" className="mt-0">
                  <BusinessOverview />
                </TabsContent>

                <TabsContent value="insights" className="mt-0">
                  <Tabs defaultValue="market" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="market" className="flex-1">
                        Market Insights
                      </TabsTrigger>
                      <TabsTrigger value="competitors" className="flex-1">
                        Competitor Analysis
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="market" className="mt-6">
                      <MarketInsights />
                    </TabsContent>
                    <TabsContent value="competitors" className="mt-6">
                      <CompetitorAnalysis />
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="growth" className="mt-0">
                  <GrowthOpportunities />
                </TabsContent>
              </div>
            </Tabs> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessHub;
