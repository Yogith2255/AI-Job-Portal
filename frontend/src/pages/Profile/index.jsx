import {Component} from 'react'

import {apiRequest} from '../../services/api'

import './index.css'

class Profile extends Component {
  state = {
    profile: null,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
  try {
    const data = await apiRequest(
      '/api/auth/profile',
    )

    console.log('PROFILE DATA:', data)

    this.setState({
      profile: data,
    })
  } catch (error) {
    console.error(error)
  }
}

  uploadProfileImage = async event => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const formData = new FormData()

    formData.append('image', file)

    const token =
      localStorage.getItem('jwt_token')

    const response = await fetch(
      'http://localhost:5000/api/profile/upload-image',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    )

    const data = await response.json()

    alert(data.message)

    this.getProfile()
  }

  uploadResume = async event => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const formData = new FormData()

    formData.append('resume', file)

    const token =
      localStorage.getItem('jwt_token')

    const response = await fetch(
      'http://localhost:5000/api/profile/upload-resume',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    )

    const data = await response.json()

    alert(data.message)

    this.getProfile()
  }

  render() {
    const {profile} = this.state

    if (!profile) {
      return <h1>Loading...</h1>
    }

    return (
      <div className="profile-page">
        <div className="profile-card">
          <img
            src={
              profile.profile_image
                ? `http://localhost:5000${profile.profile_image}`
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            }
            alt="Profile"
            className="profile-image"
          />

          <h1>{profile.name}</h1>

          <p className="profile-role">
            {profile.role}
          </p>

          <div className="profile-info">
            <p>
              <strong>Email:</strong>{' '}
              {profile.email}
            </p>

            <p>
              <strong>Joined:</strong>{' '}
              {profile.created_at}
            </p>
          </div>

          <div className="profile-actions">
            <label className="upload-btn">
              Upload Profile Picture

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={
                  this.uploadProfileImage
                }
              />
            </label>

            <label className="upload-btn">
              Upload Resume

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={this.uploadResume}
              />
            </label>

            {profile.resume_url && (
              <a
                href={`http://localhost:5000${profile.resume_url}`}
                target="_blank"
                rel="noreferrer"
                className="resume-btn"
              >
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Profile