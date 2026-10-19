import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault(); setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters long."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      await apiRequest("/auth/register", { method: "POST", body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password }) });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <main className="auth-layout"><section className="auth-aside register-aside"><div className="auth-aside-content"><p className="eyebrow eyebrow-light">MAKE YOUR MOVE</p><h1>A clearer path from learning to opportunity.</h1><p>Create your student account and bring your placement journey together.</p><div className="aside-stat-row"><div><strong>01</strong><span>Create a profile</span></div><div><strong>02</strong><span>Explore roles</span></div><div><strong>03</strong><span>Track progress</span></div></div></div></section><section className="auth-main"><form className="auth-form" onSubmit={handleSubmit}><p className="eyebrow">GET STARTED</p><h2>Create your account</h2><p className="auth-description">A few details and you’re ready to begin.</p><label htmlFor="name">Full name</label><input id="name" autoComplete="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" minLength="6" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" type="password" autoComplete="new-password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" />{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary button-large button-stretch" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button><p className="form-switch">Already registered? <Link to="/login">Log in</Link></p></form></section></main>;
}
