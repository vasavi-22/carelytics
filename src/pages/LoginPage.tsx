import { useEffect, useMemo, useState, type FormEvent } from "react";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [emailPasswordError, setEmailPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, status, user]);

  function isValidEmail(next: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next);
  }

  async function onGoogleSignIn() {
    setEmailPasswordError(null);
    setSubmitting(true);
    const res = await signInWithGoogle();
    setSubmitting(false);

    if (res.ok) {
      navigate(from, { replace: true });
    }
  }

  async function onEmailPasswordLogin(e: FormEvent) {
    e.preventDefault();
    setEmailPasswordError(null);

    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) nextErrors.email = "Email is required.";
    else if (!isValidEmail(trimmedEmail)) nextErrors.email = "Enter a valid email address.";

    if (!password) nextErrors.password = "Password is required.";
    else if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Intentionally not wired yet per your requirement.
    setEmailPasswordError(
      "Email/Password login is not enabled in this demo. Please use “Continue with Google”.",
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome to Carelytics</h1>
        <p>Sign in to access healthcare operations and insights.</p>
        <div className="auth-form">
          {emailPasswordError ? (
            <div className="error-banner" role="alert">
              {emailPasswordError}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="error-banner" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <form className="email-form" onSubmit={onEmailPasswordLogin}>
            <label>
              Work Email
              <input
                type="email"
                placeholder="you@hospital.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email ? <span className="field-error">{fieldErrors.email}</span> : null}
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}
            </label>

            <button
              type="submit"
              disabled={submitting || status === "loading"}
              className="primary-btn"
            >
              Login
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

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

          <button type="button" className="register-btn" disabled>
            Create account / Register
          </button>

          <p className="auth-helper">You will be redirected to Google to authenticate.</p>
        </div>
      </div>
    </section>
  );
}
