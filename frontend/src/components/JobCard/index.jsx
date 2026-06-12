import {Link} from 'react-router-dom'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    id,
    title,
    company,
    company_logo,
    location,
    salary,
    experience,
    job_type,
    match_score,
    matched_skills,
    missing_skills,
  } = jobDetails

  const role = localStorage.getItem('role')

  const formattedSalary =
    salary > 0
      ? `${salary / 100000} LPA`
      : 'Not Disclosed'

  const getMatchClass = () => {
    if (match_score >= 80) {
      return 'high-match'
    }

    if (match_score >= 50) {
      return 'medium-match'
    }

    return 'low-match'
  }

  return (
    <div className="job-card">
      <div className="job-header">
        <div className="job-company">
          {company_logo && (
            <img
              src={`http://localhost:5000${company_logo}`}
              alt={company}
              className="company-logo"
            />
          )}

          <div>
            <h2 className="job-title">
              {title}
            </h2>

            <p className="company-name">
              {company}
            </p>
          </div>
        </div>

        <span className="salary-badge">
          ₹{formattedSalary}
        </span>
      </div>

      <div className="job-info">
        <p>📍 {location}</p>

        <p>💼 {experience}</p>

        <p>🕒 {job_type}</p>
      </div>

      {role === 'jobseeker' && (
        <>
          <div
            className={`match-score ${getMatchClass()}`}
          >
            Match Score:{' '}
            {match_score || 0}%
          </div>

          <div className="skills-section">
            <h4>Matched Skills</h4>

            {matched_skills &&
            matched_skills.length > 0 ? (
              <div className="skills-list">
                {matched_skills.map(
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
            ) : (
              <p className="no-skills">
                No matched skills
              </p>
            )}
          </div>

          <div className="skills-section">
            <h4>Missing Skills</h4>

            {missing_skills &&
            missing_skills.length > 0 ? (
              <div className="skills-list">
                {missing_skills.map(
                  skill => (
                    <span
                      key={skill}
                      className="missing-skill"
                    >
                      ✗ {skill}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="no-skills">
                None 🎉
              </p>
            )}
          </div>
        </>
      )}

      <Link to={`/jobs/${id}`}>
        <button
          type="button"
          className="details-btn"
        >
          View Details
        </button>
      </Link>
    </div>
  )
}

export default JobCard