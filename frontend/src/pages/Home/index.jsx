import {Link, Navigate} from 'react-router-dom'
import "./index.css"

const Home = () => {
  const token = localStorage.getItem('jwt_token')
  const role = localStorage.getItem('role')

  

  return (
    <div className="home-container">
      <h1>JobPortal</h1>

<h2>Find Your Dream Job Today 🚀</h2>

      <p>
  Discover opportunities from top
  companies, track applications,
  save jobs, and manage recruitment
  all in one place.
</p>

      <div>
        <Link to="/login">
          <button type="button">
            Login
          </button>
        </Link>

        <Link to="/register">
          <button type="button">
            Register
          </button>
        </Link>
        <div className="stats-container">
  <div className="stat-card">
    <h2>10K+</h2>
    <p>Jobs Posted</p>
  </div>

  <div className="stat-card">
    <h2>500+</h2>
    <p>Companies</p>
  </div>

  <div className="stat-card">
    <h2>20K+</h2>
    <p>Applicants</p>
  </div>
</div>
      </div>

      <hr />

      <h2>Why Choose Us?</h2>

      <ul>
        <li>Easy Job Search</li>
        <li>Save Jobs</li>
        <li>Apply in One Click</li>
        <li>Recruiter Dashboard</li>
      </ul>

      <hr />

      <h2>For Job Seekers</h2>

      <ul>
        <li>Browse Jobs</li>
        <li>Save Jobs</li>
        <li>Track Applications</li>
      </ul>

      <hr />

      <h2>For Recruiters</h2>

      <ul>
        <li>Create Jobs</li>
        <li>Manage Applicants</li>
        <li>View Analytics</li>
      </ul>
    </div>
  )
}

export default Home