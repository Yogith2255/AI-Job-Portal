import {Link, useNavigate} from 'react-router-dom'

import './index.css'

const Navbar = () => {
  const navigate = useNavigate()

  const token = localStorage.getItem('jwt_token')
  const role = localStorage.getItem('role')

  const onLogout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('role')

    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">JobPortal</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/jobs">Jobs</Link>

            {role === 'jobseeker' && (
              <>
                <Link to="/saved-jobs">Saved Jobs</Link>
                <Link to="/applied-jobs">Applied Jobs</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/chatbot">Chatbot</Link>
              </>
            )}

            {role === 'recruiter' && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/my-jobs">My Jobs</Link>
                <Link to="/create-job">Create Job</Link>
              </>
            )}
          </>
        )}
      </div>

      {token && (
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>
      )}
    </nav>
  )
}

export default Navbar