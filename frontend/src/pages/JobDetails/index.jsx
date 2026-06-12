import {Component} from 'react'

import {apiRequest} from '../../services/api'

import './index.css'

class JobDetails extends Component {
  state = {
    jobDetails: null,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  applyForJob = async () => {
    const {jobDetails} = this.state

    const data = await apiRequest(
      '/api/applications/apply',
      {
        method: 'POST',
        body: JSON.stringify({
          jobId: jobDetails.id,
        }),
      },
    )

    alert(data.message)
  }

  saveJob = async () => {
    const {jobDetails} = this.state

    const data = await apiRequest(
      '/saved-jobs/save',
      {
        method: 'POST',
        body: JSON.stringify({
          jobId: jobDetails.id,
        }),
      },
    )

    alert(data.message)
  }

  getJobDetails = async () => {
    const currentUrl =
      window.location.pathname

    const id = currentUrl.split('/')[2]

    const data = await apiRequest(
      `/jobs/${id}`,
    )

    this.setState({
      jobDetails: data,
    })
  }

  getMatchClass = score => {
    if (score >= 80) {
      return 'high-match'
    }

    if (score >= 50) {
      return 'medium-match'
    }

    return 'low-match'
  }

  render() {
    const {jobDetails} = this.state

    const role =
      localStorage.getItem('role')

    if (!jobDetails) {
      return <h1>Loading...</h1>
    }

    return (
      <div className="job-details-container">
        <div className="job-details-page">
          <div className="job-details-card">
            {jobDetails.match_score >=
              80 && (
              <div className="recommended-badge">
                ⭐ Recommended For You
              </div>
            )}

            <div className="job-details-header">
              {jobDetails.company_logo && (
                <img
                  src={`http://localhost:5000${jobDetails.company_logo}`}
                  alt={
                    jobDetails.company
                  }
                  className="job-details-logo"
                />
              )}

              <div>
                <h1>
                  {jobDetails.title}
                </h1>

                <p>
                  {jobDetails.company}
                </p>
              </div>

              <div className="salary-badge">
                ₹
                {jobDetails.salary /
                  100000}{' '}
                LPA
              </div>
            </div>

            <div className="job-meta">
              <span>
                📍 {jobDetails.location}
              </span>

              <span>
                💼{' '}
                {
                  jobDetails.experience
                }
              </span>

              <span>
                🕒{' '}
                {jobDetails.job_type}
              </span>
            </div>

            <div
              className={`match-score ${this.getMatchClass(
                jobDetails.match_score,
              )}`}
            >
              Match Score:{' '}
              {
                jobDetails.match_score
              }
              %
            </div>

            <div className="section">
              <h2>
                AI Resume Match
              </h2>

              <h4>
                Matched Skills
              </h4>

              <div className="skills-container">
                {jobDetails.matched_skills?.map(
                  skill => (
                    <span
                      key={skill}
                      className="matched-skill"
                    >
                      ✓ {skill}
                    </span>
                  ),
                )}
              </div>

              <h4>
                Missing Skills
              </h4>

              <div className="skills-container">
                {jobDetails
                  .missing_skills
                  ?.length > 0 ? (
                  jobDetails.missing_skills.map(
                    skill => (
                      <span
                        key={skill}
                        className="missing-skill"
                      >
                        ✗ {skill}
                      </span>
                    ),
                  )
                ) : (
                  <span className="matched-skill">
                    None 🎉
                  </span>
                )}
              </div>
            </div>

            <div className="section">
              <h2>
                Job Description
              </h2>

              <p>
                {
                  jobDetails.description
                }
              </p>
            </div>

            <div className="section">
              <h2>
                Required Skills
              </h2>

              <div className="skills-container">
                {jobDetails.skills
                  ?.split(',')
                  .map(skill => (
                    <span
                      key={skill}
                      className="skill-tag"
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </div>

            {role ===
              'jobseeker' && (
              <div className="action-buttons">
                <button
                  type="button"
                  className="apply-btn"
                  onClick={
                    this.applyForJob
                  }
                >
                  Apply Job
                </button>

                <button
                  type="button"
                  className="save-btn"
                  onClick={
                    this.saveJob
                  }
                >
                  Save Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default JobDetails