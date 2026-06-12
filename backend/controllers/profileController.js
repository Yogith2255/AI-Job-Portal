const db = require('../config/db')

const getProfile = (req, res) => {
  try {
    const getProfile = (req, res) => {
  const user = db
    .prepare(`
      SELECT
        id,
        name,
        email,
        role,
        profile_image,
        resume_url,
        created_at
      FROM users
      WHERE id = ?
    `)
    .get(req.user.id)

  res.json(user)
}
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const updateProfileImage = (req, res) => {
  try {
    const profileImage =
      `/uploads/${req.file.filename}`

    db.prepare(
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

const updateResume = (req, res) => {
  try {
    const resumeUrl =
      `/uploads/${req.file.filename}`

    db.prepare(
      `
      UPDATE users
      SET resume_url = ?
      WHERE id = ?
    `,
    ).run(resumeUrl, req.user.id)

    res.json({
      message:
        'Resume uploaded successfully',
      resumeUrl,
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