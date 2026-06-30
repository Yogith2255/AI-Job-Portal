import {Component} from 'react'
import {Link} from 'react-router-dom'

import {apiRequest} from '../../services/api'
import {BASE_URL} from '../../constants'

import './index.css'

class SavedJobs extends Component {
  state = {
    savedJobsList: [],
  }

  componentDidMount() {
    this.getSavedJobs()
  }

  getSavedJobs = async () => {
    const data = await apiRequest('/saved-jobs')

    if (Array.isArray(data)) {
      this.setState({
        savedJobsList: data,
      })
    } else {
      this.setState({
        savedJobsList: [],
      })
      if (data && (data.message === 'Invalid token' || data.message === 'No token provided')) {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('role')
        window.location.href = '/login'
      }
    }
  }

  removeSavedJob = async id => {
    const data = await apiRequest(
      `/saved-jobs/${id}`,
      {
        method: 'DELETE',
      },
    )

    alert(data.message)

    this.getSavedJobs()
  }

  renderSavedJobs = () => {
    const {savedJobsList} = this.state

    if (savedJobsList.length === 0) {
      return <h2>No Saved Jobs Found</h2>
    }

    return savedJobsList.map(job => (
      <div
        key={job.id}
        className="saved-job-card"
      >
        <div className="saved-job-company">
          <img
            src={
              job.company_logo
                ? `${BASE_URL}${job.company_logo}`
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }
            alt={job.company}
            className="saved-job-logo"
          />

          <div>
            <h3>{job.title}</h3>

            <p>{job.company}</p>
          </div>
        </div>

        <div className="saved-job-info">
          <p>📍 {job.location}</p>

          <p>💼 {job.experience}</p>

          <p>🕒 {job.job_type}</p>

          <p>💰 ₹{job.salary}</p>
        </div>

        <div className="saved-job-actions">
          <Link to={`/jobs/${job.id}`}>
            <button type="button">
              View Details
            </button>
          </Link>

          <button
            type="button"
            onClick={() =>
  this.removeSavedJob(job.saved_id)
}
          >
            Remove
          </button>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className="saved-jobs-page">
        <h1>Saved Jobs</h1>

        {this.renderSavedJobs()}
      </div>
    )
  }
}

export default SavedJobs