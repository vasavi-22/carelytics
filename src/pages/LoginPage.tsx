import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, user, errorMessage, signInWithGoogle } = useAuth();

  const from = useMemo(() => {
    const state = location.state as { from?: string } | null;
    return state?.from ?? "/";
  }, [location.state]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, status, user]);

  async function onGoogleSignIn() {
    setSubmitting(true);
    const res = await signInWithGoogle();
    setSubmitting(false);

    if (res.ok) {
      navigate(from, { replace: true });
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome to Carelytics</h1>
        <p>Sign in to access healthcare operations and insights.</p>
        <div className="auth-form">
          {errorMessage ? (
            <div className="error-banner" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            className="google-signin-btn"
            disabled={submitting || status === "loading"}
            onClick={() => {
              void onGoogleSignIn();
            }}
          >
            {submitting ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="auth-helper">
            You will be redirected to Google to authenticate.
          </p>
        </div>
      </div>
    </section>
  );
}
