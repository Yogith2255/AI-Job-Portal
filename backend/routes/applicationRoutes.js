const express = require('express')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController')



router.post(
  '/apply',
  authMiddleware,
  roleMiddleware('jobseeker'),
  applyForJob,
)
router.get(
  '/my-applications',
  authMiddleware,
  roleMiddleware('jobseeker'),
  getMyApplications,
)
router.get(
  '/job-applicants/:jobId',
  authMiddleware,
  roleMiddleware('recruiter'),
  getJobApplicants,
)
router.put(
  '/status/:applicationId',
  authMiddleware,
  roleMiddleware('recruiter'),
  updateApplicationStatus,
)

module.exports = router