import {Component} from 'react'

import {apiRequest} from '../../services/api'
import {BASE_URL} from '../../constants'

import './index.css'

class Applicants extends Component {
  state = {
    applicantsList: [],
  }

  componentDidMount() {
    this.getApplicants()
  }

  getApplicants = async () => {
    const jobId =
      window.location.pathname.split('/')[2]

    const data = await apiRequest(
      `/applications/job-applicants/${jobId}`,
    )

    this.setState({
      applicantsList: data,
    })
  }

  updateStatus = async (
    applicationId,
    status,
  ) => {
    const response = await apiRequest(
      `/applications/status/${applicationId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          status,
        }),
      },
    )

    alert(response.message)

    this.getApplicants()
  }

  renderApplicants = () => {
    const {applicantsList} = this.state


    if (applicantsList.length === 0) {
      return (
        <h2 className="empty-message">
          No Applicants Yet
        </h2>
      )
    }

    return applicantsList.map(applicant => (
      <div
        key={applicant.id}
        className="applicant-card"
      >
        <div>
          <h3>{applicant.name}</h3>

<p>{applicant.email}</p>

{applicant.resume_url && (
  <a
  href={`${BASE_URL}${applicant.resume_url}`}
  target="_blank"
  rel="noreferrer"
  className="resume-btn"
>
  📄 Download Resume
</a>
)}

          <p>
            Applied:
            {' '}
            {applicant.applied_at}
          </p>
        </div>

        <div className="applicant-actions">
          <p>
            Status:
            {' '}
            <span
              className={`status-badge ${applicant.status.toLowerCase()}`}
            >
              {applicant.status}
            </span>
          </p>

          {applicant.status === 'Applied' && (
  <div className="action-buttons">
    <button
      type="button"
      className="accept-btn"
      onClick={() =>
        this.updateStatus(
          applicant.id,
          'Accepted',
        )
      }
    >
      Accept
    </button>

    <button
      type="button"
      className="reject-btn"
      onClick={() =>
        this.updateStatus(
          applicant.id,
          'Rejected',
        )
      }
    >
      Reject
    </button>
  </div>
)}
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className="applicants-page">
        <div className="applicants-header">
          <h1>Job Applicants 👨‍💻</h1>

          <p>
            View all candidates who
            applied for this job.
          </p>
        </div>

        <div className="applicants-container">
          {this.renderApplicants()}
        </div>
      </div>
    )
  }
}

export default Applicants