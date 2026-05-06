import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getAuthInstance } from "../../integrations/firebase/firebaseClient";
import type { AuthStatus, SignInResult } from "./types";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  errorMessage: string | null;
  signInWithGoogle: () => Promise<SignInResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toFriendlyErrorMessage(error: unknown) {
  const code = (error && typeof error === "object" && "code" in error && typeof (error as any).code === "string")
    ? (error as any).code
    : "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "Google sign-in is temporarily disabled for this Firebase project.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Please allow popups and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled. Please try again.";
    case "auth/cancelled-popup-request":
      return "Sign-in request was cancelled. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "This account exists with a different sign-in method. Please use the correct method.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Google sign-in. Check Firebase OAuth authorized domains.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authRef = useRef<ReturnType<typeof getAuthInstance> | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      const auth = getAuthInstance();
      authRef.current = auth;

      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setStatus(nextUser ? "authenticated" : "unauthenticated");
        setErrorMessage(null);
      });
    } catch (err) {
      setStatus("error");
      setUser(null);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Firebase authentication is not configured correctly.",
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<SignInResult> => {
    setErrorMessage(null);

    const auth = authRef.current;
    if (!auth) {
      return { ok: false, message: "Firebase auth is not ready yet." };
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will update `user` and `status`
      return { ok: true };
    } catch (err) {
      const message = toFriendlyErrorMessage(err);
      setStatus("error");
      setErrorMessage(message);
      return { ok: false, message };
    }
  }, []);

  const signOutFn = useCallback(async () => {
    setErrorMessage(null);
    const auth = authRef.current;
    if (!auth) return;
    setStatus("loading");
    await signOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      errorMessage,
      signInWithGoogle,
      signOut: signOutFn,
    }),
    [status, user, errorMessage, signInWithGoogle, signOutFn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

