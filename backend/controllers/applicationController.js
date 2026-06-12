const db = require('../config/db')

const applyForJob = (req, res) => {
  try {
    const {jobId} = req.body

    const job = db
      .prepare(
        `
        SELECT *
        FROM jobs
        WHERE id = ?
        AND is_active = 1
      `,
      )
      .get(jobId)

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      })
    }

    const existingApplication = db
      .prepare(
        `
        SELECT *
        FROM applications
        WHERE job_id = ?
        AND user_id = ?
      `,
      )
      .get(jobId, req.user.id)

    if (existingApplication) {
      return res.status(400).json({
        message: 'Already applied for this job',
      })
    }

    const result = db
      .prepare(
        `
        INSERT INTO applications(
          job_id,
          user_id
        )
        VALUES (?, ?)
      `,
      )
      .run(jobId, req.user.id)

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const updateApplicationStatus = (req, res) => {
  try {
    const {applicationId} = req.params
    const {status} = req.body

    const application = db
      .prepare(
        `
        SELECT applications.*, jobs.recruiter_id
        FROM applications
        JOIN jobs
        ON applications.job_id = jobs.id
        WHERE applications.id = ?
      `,
      )
      .get(applicationId)

    if (!application) {
      return res.status(404).json({
        message: 'Application not found',
      })
    }

    if (
      application.recruiter_id !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    db.prepare(
      `
      UPDATE applications
      SET status = ?
      WHERE id = ?
    `,
    ).run(status, applicationId)

    res.json({
      message:
        'Application status updated successfully',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const getMyApplications = (req, res) => {
  try {
    const applications = db
      .prepare(
        `
        SELECT
          applications.id,
          applications.status,
          applications.applied_at,

          jobs.title,
          jobs.company,
          jobs.company_logo,
          jobs.location,
          jobs.salary,
          jobs.experience,
          jobs.job_type

        FROM applications
        JOIN jobs
        ON applications.job_id = jobs.id

        WHERE applications.user_id = ?

        ORDER BY applications.applied_at DESC
      `,
      )
      .all(req.user.id)

    res.json(applications)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const getJobApplicants = (req, res) => {
  try {
    const {jobId} = req.params

    const job = db
      .prepare(
        `
        SELECT *
        FROM jobs
        WHERE id = ?
      `,
      )
      .get(jobId)

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      })
    }

    if (job.recruiter_id !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    const applicants = db
      .prepare(
        `
        SELECT
          applications.id,
          applications.status,
          applications.applied_at,

          users.id AS user_id,
          users.name,
          users.email,
          users.resume_url

        FROM applications
        JOIN users
        ON applications.user_id = users.id

        WHERE applications.job_id = ?

        ORDER BY applications.applied_at DESC
      `,
      )
      .all(jobId)

    res.json(applicants)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
}