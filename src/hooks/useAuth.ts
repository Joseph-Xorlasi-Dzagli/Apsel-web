import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  updateProfile as firebaseUpdateProfile,
  User,
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";

// Extend the Firebase User type to include our custom methods
type ExtendedUser = User & {
  setupBusiness: (businessData: {
    name: string;
    industry: string;
    employee_count: string;
    is_open: boolean;
    [key: string]: any;
  }) => Promise<string>;
};

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep track of the confirmation result for phone authentication
  let phoneConfirmationResult: ConfirmationResult | null = null;

  // Setup business profile
  const setupBusiness = async (businessData: {
    name: string;
    industry: string;
    employee_count: string;
    is_open: boolean;
    [key: string]: any;
  }) => {
    try {
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      // Create a new business document
      const businessRef = doc(db, "businesses", currentUser.uid);
      await setDoc(businessRef, {
        owner_id: currentUser.uid,
        name: businessData.name,
        industry: businessData.industry,
        employee_count: businessData.employee_count,
        is_open: businessData.is_open,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return businessRef.id;
    } catch (error) {
      console.error("Error setting up business:", error);
      throw error;
    }
  };

  // Function to extend user with our custom methods
  const extendUser = (user: User | null): ExtendedUser | null => {
    if (!user) return null;

    // Add our custom methods to the user object
    const extendedUser = user as ExtendedUser;
    extendedUser.setupBusiness = setupBusiness;

    return extendedUser;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(extendUser(user));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email/Password Authentication
  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      return extendUser(userCredential.user) as ExtendedUser;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update last login timestamp
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        last_login: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return extendUser(userCredential.user) as ExtendedUser;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  // Google Authentication
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      // Check if this user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        // If not, create a new user document
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          last_login: serverTimestamp(),
        });
      } else {
        // Update last login timestamp
        await updateDoc(doc(db, "users", userCredential.user.uid), {
          last_login: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      return extendUser(userCredential.user) as ExtendedUser;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  // Phone Authentication
  const sendPhoneOTP = async (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
  ) => {
    try {
      phoneConfirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      return phoneConfirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const verifyPhoneOTP = async (verificationCode: string) => {
    try {
      if (!phoneConfirmationResult) {
        throw new Error("No verification process in progress");
      }

      const userCredential = await phoneConfirmationResult.confirm(
        verificationCode
      );

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, "users", userCredential.user.uid), {
          phone: userCredential.user.phoneNumber,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
          last_login: serverTimestamp(),
        });
      } else {
        // Update last login timestamp
        await updateDoc(doc(db, "users", userCredential.user.uid), {
          last_login: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      return extendUser(userCredential.user) as ExtendedUser;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (userData: {
    name?: string;
    phone?: string;
    [key: string]: any;
  }) => {
    try {
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      // Update auth profile if name is provided
      if (userData.name) {
        await firebaseUpdateProfile(currentUser, {
          displayName: userData.name,
        });
      }

      // Update user document in Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...userData,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return {
    currentUser,
    loading,
    signup,
    login,
    logout,
    forgotPassword,
    loginWithGoogle,
    sendPhoneOTP,
    verifyPhoneOTP,
    updateProfile,
    setupBusiness,
  };
}

export default useAuth;
