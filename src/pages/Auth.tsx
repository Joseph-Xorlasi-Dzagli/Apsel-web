import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier } from "firebase/auth";
import { Login } from "@/components/auth/Login";
import { Signup } from "@/components/auth/Signup";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { OtpVerification } from "@/components/auth/OtpVerification";
import { WelcomeScreen } from "@/components/auth/WelcomeScreen";
import { useAuthContext } from "@/contexts/AuthContext";
import { auth } from "@/config/firebase";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [currentView, setCurrentView] = useState<
    "login" | "signup" | "forgot-password" | "otp" | "welcome"
  >("login");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [userData, setUserData] = useState<any>({});
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    sendPhoneOTP,
    verifyPhoneOTP,
    forgotPassword,
    updateProfile,
    setupBusiness,
  } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If user is already logged in and there's no pending workflow, redirect to dashboard
  useEffect(() => {
    if (currentUser && currentView === "login") {
      navigate("/business-hub");
    }
  }, [currentUser, currentView, navigate]);

  // Initialize recaptcha verifier for phone authentication
  useEffect(() => {
    if (authMethod === "phone" && !recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      setRecaptchaVerifier(verifier);
    }
  }, [authMethod, recaptchaVerifier]);

  const handleLogin = async (data: any) => {
    try {
      if (authMethod === "email") {
        await login(data.email, data.password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/business-hub");
      } else {
        // For phone login, we first send OTP
        if (!recaptchaVerifier) {
          toast({
            title: "Error",
            description: "Recaptcha not initialized. Please try again.",
            variant: "destructive",
          });
          return;
        }
        await sendPhoneOTP(data.phone, recaptchaVerifier);
        setUserData(data);
        setCurrentView("otp");
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (data: any) => {
    try {
      if (authMethod === "email") {
        await signup(data.email, data.password);
        setUserData(data);
        setCurrentView("welcome");
        toast({
          title: "Signup successful",
          description:
            "Please verify your email address. We've sent you a verification link.",
        });
      } else {
        // For phone signup, we first send OTP
        if (!recaptchaVerifier) {
          toast({
            title: "Error",
            description: "Recaptcha not initialized. Please try again.",
            variant: "destructive",
          });
          return;
        }
        await sendPhoneOTP(data.phone, recaptchaVerifier);
        setUserData(data);
        setCurrentView("otp");
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (data: any) => {
    try {
      if (authMethod === "email") {
        await forgotPassword(data.email);
        toast({
          title: "Password reset email sent",
          description:
            "Please check your email for password reset instructions.",
        });
        setCurrentView("login");
      } else {
        // For phone reset, we first send OTP
        if (!recaptchaVerifier) {
          toast({
            title: "Error",
            description: "Recaptcha not initialized. Please try again.",
            variant: "destructive",
          });
          return;
        }
        await sendPhoneOTP(data.phone, recaptchaVerifier);
        setUserData(data);
        setCurrentView("otp");
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyPhoneOTP("123456"); // Replace with actual OTP

      // Update user profile if coming from signup
      if (userData.name) {
        await updateProfile({
          name: userData.name,
          phone: userData.phone,
        });
      }

      toast({
        title: "Verification successful",
        description: "Your phone number has been verified.",
      });

      setCurrentView("welcome");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleWelcomeComplete = async (businessData: any) => {
    try {
      // Create the business in Firestore
      await setupBusiness({
        name: businessData.businessName,
        industry: businessData.industry,
        employee_count: businessData.employees,
        is_open: true,
      });

      toast({
        title: "Business setup complete",
        description: "Your business profile has been created successfully.",
      });

      // Redirect to the main app
      navigate("/business-hub");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: "Login successful",
        description: "You've been signed in with Google.",
      });
      navigate("/business-hub");
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const switchToLogin = () => setCurrentView("login");
  const switchToSignup = () => setCurrentView("signup");
  const switchToForgotPassword = () => setCurrentView("forgot-password");
  const toggleAuthMethod = () => {
    setAuthMethod(authMethod === "email" ? "phone" : "email");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md">
        {currentView === "login" && (
          <Login
            onSubmit={handleLogin}
            onForgotPassword={switchToForgotPassword}
            onSignup={switchToSignup}
            authMethod={authMethod}
            onToggleAuthMethod={toggleAuthMethod}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}

        {currentView === "signup" && (
          <Signup
            onSubmit={handleSignup}
            onLogin={switchToLogin}
            authMethod={authMethod}
            onToggleAuthMethod={toggleAuthMethod}
            onGoogleSignIn={handleGoogleSignIn}
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
