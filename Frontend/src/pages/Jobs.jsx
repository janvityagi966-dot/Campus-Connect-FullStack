import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [applyingId, setApplyingId] = useState("");
  const [query, setQuery] = useState("");

  async function loadJobs() {
    setLoading(true); setError("");
    try { setJobs(await apiRequest("/jobs")); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadJobs(); }, []);

  async function apply(jobId) {
    if (!user) { setNotice("Please log in to apply for a job."); return; }
    setNotice(""); setApplyingId(jobId);
    try {
      const data = await apiRequest("/applications", { method: "POST", body: JSON.stringify({ job: jobId }) });
      setNotice(data.message || "Application submitted successfully.");
    } catch (err) { setNotice(err.message); }
    finally { setApplyingId(""); }
  }

  const filteredJobs = jobs.filter(job => `${job.title} ${job.company} ${job.location} ${(job.skills || []).join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  return <main className="page-shell container"><div className="page-heading"><div><p className="eyebrow">FIND YOUR NEXT STEP</p><h1>Explore opportunities<span>.</span></h1><p>Find a role that matches your interests and growing skills.</p></div><div className="job-count"><strong>{jobs.length.toString().padStart(2, "0")}</strong><span>opportunities</span></div></div><div className="search-row"><span className="search-icon">⌕</span><input aria-label="Search jobs" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by role, company, location, or skill" /></div>{notice && <div className="notice" role="status">{notice}{notice.includes("log in") && <Link to="/login"> Log in →</Link>}</div>}{loading ? <div className="state-card">Loading opportunities…</div> : error ? <div className="state-card"><p>{error}</p><button className="button button-outline" onClick={loadJobs}>Try again</button></div> : filteredJobs.length === 0 ? <div className="state-card">No roles match this search. Try a different keyword.</div> : <div className="job-grid">{filteredJobs.map((job, i) => <article className="job-listing" key={job._id}><div className="job-card-meta"><span className="company-avatar">{(job.company || "C").slice(0, 1).toUpperCase()}</span><span className="job-type">{job.type || (i % 2 === 0 ? "INTERNSHIP" : "ENTRY LEVEL")}</span></div><h2>{job.title}</h2><p className="job-company">{job.company}</p><div className="job-facts"><span>⌖ {job.location}</span>{job.salary && <span>↗ {job.salary}</span>}</div><p className="job-description">{job.description}</p><div className="skill-list">{(job.skills || []).map(skill => <span key={skill}>{skill}</span>)}</div><div className="job-card-bottom"><span className="posted-label">Opportunity #{String(i + 1).padStart(2, "0")}</span><button className="button button-primary" onClick={() => apply(job._id)} disabled={applyingId === job._id}>{applyingId === job._id ? "Applying…" : "Apply now →"}</button></div></article>)}</div>}<p className="page-footnote">Sample listings are provided for demo purposes. Verify opportunities before applying outside this project.</p></main>;
}
