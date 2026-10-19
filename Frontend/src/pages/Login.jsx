import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <main className="auth-layout"><section className="auth-aside"><div className="auth-aside-content"><p className="eyebrow eyebrow-light">WELCOME BACK</p><h1>Your next opportunity is closer than you think.</h1><p>Sign in to pick up where you left off and keep your placement plans moving.</p><div className="aside-decoration"><span>✦</span><span>↗</span><span>◎</span></div></div></section><section className="auth-main"><form className="auth-form" onSubmit={handleSubmit}><p className="eyebrow">STUDENT ACCOUNT</p><h2>Log in</h2><p className="auth-description">Enter your account details to continue.</p><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-large button-stretch" disabled={busy}>{busy ? "Logging in…" : "Log in to your account"}</button><p className="form-switch">New to CampusConnect? <Link to="/register">Create an account</Link></p><p className="demo-hint">Your account is saved. Log in with the same email and password next time.</p></form></section></main>;
}
