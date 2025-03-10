import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { WizardHeader } from "./setup/WizardHeader";
import { BusinessProfileStep } from "./setup/BusinessProfileStep";
import { BusinessContactStep } from "./setup/BusinessContactStep";
import { PaymentAccountStep } from "./setup/PaymentaccountStep";
import { BusinessAddressStep } from "./setup/BusinessAddressStep";
import { generateBusinessEmail } from "./setup/utils";
import {
  BusinessProfileForm,
  BusinessContactForm,
  PaymentAccountForm,
  BusinessAddressForm,
} from "./setup/validation";

interface BusinessSetupWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const BusinessSetupWizard = ({
  onComplete,
  onCancel,
}: BusinessSetupWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalSteps = 4;

  const handleNextStep = (data: any) => {
    setFormData({ ...formData, ...data });

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

  const handleCompleteSetup = () => {
    const completeData = { ...formData };
    onComplete(completeData);
    setShowConfirmation(false);
    toast({
      title: "Business profile setup complete",
      description: "Your business profile has been created successfully.",
    });
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Business Profile";
      case 2:
        return "Business Contact";
      case 3:
        return "Payment Account";
      case 4:
        return "Business Address";
      default:
        return "";
    }
  };

  // Pre-populate email for contact step
  const getContactDefaultValues = (): Partial<BusinessContactForm> => {
    if (formData.name) {
      return {
        email: generateBusinessEmail(formData.name),
      };
    }
    return {};
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <BusinessProfileStep
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            defaultValues={formData}
          />
        );
      case 2:
        return (
          <BusinessContactStep
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            defaultValues={{ ...formData, ...getContactDefaultValues() }}
          />
        );
      case 3:
        return (
          <PaymentAccountStep
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            defaultValues={formData}
          />
        );
      case 4:
        return (
          <BusinessAddressStep
            onNext={handleNextStep}
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
        description="Your business profile is now ready. Are you sure you want to complete the setup?"
        confirmText="Complete Setup"
        cancelText="Review Again"
      />
    </div>
  );
};

export default BusinessSetupWizard;
