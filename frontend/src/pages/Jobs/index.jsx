import {Component} from 'react'

import JobCard from '../../components/JobCard'

import {apiRequest} from '../../services/api'

import './index.css'

class Jobs extends Component {
  state = {
    jobsList: [],
    search: '',
    jobType: '',
    experience: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const {
      search,
      jobType,
      experience,
    } = this.state

    let url = '/jobs?'

    if (search) {
      url += `search=${search}&`
    }

    if (jobType) {
      url += `job_type=${jobType}&`
    }

    if (experience) {
      url += `experience=${experience}&`
    }

    const data = await apiRequest(url)

    if (Array.isArray(data)) {
      this.setState({
        jobsList: data,
      })
    } else {
      this.setState({
        jobsList: [],
      })
      if (data && (data.message === 'Invalid token' || data.message === 'No token provided')) {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('role')
        window.location.href = '/login'
      }
    }
  }

  onSearchChange = event => {
    this.setState(
      {
        search: event.target.value,
      },
      this.getJobs,
    )
  }

  onJobTypeChange = event => {
    this.setState(
      {
        jobType: event.target.value,
      },
      this.getJobs,
    )
  }

  onExperienceChange = event => {
    this.setState(
      {
        experience: event.target.value,
      },
      this.getJobs,
    )
  }

  clearFilters = () => {
    this.setState(
      {
        search: '',
        jobType: '',
        experience: '',
      },
      this.getJobs,
    )
  }

  render() {
    const {
      jobsList,
      search,
      jobType,
      experience,
    } = this.state

    const recommendedJobs =
      jobsList.filter(
        eachJob =>
          eachJob.match_score >= 50,
      )

    return (
      <div className="jobs-page">
        <div className="jobs-header">
          <h1>
            Find Your Dream Job 🚀
          </h1>

          <p>
            Explore opportunities from
            top companies around the
            world.
          </p>
        </div>

        <div className="search-filter-card">
          <input
            type="text"
            placeholder="Search by title, company or location"
            value={search}
            onChange={
              this.onSearchChange
            }
          />

          <select
            value={jobType}
            onChange={
              this.onJobTypeChange
            }
          >
            <option value="">
              All Job Types
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

          <select
            value={experience}
            onChange={
              this.onExperienceChange
            }
          >
            <option value="">
              All Experience
            </option>

            <option value="0-1 Years">
              0-1 Years
            </option>

            <option value="1-2">
              1-2 Years
            </option>

            <option value="2-5">
              2-5 Years
            </option>
          </select>

          <button
            type="button"
            onClick={this.getJobs}
          >
            Search
          </button>

          <button
            type="button"
            onClick={this.clearFilters}
          >
            Clear
          </button>
        </div>

        {recommendedJobs.length > 0 && (
          <>
            <h2 className="section-title">
              🔥 Recommended For You
            </h2>

            <div className="jobs-container">
              {recommendedJobs.map(
                eachJob => (
                  <JobCard
                    key={eachJob.id}
                    jobDetails={eachJob}
                  />
                ),
              )}
            </div>
          </>
        )}

        <h2 className="section-title">
          All Jobs
        </h2>

        <div className="jobs-container">
          {jobsList.map(eachJob => (
            <JobCard
              key={eachJob.id}
              jobDetails={eachJob}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default Jobs