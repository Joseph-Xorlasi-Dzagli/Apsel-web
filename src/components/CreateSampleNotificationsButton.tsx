import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createSampleNotifications } from "@/utils/firestoreInit";
import { useBusiness } from "@/hooks/useBusiness";
import { useToast } from "@/hooks/use-toast";

/**
 * A debug button to generate sample notifications for testing
 * This would only be visible in development mode
 */
const CreateSampleNotificationsButton = () => {
  const { business } = useBusiness();
  const { toast } = useToast();

  const handleCreateSamples = async () => {
    if (!business) {
      toast({
        title: "Error",
        description: "Business data not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await createSampleNotifications(business.id);

      if (success) {
        toast({
          title: "Success",
          description: "Sample notifications created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create sample notifications",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating sample notifications:", error);
      toast({
        title: "Error",
        description: "Failed to create sample notifications",
        variant: "destructive",
      });
    }
  };

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute bottom-4 right-4 gap-1"
      onClick={handleCreateSamples}>
      <Plus className="h-4 w-4" />
      <span>Generate Test Notifications</span>
    </Button>
  );
};

export default CreateSampleNotificationsButton;
