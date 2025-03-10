import { useState } from "react";
import { Login } from "@/components/auth/Login";
import { Signup } from "@/components/auth/Signup";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { OtpVerification } from "@/components/auth/OtpVerification";
import { WelcomeScreen } from "@/components/auth/WelcomeScreen";

const Auth = () => {
  const [currentView, setCurrentView] = useState<
    "login" | "signup" | "forgot-password" | "otp" | "welcome"
  >("login");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [userData, setUserData] = useState<any>({});

  const handleLogin = (data: any) => {
    console.log("Login data:", data);
    // In a real app, this would call an API to authenticate the user
    // For now, we'll simulate success and redirect to the welcome page
    setUserData(data);
    setCurrentView("welcome");
  };

  const handleSignup = (data: any) => {
    console.log("Signup data:", data);
    // In a real app, this would call an API to register the user
    setUserData(data);
    setCurrentView("otp");
  };

  const handleForgotPassword = (data: any) => {
    console.log("Forgot password data:", data);
    setCurrentView("otp");
  };

  const handleVerifyOtp = () => {
    if (userData.email) {
      setCurrentView("welcome");
    } else {
      setCurrentView("login");
    }
  };

  const handleWelcomeComplete = () => {
    // Redirect to the main app after welcome
    window.location.href = "/business-hub";
  };

  const switchToLogin = () => setCurrentView("login");
  const switchToSignup = () => setCurrentView("signup");
  const switchToForgotPassword = () => setCurrentView("forgot-password");
  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === "email" ? "phone" : "email");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {currentView === "login" && (
          <Login
            onSubmit={handleLogin}
            onForgotPassword={switchToForgotPassword}
            onSignup={switchToSignup}
            authMethod={authMethod}
            onToggleAuthMethod={toggleAuthMethod}
          />
        )}

        {currentView === "signup" && (
          <Signup
            onSubmit={handleSignup}
            onLogin={switchToLogin}
            authMethod={authMethod}
            onToggleAuthMethod={toggleAuthMethod}
          />
        )}

        {currentView === "forgot-password" && (
          <ForgotPassword
            onSubmit={handleForgotPassword}
            onGoBack={switchToLogin}
            authMethod={authMethod}
            onToggleAuthMethod={toggleAuthMethod}
          />
        )}

        {currentView === "otp" && (
          <OtpVerification
            onVerify={handleVerifyOtp}
            onGoBack={() =>
              setCurrentView(userData.email ? "signup" : "forgot-password")
            }
          />
        )}

        {currentView === "welcome" && (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        )}
      </div>
    </div>
  );
};

export default Auth;
