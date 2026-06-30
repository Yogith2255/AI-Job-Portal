const db = require('../config/db')

const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user.id

    // Total jobs in the entire portal
    const totalJobs = await db
      .prepare(`
        SELECT COUNT(*) as count
        FROM jobs
        WHERE is_active = 1
      `)
      .get()

    // Active jobs belonging to this recruiter
    const activeJobs = await db
      .prepare(`
        SELECT COUNT(*) as count
        FROM jobs
        WHERE recruiter_id = ?
        AND is_active = 1
      `)
      .get(recruiterId)

    const totalApplications = await db
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
      totalJobs: parseInt(totalJobs?.count || 0, 10),
      activeJobs: parseInt(activeJobs?.count || 0, 10),
      totalApplications: parseInt(totalApplications?.count || 0, 10),
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