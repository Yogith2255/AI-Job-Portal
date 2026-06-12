const express = require('express')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const {
  saveJob,
  getSavedJobs,
  removeSavedJob,
} = require('../controllers/savedJobController')

router.post(
  '/save',
  authMiddleware,
  roleMiddleware('jobseeker'),
  saveJob,
)

router.get(
  '/',
  authMiddleware,
  roleMiddleware('jobseeker'),
  getSavedJobs,
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('jobseeker'),
  removeSavedJob,
)

module.exports = router