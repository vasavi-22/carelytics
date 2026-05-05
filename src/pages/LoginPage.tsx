import { Link } from "react-router-dom";

export function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome to Carelytics</h1>
        <p>Sign in to access healthcare operations and insights.</p>
        <form className="auth-form">
          <label>
            Work Email
            <input type="email" placeholder="you@hospital.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Enter your password" />
          </label>
          <button type="button">Login</button>
        </form>
        <p className="auth-helper">
          Prototype navigation: <Link to="/">Continue to Dashboard</Link>
        </p>
      </div>
    </section>
  );
}
