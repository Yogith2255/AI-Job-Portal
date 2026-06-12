import {Component} from 'react'
import {Navigate} from 'react-router-dom'

import {apiRequest} from '../../services/api'
import './index.css'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    role: 'jobseeker',
    successMsg: '',
    errorMsg: '',
    isRegistered: false,
  }

  onChangeName = event => {
    this.setState({name: event.target.value})
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeRole = event => {
    this.setState({role: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {name, email, password, role} = this.state

    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    })

    if (data.userId) {
      this.setState({
        successMsg: 'Registration Successful',
        isRegistered: true,
      })
    } else {
      this.setState({
        errorMsg: data.message,
      })
    }
  }

  render() {
    const {
      name,
      email,
      password,
      role,
      errorMsg,
      isRegistered,
    } = this.state

    if (isRegistered) {
      return <Navigate to="/login" replace />
    }

    return (
  <div className="register-page">
    <div className="register-card">
      <h1 className="register-title">
        Create Account 🚀
      </h1>

      <p className="register-subtitle">
        Join thousands of job seekers and recruiters
      </p>

      <form
        className="register-form"
        onSubmit={this.onSubmitForm}
      >
        <div className="input-group">
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={this.onChangeName}
            placeholder="Enter your name"
          />
        </div>

        <div className="input-group">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={this.onChangeEmail}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Create a password"
          />
        </div>

        <div className="input-group">
          <label>Role</label>

          <select
            value={role}
            onChange={this.onChangeRole}
          >
            <option value="jobseeker">
              Job Seeker
            </option>

            <option value="recruiter">
              Recruiter
            </option>
          </select>
        </div>

        <button
          className="register-btn"
          type="submit"
        >
          Create Account
        </button>

        {errorMsg && (
          <p className="error-msg">
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  </div>
)
  }
}

export default Register