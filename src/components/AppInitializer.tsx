import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBusiness } from "@/hooks/useBusiness";
import { useToast } from "@/hooks/use-toast";
import { initializeCollections } from "@/utils/firestoreInit";

// This component is responsible for initializing app settings when the app loads
// It doesn't render anything visible to the user
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuthContext();
  const { business, loading: businessLoading } = useBusiness();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const setupApp = async () => {
      // Only run initialization when both user and business data are available
      if (!currentUser || businessLoading || !business || initialized) {
        return;
      }

      try {
        // Initialize required collections
        const success = await initializeCollections(
          business.id,
          currentUser.uid
        );

        if (success) {
          // Mark as initialized to prevent re-running
          setInitialized(true);
          toast({
            title: "Success",
            description: "Application data initialized successfully",
          });
        } else {
          toast({
            title: "Warning",
            description: "Some application data could not be initialized",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to initialize app data:", error);
        toast({
          title: "Error",
          description: "Failed to initialize application data",
          variant: "destructive",
        });
      }
    };

    setupApp();
  }, [currentUser, business, businessLoading, initialized, toast]);

  // The component doesn't render anything visible
  return <>{children}</>;
};

export default AppInitializer;
