import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="CampusConnect home">
          <span className="brand-mark">C</span>
          <span>CampusConnect</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/jobs">Explore Jobs</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user && <NavLink to="/applications">Applications</NavLink>}
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-greeting">Hi, {user.name?.split(" ")[0]}</span>
              <button className="button button-outline button-small" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="button button-outline button-small" to="/login">Log in</Link>
              <Link className="button button-primary button-small" to="/register">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
