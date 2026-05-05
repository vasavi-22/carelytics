import { NavLink, Outlet } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/patients/P-1001", label: "Patient Details" },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="side-nav">
        <h1 className="brand-title">Carelytics</h1>
        <p className="brand-caption">B2B Healthcare Platform</p>
        <nav aria-label="Primary">
          <ul>
            {navLinks.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? "active-nav" : "")}
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
