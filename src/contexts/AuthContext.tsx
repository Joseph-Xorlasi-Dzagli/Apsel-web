import React, { createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import { RecaptchaVerifier } from "firebase/auth";

// Define the extended user type with our custom methods
type ExtendedUser = User & {
  setupBusiness: (businessData: {
    name: string;
    industry: string;
    employee_count: string;
    is_open: boolean;
    [key: string]: any;
  }) => Promise<string>;
};

interface AuthContextType {
  currentUser: ExtendedUser | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<ExtendedUser>;
  login: (email: string, password: string) => Promise<ExtendedUser>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<ExtendedUser>;
  sendPhoneOTP: (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
  ) => Promise<any>;
  verifyPhoneOTP: (verificationCode: string) => Promise<ExtendedUser>;
  updateProfile: (userData: {
    name?: string;
    phone?: string;
    [key: string]: any;
  }) => Promise<void>;
  setupBusiness: (businessData: {
    name: string;
    industry: string;
    employee_count: string;
    is_open: boolean;
    [key: string]: any;
  }) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  // Cast the auth values to their proper types
  const value: AuthContextType = {
    currentUser: auth.currentUser as ExtendedUser | null,
    loading: auth.loading,
    signup: auth.signup as (
      email: string,
      password: string
    ) => Promise<ExtendedUser>,
    login: auth.login as (
      email: string,
      password: string
    ) => Promise<ExtendedUser>,
    logout: auth.logout,
    forgotPassword: auth.forgotPassword,
    loginWithGoogle: auth.loginWithGoogle as () => Promise<ExtendedUser>,
    sendPhoneOTP: auth.sendPhoneOTP,
    verifyPhoneOTP: auth.verifyPhoneOTP as (
      verificationCode: string
    ) => Promise<ExtendedUser>,
    updateProfile: auth.updateProfile,
    setupBusiness: auth.setupBusiness,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
