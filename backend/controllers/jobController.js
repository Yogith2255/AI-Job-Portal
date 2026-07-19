const db = require('../config/db')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      company_logo,
      location,
      salary,
      description,
      skills,
      experience,
      job_type,
    } = req.body

    if (!title || !company || !location) {
      return res.status(400).json({
        message: 'Title, company, and location are required',
      })
    }

    const result = await db
      .prepare(
        `INSERT INTO jobs (title, company, company_logo, location, salary, description, skills, experience, job_type, recruiter_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`,
      )
      .run(
        title,
        company,
        company_logo || '',
        location,
        salary || null,
        description || '',
        skills || '',
        experience || '',
        job_type || '',
        req.user.id,
      )

    res.status(201).json({
      message: 'Job created successfully',
      jobId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error('Create job error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

const getAllJobs = async (req, res) => {
  try {
    const {search, job_type, experience} =
      req.query

    let query = `
      SELECT jobs.*, users.name AS recruiter_name
      FROM jobs
      JOIN users
      ON jobs.recruiter_id = users.id
      WHERE jobs.is_active = 1
    `

    const params = []

    if (
      search &&
      search.trim() !== ''
    ) {
      query += `
      AND (
        LOWER(jobs.title) LIKE LOWER(?)
        OR LOWER(jobs.company) LIKE LOWER(?)
        OR LOWER(jobs.location) LIKE LOWER(?)
      )
    `

      const term = `%${search.trim()}%`

      params.push(term, term, term)
    }

    if (job_type) {
      query +=
        ' AND jobs.job_type = ?'

      params.push(job_type)
    }

    if (experience) {
      query +=
        ' AND jobs.experience = ?'

      params.push(experience)
    }

    query += `
      ORDER BY jobs.created_at DESC
    `

    let jobs = await db
      .prepare(query)
      .all(...params)

    // user not logged in
    if (!req.user) {
      return res.json(jobs)
    }

    const user = await db
      .prepare(`
        SELECT skills, resume_url
        FROM users
        WHERE id = ?
      `)
      .get(req.user.id)

    const hasResume = !!(user && user.resume_url && user.skills && user.skills.trim().length > 0)

    const userSkills = user && user.skills
      ? user.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : []

    for (let job of jobs) {
      const jobSkills = job.skills
        ? job.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : []

      const matched = jobSkills.filter(s => userSkills.includes(s))
      const missing = jobSkills.filter(s => !userSkills.includes(s))
      
      let score = 0
      if (jobSkills.length > 0) {
        score = Math.round((matched.length / jobSkills.length) * 100)
      }

      job.match_score = score
      job.matched_skills = matched
      job.missing_skills = missing
      job.has_resume = hasResume
    }

    jobs.sort(
      (a, b) =>
        b.match_score - a.match_score,
    )

    res.json(jobs)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id

    const jobs = await db
      .prepare(
        `SELECT * FROM jobs
         WHERE recruiter_id = ? AND is_active = 1
         ORDER BY created_at DESC`,
      )
      .all(recruiterId)

    res.json(jobs)
  } catch (error) {
    console.error('Get my jobs error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

const getJobById = async (req, res) => {
  try {
    const {id} = req.params

    const job = await db
      .prepare(
        `
        SELECT jobs.*, users.name AS recruiter_name
        FROM jobs
        JOIN users
        ON jobs.recruiter_id = users.id
        WHERE jobs.id = ?
        AND jobs.is_active = 1
      `,
      )
      .get(id)

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
      })
    }

    if (!req.user) {
      return res.json(job)
    }

    const user = await db
      .prepare(
        `
        SELECT skills, resume_url
        FROM users
        WHERE id = ?
      `,
      )
      .get(req.user.id)

    const hasResume = !!(user && user.resume_url && user.skills && user.skills.trim().length > 0)

    const userSkills = user && user.skills
      ? user.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : []

    const jobSkills = job.skills
      ? job.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      : []

    const matched = jobSkills.filter(s => userSkills.includes(s))
    const missing = jobSkills.filter(s => !userSkills.includes(s))
    
    let score = 0
    if (jobSkills.length > 0) {
      score = Math.round((matched.length / jobSkills.length) * 100)
    }

    job.match_score = score
    job.matched_skills = matched
    job.missing_skills = missing
    job.has_resume = hasResume

    res.json(job)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}

const updateJob = async (req, res) => {
  try {
    const { id } = req.params

    const job = await db.prepare(`SELECT * FROM jobs WHERE id = ?`).get(id)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const {
      title,
      company,
      company_logo,
      location,
      salary,
      description,
      skills,
      experience,
      job_type,
    } = req.body

    if (!title || !company || !location) {
      return res.status(400).json({
        message: 'Title, company, and location are required',
      })
    }

    await db.prepare(
      `UPDATE jobs
       SET title = ?, company = ?, company_logo = ?, location = ?,
           salary = ?, description = ?, skills = ?, experience = ?, job_type = ?
       WHERE id = ?`,
    ).run(title, company, company_logo, location, salary, description, skills, experience, job_type, id)

    res.json({ message: 'Job updated successfully' })
  } catch (error) {
    console.error('Update job error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params

    const job = await db.prepare(`SELECT * FROM jobs WHERE id = ?`).get(id)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await db.prepare(`UPDATE jobs SET is_active = 0 WHERE id = ?`).run(id)

    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Delete job error:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
}