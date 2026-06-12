const express = require('express')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const upload = require(
  '../middleware/uploadMiddleware',
)

const {
  getProfile,
  updateProfileImage,
  updateResume,
} = require('../controllers/profileController')

router.get(
  '/',
  authMiddleware,
  getProfile,
)

router.post(
  '/upload-image',
  authMiddleware,
  upload.single('image'),
  updateProfileImage,
)

router.post(
  '/upload-resume',
  authMiddleware,
  upload.single('resume'),
  updateResume,
)

module.exports = router