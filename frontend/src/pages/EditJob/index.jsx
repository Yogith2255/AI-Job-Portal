import {Component} from 'react'

import {apiRequest} from '../../services/api'

import './index.css'

class EditJob extends Component {
  state = {
    title: '',
    company: '',
    company_logo: '',
    location: '',
    salary: '',
    description: '',
    skills: '',
    experience: '',
    job_type: '',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jobId = window.location.pathname.split('/')[2]

    const data = await apiRequest(`/api/jobs/${jobId}`)

    this.setState({
      title: data.title,
      company: data.company,
      company_logo: data.company_logo,
      location: data.location,
      salary: data.salary,
      description: data.description,
      skills: data.skills,
      experience: data.experience,
      job_type: data.job_type,
    })
  }

  uploadLogo = async event => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const formData = new FormData()

    formData.append('logo', file)

    const response = await apiRequest(
      '/upload/logo',
      {
        method: 'POST',
        body: formData,
      },
    )

    if (response.logoUrl) {
      this.setState({
        company_logo: response.logoUrl,
      })

      alert('Logo uploaded successfully')
    } else {
      alert('Logo upload failed')
    }
  }

  updateJob = async event => {
    event.preventDefault()

    const jobId = window.location.pathname.split('/')[2]

    const {
      title,
      company,
      company_logo,
      location,
      salary,
      description,
      skills,
      experience,
      job_type,
    } = this.state

    const response = await apiRequest(
      `/jobs/${jobId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          title,
          company,
          company_logo,
          location,
          salary,
          description,
          skills,
          experience,
          job_type,
        }),
      },
    )

    alert(response.message)

    window.location.href = '/my-jobs'
  }

  render() {
    const {
      title,
      company,
      company_logo,
      location,
      salary,
      description,
      skills,
      experience,
      job_type,
    } = this.state

    return (
      <div className="edit-job-page">
        <div className="edit-job-card">
          <h1>Edit Job ✏️</h1>

          <form
            className="edit-job-form"
            onSubmit={this.updateJob}
          >
            <div className="form-group">
              <label>Job Title</label>

              <input
                value={title}
                onChange={e =>
                  this.setState({
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>

              <input
                value={company}
                onChange={e =>
                  this.setState({
                    company: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                value={location}
                onChange={e =>
                  this.setState({
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Annual Salary (₹)</label>

              <input
                value={salary}
                onChange={e =>
                  this.setState({
                    salary: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Required Skills</label>

              <input
                value={skills}
                onChange={e =>
                  this.setState({
                    skills: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Required Experience</label>

              <input
                value={experience}
                onChange={e =>
                  this.setState({
                    experience: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Job Type</label>

              <select
                value={job_type}
                onChange={e =>
                  this.setState({
                    job_type: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Job Type
                </option>

                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Remote">
                  Remote
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>Job Description</label>

              <textarea
                rows="6"
                value={description}
                onChange={e =>
                  this.setState({
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Current Company Logo</label>

              <img
                src={
                  company_logo
                    ? `http://localhost:5000${company_logo}`
                    : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                }
                alt="Company Logo"
                className="edit-job-logo"
              />

              <input
                type="file"
                accept="image/*"
                onChange={this.uploadLogo}
              />
            </div>

            <button
              className="edit-job-btn"
              type="submit"
            >
              Update Job
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default EditJob