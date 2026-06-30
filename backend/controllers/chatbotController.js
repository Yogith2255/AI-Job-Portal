const axios = require('axios')

const db = require('../config/db')

const askCareerAssistant = async (
  req,
  res,
) => {
  try {
    const {question} = req.body

    const user = await db
      .prepare(
        `
        SELECT *
        FROM users
        WHERE id = ?
      `,
      )
      .get(req.user.id)

    const jobs = await db
      .prepare(
        `
        SELECT title, skills
        FROM jobs
        WHERE is_active = 1
      `,
      )
      .all()

    const jobsContext = jobs
      .map(
        job =>
          `${job.title}: ${job.skills}`,
      )
      .join('\n')

    const userSkills = user && user.skills
      ? user.skills.split(',').map(s => s.trim())
      : []

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/career-chat`,
      {
        question,
        resume_skills: userSkills,
        jobs_context: jobsContext,
      },
    )

    res.json(response.data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Chatbot Error',
    })
  }
}

const getResumeCoaching = async (req, res) => {
  try {
    const user = await db
      .prepare(`
        SELECT *
        FROM users
        WHERE id = ?
      `)
      .get(req.user.id)

    if (!user || !user.resume_text) {
      return res.status(400).json({
        message: 'Please upload a resume in your Profile page first.',
      })
    }

    const jobs = await db
      .prepare(`
        SELECT title, skills
        FROM jobs
        WHERE is_active = 1
      `)
      .all()

    const jobsContext = jobs
      .map(job => `${job.title}: ${job.skills}`)
      .join('\n')

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/resume-coaching`,
      {
        resume_text: user.resume_text,
        resume_skills: user.skills || '',
        jobs_context: jobsContext,
      },
    )

    res.json(response.data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Coaching Error',
    })
  }
}

module.exports = {
  askCareerAssistant,
  getResumeCoaching,
}