const express = require('express')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController')

router.get(
  '/',
  authMiddleware,
  getAllJobs,
)

router.get(
  '/my-jobs',
  authMiddleware,
  roleMiddleware('recruiter'),
  getMyJobs,
)

router.get(
  '/:id',
  authMiddleware,
  getJobById,
)

router.post(
  '/',
  authMiddleware,
  roleMiddleware('recruiter'),
  createJob,
)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('recruiter'),
  updateJob,
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('recruiter'),
  deleteJob,
)

module.exports = router