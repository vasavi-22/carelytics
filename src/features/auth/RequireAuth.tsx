import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation();
  const { status, user, errorMessage } = useAuth();

  if (status === "loading") {
    return <div style={{ padding: 16 }}>Loading authentication...</div>;
  }

  if (errorMessage && !user) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Authentication error</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

