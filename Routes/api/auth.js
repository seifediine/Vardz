const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { body, validationResult } = require('express-validator')

const User = require('../../models/User')

// @route:      GET /api/auth
// Description: Auth Route
// Access:      Public
router.get('/', auth, async (req, res) => {
  // Make a call to the database to get the user
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route:      POST /api/auth
// Description: Authenticate user & get token
// Access:      Public
router.post(
  '/',
  // express-validator middleware
  [
    // Email is required
    body('email', 'Please include a valid email').isEmail(),
    // Password is required
    body('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Destructure the request body
    const { email, password } = req.body

    try {
      // Check if user already exists
      let user = await User.findOne({ email })

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      // Return the jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Get the secret key and sign the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

module.exports = router
