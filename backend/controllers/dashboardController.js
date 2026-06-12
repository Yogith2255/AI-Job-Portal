const db = require('../config/db')

const getDashboardStats = (req, res) => {
  try {
    const recruiterId = req.user.id

    const totalJobs = db
      .prepare(`
        SELECT COUNT(*) as count
        FROM jobs
        WHERE recruiter_id = ?
        AND is_active = 1
      `)
      .get(recruiterId)

    const activeJobs = db
      .prepare(`
        SELECT COUNT(*) as count
        FROM jobs
        WHERE recruiter_id = ?
        AND is_active = 1
      `)
      .get(recruiterId)

    const totalApplications = db
      .prepare(`
        SELECT COUNT(*) as count
        FROM applications
        JOIN jobs
        ON applications.job_id = jobs.id
        WHERE jobs.recruiter_id = ?
        AND jobs.is_active = 1
      `)
      .get(recruiterId)

    res.json({
      totalJobs: totalJobs.count,
      activeJobs: activeJobs.count,
      totalApplications:
        totalApplications.count,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

module.exports = {
  getDashboardStats,
}