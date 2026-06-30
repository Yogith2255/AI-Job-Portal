import {Link} from 'react-router-dom'
import {BASE_URL} from '../../constants'

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
      ? `₹${(salary / 100000).toFixed(1)} LPA`
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
      <div className="job-card-header">
        <div className="job-company-info">
          {company_logo ? (
            <img
              src={`${BASE_URL}${company_logo}`}
              alt={company}
              className="company-logo"
            />
          ) : (
            <div className="company-logo-fallback">
              {company ? company.charAt(0).toUpperCase() : 'J'}
            </div>
          )}

          <div className="title-and-company">
            <h2 className="job-title">{title}</h2>
            <p className="company-name">{company}</p>
          </div>
        </div>

        <span className="salary-tag">{formattedSalary}</span>
      </div>

      <div className="job-meta-pills">
        <span className="meta-pill">📍 {location}</span>
        <span className="meta-pill">💼 {experience}</span>
        <span className="meta-pill">🕒 {job_type}</span>
      </div>

      {role === 'jobseeker' && (
        <div className="ats-match-section">
          <div className="match-score-header">
            <span className="match-score-title">ATS Match Profile</span>
            <span className={`match-score-percent ${getMatchClass()}-text`}>
              {match_score || 0}%
            </span>
          </div>

          <div className="match-score-bar-bg">
            <div
              className={`match-score-bar-fill ${getMatchClass()}`}
              style={{width: `${match_score || 0}%`}}
            />
          </div>

          <div className="skills-match-grid">
            <div className="skills-subset">
              <h5>Matched Skills</h5>
              {matched_skills && matched_skills.length > 0 ? (
                <div className="skills-pill-group">
                  {matched_skills.slice(0, 4).map(skill => (
                    <span key={skill} className="pill-skill pill-matched">
                      {skill}
                    </span>
                  ))}
                  {matched_skills.length > 4 && (
                    <span className="pill-skill pill-more">
                      +{matched_skills.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="no-skills-msg">None matched</p>
              )}
            </div>

            <div className="skills-subset">
              <h5>Missing Skills</h5>
              {missing_skills && missing_skills.length > 0 ? (
                <div className="skills-pill-group">
                  {missing_skills.slice(0, 4).map(skill => (
                    <span key={skill} className="pill-skill pill-missing">
                      {skill}
                    </span>
                  ))}
                  {missing_skills.length > 4 && (
                    <span className="pill-skill pill-more">
                      +{missing_skills.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <p className="no-skills-msg">None missing 🎉</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="job-card-actions">
        <Link to={`/jobs/${id}`} className="view-details-link">
          <button type="button" className="details-btn">
            View Details & Apply
          </button>
        </Link>
      </div>
    </div>
  )
}

export default JobCard