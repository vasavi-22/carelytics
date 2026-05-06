import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

function getTitle(pathname: string) {
  if (pathname.startsWith("/analytics")) return "Analytics";
  if (pathname.startsWith("/patients")) return "Patient Details";
  return "Dashboard";
}

export function TopHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const title = useMemo(() => getTitle(location.pathname), [location.pathname]);

  const initial = useMemo(() => {
    const name = user?.displayName ?? user?.email ?? "";
    const trimmed = name.trim();
    if (!trimmed) return "?";
    return trimmed[0]?.toUpperCase() ?? "?";
  }, [user?.displayName, user?.email]);

  async function onLogout() {
    setOpen(false);
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <header className="top-header">
      <div className="top-header-left">
        <h2 className="top-header-title">{title}</h2>
      </div>

      <div className="top-header-right">
        <div className="user-menu">
          <button
            type="button"
            className="user-avatar-btn"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            title="User menu"
          >
            <span className="user-avatar">{initial}</span>
          </button>

          {open ? (
            <div className="user-dropdown" role="menu" aria-label="User actions">
              <button type="button" className="user-dropdown-item" onClick={() => void onLogout()}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

