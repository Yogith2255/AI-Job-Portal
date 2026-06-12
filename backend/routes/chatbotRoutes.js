const express = require('express')

const router = express.Router()

const authMiddleware = require(
  '../middleware/authMiddleware',
)

const {
  askCareerAssistant,
} = require(
  '../controllers/chatbotController',
)

router.post(
  '/',
  authMiddleware,
  askCareerAssistant,
)

module.exports = router