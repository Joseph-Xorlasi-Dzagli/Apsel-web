// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { getAuth } from "firebase/auth";
// import { populateBusinessData } from "@/utils/populateBusinessData";

// export const  = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const auth = getAuth();

//   const handlePopulate = async () => {
//     // Check if user is logged in
//     if (!auth.currentUser) {
//       toast({
//         title: "Authentication required",
//         description: "You must be logged in to populate business data",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await populateBusinessData(auth.currentUser.uid);
//       toast({
//         title: "Success",
//         description: "Sample business data has been populated successfully",
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       toast({
//         title: "Error populating data",
//         description:
//           error.message || "There was a problem populating business data",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Button onClick={handlePopulate} disabled={isLoading} className="w-full">
//       {isLoading ? "Populating..." : "Populate Sample Business Data"}
//     </Button>
//   );
// };


// Example usage in a settings page or admin function

import React, { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBusiness } from "@/hooks/useBusiness";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import populateBusinessData from "@/utils/populateBusinessData";

export function PopulateBusinessButton() {
  const { currentUser } = useAuthContext();
  const { business } = useBusiness();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePopulateData = async () => {
    if (!currentUser || !business) {
      toast({
        title: "Error",
        description: "User or business data not available",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      await populateBusinessData(business.id, currentUser.uid);

      toast({
        title: "Success",
        description: "Sample data has been populated for your business",
      });
    } catch (error: any) {
      console.error("Error populating data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to populate sample data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-medium">Demo Data</h3>
        <p className="text-sm text-muted-foreground">
          Populate your business with sample products, customers, and orders for
          demonstration purposes.
        </p>
      </div>

      <Button onClick={handlePopulateData} disabled={isLoading || !business}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Populating Data...
          </>
        ) : (
          "Populate Sample Data"
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-2">
        Note: This will create sample categories, products, customers, and
        orders for your business. This is intended for demonstration purposes
        only.
      </p>
    </div>
  );
}

export default PopulateBusinessButton;
