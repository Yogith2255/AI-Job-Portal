import {Component} from 'react'

import {apiRequest} from '../../services/api'

import './index.css'

class CreateJob extends Component {
  state = {
    title: '',
    company: '',
    companyLogo: '',
    location: '',
    salary: '',
    description: '',
    skills: '',
    experience: '',
    jobType: '',
  }

  uploadLogo = async event => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const formData = new FormData()

    formData.append('logo', file)

    const data = await apiRequest(
      '/api/upload/logo',
      {
        method: 'POST',
        body: formData,
      },
    )

    if (data.imageUrl) {
      this.setState({
        companyLogo: data.imageUrl,
      })
    } else {
      alert(
        data.message || 'Logo upload failed',
      )
    }
  }

  createJob = async event => {
    event.preventDefault()

    const {
      title,
      company,
      companyLogo,
      location,
      salary,
      description,
      skills,
      experience,
      jobType,
    } = this.state

    const data = await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        title,
        company,
        company_logo: companyLogo,
        location,
        salary,
        description,
        skills,
        experience,
        job_type: jobType,
      }),
    })

    alert(data.message)

    this.setState({
      title: '',
      company: '',
      companyLogo: '',
      location: '',
      salary: '',
      description: '',
      skills: '',
      experience: '',
      jobType: '',
    })
  }

  render() {
    const {
      title,
      company,
      companyLogo,
      location,
      salary,
      description,
      skills,
      experience,
      jobType,
    } = this.state

    return (
      <div className="create-job-page">
        <div className="create-job-card">
          <h1>Create New Job 🚀</h1>

          <form
            className="create-job-form"
            onSubmit={this.createJob}
          >
            <div className="form-group">
              <label>Job Title</label>

              <input
                placeholder="Enter job title"
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
                placeholder="Enter company name"
                value={company}
                onChange={e =>
                  this.setState({
                    company: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Company Logo</label>

              <input
                type="file"
                accept="image/*"
                onChange={this.uploadLogo}
              />

              {companyLogo && (
                <p>
                  ✅ Logo uploaded successfully
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                placeholder="Enter job location"
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
                placeholder="Enter annual salary"
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
                placeholder="React, Node.js, SQL"
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
                placeholder="0-1 Years"
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
                value={jobType}
                onChange={e =>
                  this.setState({
                    jobType: e.target.value,
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
                placeholder="Enter detailed job description"
                value={description}
                onChange={e =>
                  this.setState({
                    description: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="create-job-btn"
              type="submit"
            >
              Create Job
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default CreateJob