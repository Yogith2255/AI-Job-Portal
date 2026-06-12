const express = require('express')

const router = express.Router()

const upload = require(
  '../middleware/uploadMiddleware',
)

const authMiddleware = require(
  '../middleware/authMiddleware',
)

const db = require('../config/db')
router.post(
  '/logo',
  upload.single('logo'),
  (req, res) => {
    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
    })
  },
)

router.post(
  '/resume',
  authMiddleware,
  upload.single('resume'),
  (req, res) => {
    const resumeUrl =
      `/uploads/${req.file.filename}`

    db.prepare(`
      UPDATE users
      SET resume_url = ?
      WHERE id = ?
    `).run(
      resumeUrl,
      req.user.id,
    )

    res.json({
      resumeUrl,
      message:
        'Resume uploaded successfully',
    })
  },
)
module.exports = router