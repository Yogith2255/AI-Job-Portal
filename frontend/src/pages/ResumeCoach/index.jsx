import {Component} from 'react'
import {Link} from 'react-router-dom'
import {apiRequest} from '../../services/api'
import './index.css'

class ResumeCoach extends Component {
  state = {
    loading: false,
    feedback: null,
    error: '',
    profile: null,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    try {
      const data = await apiRequest('/profile')
      if (data && !data.message) {
        this.setState({ profile: data })
        if (data.resume_text) {
          this.getCoachingFeedback()
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  getCoachingFeedback = async () => {
    this.setState({ loading: true, error: '' })
    try {
      const data = await apiRequest('/chatbot/coaching', {
        method: 'POST',
      })
      if (data && data.error) {
        this.setState({ error: data.error, loading: false })
      } else {
        this.setState({ feedback: data, loading: false })
      }
    } catch (err) {
      this.setState({ error: 'Failed to retrieve coaching feedback.', loading: false })
    }
  }

  render() {
    const {loading, feedback, error, profile} = this.state
    const hasResume = profile && profile.resume_text

    return (
      <div className="coach-page">
        <div className="coach-container">
          <div className="coach-header">
            <h1>AI Resume Coach 🎯</h1>
            <p>Get instant ATS scores, identify formatting issues, and discover critical skills to matching open roles.</p>
          </div>

          {!hasResume ? (
            <div className="no-resume-card">
              <h3>No Resume Uploaded</h3>
              <p>Please upload your PDF resume on the Profile page to get customized ATS score analyses and career coach insights.</p>
              <Link to="/profile">
                <button type="button" className="action-btn">Go to Profile</button>
              </Link>
            </div>
          ) : (
            <>
              {loading && (
                <div className="coach-loading-card">
                  <div className="spinner"></div>
                  <h3>Analyzing Resume with Gemini AI...</h3>
                  <p>Comparing your resume structure and skills alignment against current market listings.</p>
                </div>
              )}

              {error && (
                <div className="coach-error-card">
                  <p>⚠️ {error}</p>
                  <button type="button" onClick={this.getCoachingFeedback} className="action-btn">Retry Analysis</button>
                </div>
              )}

              {!loading && feedback && (
                <div className="coach-dashboard">
                  <div className="ats-score-card">
                    <div className="ats-score-circle" style={{ '--score-degree': `${(feedback.ats_score || 70) * 3.6}deg` }}>
                      <div className="ats-score-inner">
                        <span className="score-val">{feedback.ats_score || 0}</span>
                        <span className="score-label">ATS Score</span>
                      </div>
                    </div>
                    <div className="ats-score-desc">
                      <h3>{feedback.ats_score >= 80 ? 'Excellent Match!' : feedback.ats_score >= 60 ? 'Good Potential' : 'Needs Optimization'}</h3>
                      <p>Your resume matches {feedback.ats_score || 0}% of ATS guidelines and keywords in our database.</p>
                      <button type="button" onClick={this.getCoachingFeedback} className="refresh-btn">Re-Analyze</button>
                    </div>
                  </div>

                  <div className="coach-details-grid">
                    <div className="details-card strengths-card">
                      <h3>✔️ Key Strengths</h3>
                      <ul>
                        {feedback.strengths && feedback.strengths.map((str, idx) => (
                          <li key={idx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="details-card improvements-card">
                      <h3>⚠️ Areas for Improvement</h3>
                      <ul>
                        {feedback.improvements && feedback.improvements.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="details-card skills-match-card">
                      <h3>🚀 Recommended Skills for Active Jobs</h3>
                      <ul>
                        {feedback.missing_skills_for_jobs && feedback.missing_skills_for_jobs.map((skill, idx) => (
                          <li key={idx}>{skill}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="details-card roadmap-card">
                      <h3>🗺️ AI Career Roadmap & Tips</h3>
                      <ul>
                        {feedback.roadmap_tips && feedback.roadmap_tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }
}

export default ResumeCoach
