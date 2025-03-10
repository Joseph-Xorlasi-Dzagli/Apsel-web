import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpVerificationProps {
  onVerify: () => void;
  onGoBack: () => void;
}

export const OtpVerification = ({
  onVerify,
  onGoBack,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      onVerify();
    }
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
            maxLength={4}
            value={otp}
            // onChange={(newValue: string) => setOtp(newValue)}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    key={index}
                    {...slot}
                    index={index}
                    className="h-12 w-12"
                  />
                ))}
              </InputOTPGroup>
            )}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Enter the OTP we sent to you
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600"
            disabled={otp.length !== 4}>
            Confirm
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
              onClick={() => console.log("Resend OTP")}
              className="text-cyan-500 p-0">
              Resend OTP
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
