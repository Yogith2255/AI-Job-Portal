const db = require('../config/db')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

const getProfile = async (req, res) => {
  try {
    const user = await db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          profile_image,
          resume_url,
          skills,
          resume_text,
          created_at
        FROM users
        WHERE id = ?
      `)
      .get(req.user.id)

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const updateProfileImage = async (req, res) => {
  try {
    const profileImage =
      `/uploads/${req.file.filename}`

    await db.prepare(
      `
      UPDATE users
      SET profile_image = ?
      WHERE id = ?
    `,
    ).run(profileImage, req.user.id)

    res.json({
      message:
        'Profile image uploaded successfully',
      profileImage,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const updateResume = async (req, res) => {
  try {
    const resumeUrl =
      `/uploads/${req.file.filename}`
    const resumePath = path.join(__dirname, '..', resumeUrl)

    let skillsString = ''
    let resumeText = ''

    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
      const formData = new FormData()
      formData.append('resume', fs.createReadStream(resumePath))

      const response = await axios.post(`${aiServiceUrl}/parse-resume`, formData, {
        headers: formData.getHeaders(),
      })

      const skills = response.data.skills || []
      skillsString = skills.join(', ')
      resumeText = response.data.text || ''
    } catch (err) {
      console.error('AI Resume parsing failed:', err.message)
    }

    await db.prepare(
      `
      UPDATE users
      SET resume_url = ?, skills = ?, resume_text = ?
      WHERE id = ?
    `,
    ).run(resumeUrl, skillsString, resumeText, req.user.id)

    const message = skillsString.length > 0 
      ? 'Resume uploaded and parsed successfully' 
      : 'Resume uploaded, but we could not extract your skills automatically. Please ensure your resume is text-readable.'

    res.json({
      message,
      resumeUrl,
      skills: skillsString,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

module.exports = {
  getProfile,
  updateProfileImage,
  updateResume,
}