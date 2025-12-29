"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "@/firebase";

const LOGIN_ROUTE = "/pages/login";

// --------- routes that only authed users can see
const ACCOUNT_ROUTE = "/pages/account";

const AuthRouter = (props: any) => {
  // Initialize Firebase - this should not throw, but handle gracefully
  const app = initFirebase();
  const auth = getAuth(app);
  
  // Hooks must be called unconditionally
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathName = usePathname();

  // Pages that require the user to be authenticated
  const protectedRoutes = ["/pages/account", "/pages/hidden"];

  const redirect = (
    isLoading: boolean,
    firebaseUser: User | null | undefined,
  ) => {
    if (!isLoading) {
      if (firebaseUser) {
        // User is logged in
        if (pathName === LOGIN_ROUTE) {
          router.push(ACCOUNT_ROUTE); // Redirect from login to account if logged in
        }
      } else {
        // User is not logged in
        if (protectedRoutes.includes(pathName)) {
          router.push(LOGIN_ROUTE); // Redirect to login if trying to access a protected route
        }
      }
    }
  };

  useEffect(() => {
    redirect(loading, user);
  }, [loading, user, pathName]);

  // Log auth errors but don't block rendering
  useEffect(() => {
    if (error) {
      console.error("Firebase auth error:", error);
    }
  }, [error]);

  if (loading) {
    return null; // Show a loader or return null while checking auth state
  } else {
    return <>{props.children}</>; // Render children when not loading
  }
};

export default AuthRouter;
