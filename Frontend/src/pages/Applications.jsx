import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api.js";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest("/applications/mine").then(setApplications).catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  return <main className="page-shell container"><div className="page-heading"><div><p className="eyebrow">YOUR PLACEMENT JOURNEY</p><h1>Application tracker<span>.</span></h1><p>Keep an eye on the opportunities you’ve applied for.</p></div><Link className="button button-primary" to="/jobs">Find more jobs →</Link></div>{loading ? <div className="state-card">Loading applications…</div> : error ? <div className="state-card"><p>{error}</p><button className="button button-outline" onClick={() => window.location.reload()}>Try again</button></div> : applications.length === 0 ? <div className="empty-large"><div className="empty-illustration">↗</div><h2>Your tracker starts with one application.</h2><p>Once you apply for a role, its status will show up here.</p><Link className="button button-primary" to="/jobs">Explore opportunities</Link></div> : <div className="tracker-list">{applications.map(app => <article className="tracker-card" key={app._id}><div className="company-avatar">{(app.job?.company || "C").slice(0, 1)}</div><div className="tracker-main"><h2>{app.job?.title || "Job opportunity"}</h2><p>{app.job?.company || "Company"} · {app.job?.location || "Location not provided"}</p><small>Applied {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "recently"}</small></div><span className="status-badge">{app.status}</span></article>)}</div>}<p className="page-footnote">Application status is demo-managed in this version; employers do not update it automatically.</p></main>;
}
