import {Component} from 'react'
import {Link} from 'react-router-dom'

import {apiRequest} from '../../services/api'

import './index.css'

class MyJobs extends Component {
  state = {
    jobsList: [],
  }

  componentDidMount() {
    this.getMyJobs()
  }

  getMyJobs = async () => {
    const data = await apiRequest('/jobs/my-jobs')

    this.setState({
      jobsList: data,
    })
  }

  deleteJob = async id => {
    const data = await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    })

    alert(data.message)

    this.getMyJobs()
  }

  renderJobs = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return <h2>No Jobs Created Yet</h2>
    }

    return jobsList.map(job => (
      <div
        key={job.id}
        className="my-job-card"
      >
        <div className="my-job-header">
          <div className="my-job-company">
            <img
  src={
    job.company_logo
      ? `http://localhost:5000${job.company_logo}`
      : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  }
  alt={job.company}
  className="my-job-logo"
/>

            <div>
              <h3>{job.title}</h3>

              <p>{job.company}</p>
            </div>
          </div>
        </div>

        <div className="my-job-info">
          <p>📍 {job.location}</p>

          <p>💰 ₹{job.salary}</p>
        </div>

        <div className="my-job-actions">
          <Link to={`/jobs/${job.id}`}>
            <button type="button">
              View
            </button>
          </Link>

          <Link to={`/edit-job/${job.id}`}>
            <button type="button">
              Edit
            </button>
          </Link>

          <button
            type="button"
            onClick={() =>
              this.deleteJob(job.id)
            }
          >
            Delete
          </button>

          <Link
            to={`/applicants/${job.id}`}
          >
            <button type="button">
              Applicants
            </button>
          </Link>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className="my-jobs-page">
        <h1>My Jobs</h1>

        {this.renderJobs()}
      </div>
    )
  }
}

export default MyJobs