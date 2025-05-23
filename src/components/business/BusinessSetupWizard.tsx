import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import { Loader2 } from "lucide-react";
import { BusinessProfileForm } from "./setup/validation";
import { BusinessContactForm } from "./setup/validation";
import { PaymentAccountForm } from "./setup/validation";
import { BusinessAddressForm } from "./setup/validation";
import { mapToFirestore } from "./setup/validation";
import { WizardHeader } from "./setup/WizardHeader";
import { BusinessProfileStep } from "./setup/BusinessProfileStep";
import { BusinessContactStep } from "./setup/BusinessContactStep";
import { PaymentAccountStep } from "./setup/PaymentAccountStep";
import { BusinessAddressStep } from "./setup/BusinessAddressStep";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface BusinessSetupWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const BusinessSetupWizard = ({
  onComplete,
  onCancel,
}: BusinessSetupWizardProps) => {
  const { toast } = useToast();
  const { setupBusiness, savingData } = useBusiness();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalSteps = 4;

  const handleNextStep = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step completed, show confirmation dialog
      setShowConfirmation(true);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const handleCompleteSetup = async () => {
    try {
      // Transform form data to Firestore format
      const firestoreData = mapToFirestore(formData);

      // Create business profile in Firestore
      const businessId = await setupBusiness(firestoreData);

      if (businessId) {
        // Pass the created data back to the parent component
        onComplete(formData);
        setShowConfirmation(false);

        toast({
          title: "Business profile setup complete",
          description: "Your business profile has been created successfully.",
        });
      }
    } catch (error: any) {
      console.error("Error creating business:", error);
      toast({
        title: "Setup failed",
        description:
          error.message ||
          "There was an error setting up your business profile.",
        variant: "destructive",
      });
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Business Profile";
      case 2:
        return "Contact Information";
      case 3:
        return "Payment Account";
      case 4:
        return "Business Address";
      default:
        return "";
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <BusinessProfileStep
            onNext={(data: BusinessProfileForm) => handleNextStep(data)}
            onPrevious={handlePreviousStep}
            defaultValues={formData}
          />
        );
      case 2:
        return (
          <BusinessContactStep
            onNext={(data: BusinessContactForm) => handleNextStep(data)}
            onPrevious={handlePreviousStep}
            defaultValues={{ ...formData }}
          />
        );
      case 3:
        return (
          <PaymentAccountStep
            onNext={(data: PaymentAccountForm) => handleNextStep(data)}
            onPrevious={handlePreviousStep}
            defaultValues={formData}
          />
        );
      case 4:
        return (
          <BusinessAddressStep
            onNext={(data: BusinessAddressForm) => handleNextStep(data)}
            onPrevious={handlePreviousStep}
            defaultValues={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <WizardHeader
        step={step}
        totalSteps={totalSteps}
        title={getStepTitle()}
        onPrevious={handlePreviousStep}
      />

      {renderCurrentStep()}

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleCompleteSetup}
        title="Complete Business Setup"
        description="Your business profile is now ready to be created. Are you sure you want to complete the setup?"
        confirmText={savingData ? "Setting up..." : "Complete Setup"}
        cancelText="Review Again"
      />
    </div>
  );
};

export default BusinessSetupWizard;
