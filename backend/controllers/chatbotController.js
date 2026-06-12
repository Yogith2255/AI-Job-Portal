const axios = require('axios')

const db = require('../config/db')

const askCareerAssistant = async (
  req,
  res,
) => {
  try {
    const {question} = req.body

    const user = db
      .prepare(
        `
        SELECT *
        FROM users
        WHERE id = ?
      `,
      )
      .get(req.user.id)

    const jobs = db
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

    const response =
      await axios.post(
        'http://127.0.0.1:8000/career-chat',
        {
          question,

          resume_skills: [],

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

module.exports = {
  askCareerAssistant,
}