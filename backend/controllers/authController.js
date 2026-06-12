const bcrypt = require('bcrypt')

const db = require('../config/db')

const registerUser = async (req, res) => {
  try {
    const {name, email, password, role} = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'All fields are required',
      })
    }

    const existingUser = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email)

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = db
      .prepare(
        `
        INSERT INTO users(name,email,password,role)
        VALUES(?,?,?,?)
      `,
      )
      .run(name, email, hashedPassword, role)

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}
const getProfile = (req, res) => {
  try {
    const user = db
      .prepare(`
        SELECT
          id,
          name,
          email,
          role,
          profile_image,
          resume_url,
          created_at
        FROM users
        WHERE id = ?
      `)
      .get(req.user.id)

    res.json(user)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}
const generateToken = require('../utils/generateToken')

const loginUser = async (req, res) => {
    
  try {
    const {email, password} = req.body

    const user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email)
    

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password,
    )
    

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: 'Invalid credentials',
      })
    }
    
    const token = generateToken(user)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server Error',
    })
  }
}
module.exports = {
  registerUser,
  loginUser,
  getProfile,
}