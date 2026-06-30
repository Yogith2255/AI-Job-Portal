const express = require('express')

const router = express.Router()

const authMiddleware = require(
  '../middleware/authMiddleware',
)

const {
  askCareerAssistant,
  getResumeCoaching,
} = require(
  '../controllers/chatbotController',
)

router.post(
  '/',
  authMiddleware,
  askCareerAssistant,
)

router.post(
  '/coaching',
  authMiddleware,
  getResumeCoaching,
)

module.exports = router