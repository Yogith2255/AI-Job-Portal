const express = require('express')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

const {
  registerUser,
  loginUser,
  getProfile,
} = require('../controllers/authController')

router.get('/test', (req, res) => {
  res.json({
    message: 'Auth route working',
  })
})
router.get(
  '/profile',
  authMiddleware,
  getProfile,
)

router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports = router