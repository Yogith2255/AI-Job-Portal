import {Component} from 'react'
import {Navigate} from 'react-router-dom'

import {apiRequest} from '../../services/api'
import './index.css'

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMsg: '',
    isLoggedIn: false,
    role: '',
  }

  onChangeEmail = event => {
    this.setState({
      email: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {email, password} = this.state

    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (data.token) {
      localStorage.setItem('jwt_token', data.token)
      localStorage.setItem('role', data.user.role)

      this.setState({
        isLoggedIn: true,
        role: data.user.role,
      })
    } else {
      this.setState({
        errorMsg: data.message,
      })
    }
  }

  render() {
    const {
      email,
      password,
      errorMsg,
      isLoggedIn,
      role,
    } = this.state

    if (isLoggedIn) {
      if (role === 'recruiter') {
        return <Navigate to="/dashboard" replace />
      }

      return <Navigate to="/jobs" replace />
    }

    return (
  <div className="login-page">
    <div className="login-card">
      <h1 className="login-title">
        Welcome Back 👋
      </h1>

      <p className="login-subtitle">
        Login to continue your journey
      </p>

      <form
        className="login-form"
        onSubmit={this.onSubmitForm}
      >
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
            placeholder="Enter your password"
          />
        </div>

        <button
          className="login-btn"
          type="submit"
        >
          Login
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

export default Login