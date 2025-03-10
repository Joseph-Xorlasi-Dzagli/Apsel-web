import { ArrowLeft, Building, CreditCard, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  onPrevious: () => void;
}

export const WizardHeader = ({
  step,
  totalSteps,
  title,
  onPrevious,
}: WizardHeaderProps) => {
  const getStepIcon = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return <Building className="h-5 w-5" />;
      case 2:
        return <User className="h-5 w-5" />;
      case 3:
        return <CreditCard className="h-5 w-5" />;
      case 4:
        return <MapPin className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 mr-2"
          onClick={onPrevious}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full mb-2 ${
                i + 1 === step
                  ? "bg-cyan-500 text-white"
                  : i + 1 < step
                  ? "bg-cyan-100 text-cyan-500"
                  : "bg-gray-100 text-gray-400"
              }`}>
              {getStepIcon(i + 1)}
            </div>
            <div
              className={`h-1 w-full ${
                i === totalSteps - 1
                  ? "hidden"
                  : i + 1 < step
                  ? "bg-cyan-500"
                  : "bg-gray-200"
              }`}
            />
          </div>
        ))}
      </div>
    </>
  );
};
