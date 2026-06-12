const db = require('../config/db')

const saveJob = (req, res) => {
  try {
    const {jobId} = req.body

    const existingSavedJob = db
      .prepare(
        `
        SELECT *
        FROM saved_jobs
        WHERE user_id = ?
        AND job_id = ?
      `,
      )
      .get(req.user.id, jobId)

    if (existingSavedJob) {
      return res.status(400).json({
        message: 'Job already saved',
      })
    }

    const result = db
      .prepare(
        `
        INSERT INTO saved_jobs(
          user_id,
          job_id
        )
        VALUES (?, ?)
      `,
      )
      .run(req.user.id, jobId)

    res.status(201).json({
      message: 'Job saved successfully',
      savedJobId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const getSavedJobs = (req, res) => {
  try {
    const jobs = db
      .prepare(
        `
        SELECT
  saved_jobs.id AS saved_id,

  jobs.id,
  jobs.title,
  jobs.company,
  jobs.company_logo,
  jobs.location,
  jobs.salary,
  jobs.experience,
  jobs.job_type

FROM saved_jobs
JOIN jobs
ON saved_jobs.job_id = jobs.id

WHERE saved_jobs.user_id = ?

ORDER BY saved_jobs.id DESC
      `,
      )
      .all(req.user.id)

    res.json(jobs)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const removeSavedJob = (req, res) => {
  try {
    const {id} = req.params

    const savedJob = db
      .prepare(
        `
        SELECT *
        FROM saved_jobs
        WHERE id = ?
      `,
      )
      .get(id)

    if (!savedJob) {
      return res.status(404).json({
        message: 'Saved job not found',
      })
    }

    if (savedJob.user_id !== req.user.id) {
      return res.status(403).json({
        message: 'Access denied',
      })
    }

    db.prepare(
      `
      DELETE FROM saved_jobs
      WHERE id = ?
      `,
    ).run(id)

    res.json({
      message: 'Saved job removed successfully',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob,
}