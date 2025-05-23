import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpVerificationProps {
  onVerify: (otp: string) => void;
  onGoBack: () => void;
}

export const OtpVerification = ({
  onVerify,
  onGoBack,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setIsSubmitting(true);
      onVerify(otp);
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    // In a real application, you would trigger the resend OTP function here
    alert("OTP resent. Please check your phone.");
  };

  return (
    <div className="space-y-6 animate-in-slide">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGoBack}
          className="h-8 w-8 p-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">OTP Verification</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Code</label>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot index={0} key={index} {...slot} className="h-12 w-12" />
                ))}
              </InputOTPGroup>
            )}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit verification code sent to your phone/email
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600"
            disabled={otp.length !== 6 || isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>

          <div className="flex justify-between mt-2">
            <Button
              variant="link"
              type="button"
              onClick={onGoBack}
              className="text-cyan-500 p-0">
              Go back
            </Button>

            <Button
              variant="link"
              type="button"
              onClick={handleResend}
              className="text-cyan-500 p-0">
              Resend OTP
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;