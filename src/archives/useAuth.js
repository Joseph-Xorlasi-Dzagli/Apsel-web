// // src/hooks/useAuth.js
// import { useState, useEffect, createContext, useContext } from "react";
// import {
//   onAuthStateChanged,
//   getCurrentUser,
//   loginWithEmail,
//   registerWithEmail,
//   signInWithGoogle,
//   sendPhoneVerification,
//   verifyOTP,
//   resetPassword,
//   logout,
//   updateUserProfile,
//   createBusiness,
// } from "../services/authService";

// // Create auth context
// const AuthContext = createContext();

// // Auth provider component
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged((user) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Sign up with email
//   const signup = async (email, password) => {
//     setError(null);
//     try {
//       const user = await registerWithEmail(email, password);
//       return user;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Sign in with email
//   const login = async (email, password) => {
//     setError(null);
//     try {
//       const user = await loginWithEmail(email, password);
//       return user;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Sign in with Google
//   const loginWithGoogle = async () => {
//     setError(null);
//     try {
//       const user = await signInWithGoogle();
//       return user;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Send phone verification code
//   const sendPhoneOTP = async (phoneNumber, recaptchaVerifier) => {
//     setError(null);
//     try {
//       const result = await sendPhoneVerification(
//         phoneNumber,
//         recaptchaVerifier
//       );
//       setConfirmationResult(result);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Verify OTP and sign in
//   const verifyPhoneOTP = async (otp) => {
//     setError(null);
//     try {
//       if (!confirmationResult) {
//         throw new Error("No verification was sent. Please request OTP first.");
//       }
//       const user = await verifyOTP(confirmationResult, otp);
//       return user;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Reset password
//   const forgotPassword = async (email) => {
//     setError(null);
//     try {
//       await resetPassword(email);
//       return true;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Sign out
//   const signout = async () => {
//     setError(null);
//     try {
//       await logout();
//       return true;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Update user profile
//   const updateProfile = async (userData) => {
//     setError(null);
//     try {
//       if (!currentUser) {
//         throw new Error("No authenticated user found");
//       }
//       await updateUserProfile(currentUser.uid, userData);
//       return true;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   // Create business
//   const setupBusiness = async (businessData) => {
//     setError(null);
//     try {
//       if (!currentUser) {
//         throw new Error("No authenticated user found");
//       }
//       const businessId = await createBusiness(businessData);
//       return businessId;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     }
//   };

//   const value = {
//     currentUser,
//     loading,
//     error,
//     signup,
//     login,
//     loginWithGoogle,
//     sendPhoneOTP,
//     verifyPhoneOTP,
//     forgotPassword,
//     signout,
//     updateProfile,
//     setupBusiness,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Hook to use auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
