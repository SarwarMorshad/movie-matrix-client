import { useCallback, useEffect, useState } from "react";

import auth from "../config/firebase";
import { isAccountActive } from "../config/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

// "Remember me": stay signed in after the browser closes, or only for this tab session
const rememberSignIn = (remember) => setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);

// Keeps `loading` honest when a Firebase call fails (no auth-state change follows)
const withLoading = (setLoading, promise) =>
  promise.catch((error) => {
    setLoading(false);
    throw error;
  });

/**
 * Auth state for the whole app.
 *   user         a signed-in account that may use the app (see isAccountActive)
 *   pendingUser  signed in with email/password but the email isn't verified yet;
 *                the app treats them as logged out until they verify
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sort a Firebase user into `user` or `pendingUser`
  const applyUser = useCallback((firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      setPendingUser(null);
    } else if (isAccountActive(firebaseUser)) {
      setUser(firebaseUser);
      setPendingUser(null);
    } else {
      setUser(null);
      setPendingUser(firebaseUser);
    }
  }, []);

  const createUser = (email, password) => {
    setLoading(true);
    return withLoading(setLoading, createUserWithEmailAndPassword(auth, email, password));
  };

  const signInUser = (email, password, remember = true) => {
    setLoading(true);
    return withLoading(
      setLoading,
      rememberSignIn(remember).then(() => signInWithEmailAndPassword(auth, email, password))
    );
  };

  const signInWithGoogle = (remember = true) => {
    setLoading(true);
    return withLoading(
      setLoading,
      rememberSignIn(remember).then(() => signInWithPopup(auth, googleProvider))
    );
  };

  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Email the signed-in (pending) user a verification link that returns to the login page
  const sendVerificationEmail = () =>
    sendEmailVerification(auth.currentUser, { url: `${window.location.origin}/login?verified=1` });

  // After the user clicks the link: reload their account and get a fresh token
  // (it carries the new email_verified claim the server checks). Returns true
  // when the account can now use the app.
  const refreshVerification = async () => {
    const current = auth.currentUser;
    if (!current) return false;
    await current.reload();
    if (current.emailVerified) await current.getIdToken(true);
    applyUser(auth.currentUser);
    return isAccountActive(auth.currentUser);
  };

  const logOut = () => {
    setLoading(true);
    return withLoading(setLoading, signOut(auth));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      applyUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [applyUser]);

  const authData = {
    user,
    pendingUser,
    setUser,
    loading,
    createUser,
    signInUser,
    signInWithGoogle,
    updateUserProfile,
    resetPassword,
    sendVerificationEmail,
    refreshVerification,
    logOut,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
