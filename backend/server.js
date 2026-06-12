const express = require('express')
const cors = require('cors')
require('dotenv').config()

require('./config/db')

const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const savedJobRoutes = require('./routes/savedJobRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const uploadRoutes = require(
  './routes/uploadRoutes',
)

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
const profileRoutes = require(
  './routes/profileRoutes',
)
const chatbotRoutes = require(
  './routes/chatbotRoutes',
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/saved-jobs', savedJobRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/upload', uploadRoutes)
app.use(
  '/uploads',
  express.static('uploads'),
)
app.use(
  '/api/profile',
  profileRoutes,
)
app.use(
  '/api/chatbot',
  chatbotRoutes,
)
app.get('/', (req, res) => {
  res.json({ message: 'Job Portal API Running' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error' })
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})