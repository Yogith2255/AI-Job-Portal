import {Component} from 'react'

import {apiRequest} from '../../services/api'

import './index.css'

class AppliedJobs extends Component {
  state = {
    applicationsList: [],
  }

  componentDidMount() {
    this.getAppliedJobs()
  }

  getAppliedJobs = async () => {
    const data = await apiRequest(
      '/api/applications/my-applications',
    )

    this.setState({
      applicationsList: data,
    })
  }

  renderApplications = () => {
    const {applicationsList} = this.state

    if (applicationsList.length === 0) {
      return <h2>No Applications Found</h2>
    }

    return applicationsList.map(application => (
      <div
        key={application.id}
        className="applied-job-card"
      >
        <div className="applied-job-company">
          <img
            src={
              application.company_logo
                ? `http://localhost:5000${application.company_logo}`
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }
            alt={application.company}
            className="applied-job-logo"
          />

          <div>
            <h3>{application.title}</h3>

            <p>{application.company}</p>
          </div>
        </div>

        <div className="applied-job-info">
          <p>📍 {application.location}</p>

          <p>💼 {application.experience}</p>

          <p>🕒 {application.job_type}</p>

          <p>💰 ₹{application.salary}</p>
        </div>

        <div className="status-badge">
          {application.status}
        </div>

        <p className="applied-date">
          Applied On: {application.applied_at}
        </p>
      </div>
    ))
  }

  render() {
    return (
      <div className="applied-jobs-page">
        <h1>Applied Jobs</h1>

        {this.renderApplications()}
      </div>
    )
  }
}

export default AppliedJobs