const express = require('express')
const router = express.Router()
// Bring in Express Validator (check for documentaion at: https://express-validator.github.io/docs/)
const { body, validationResult } = require('express-validator')
// Bring in User model
const User = require('../../models/User')
// Bring in gravatar
const gravatar = require('gravatar')
// Bring in bcrypt
const bcrypt = require('bcryptjs')
// Bring in JWT
const jwt = require('jsonwebtoken')

const config = require('config')

// @route:      POST /api/users
// Description: Register a new user
// Access:      Public
router.post(
  '/',
  // express-validator middleware
  [
    // Name shouldn't be empty
    body('name', 'Name is required').not().isEmpty(),
    // Must be an email
    body('email', 'Please include a valid email').isEmail(),
    // Password must be at least 6 characters long
    body(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check for errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Destructure the request body
    const { name, email, password } = req.body

    try {
      // Check if user already exists
      let user = await User.findOne({ email })

      if (user) {
        // match the same type of error response from express-validator which is an array,
        // so we can use the same error message on the client
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })

      // Create a new instance of User (this doesn't save the user!)
      user = new User({
        name,
        email,
        avatar,
        password,
      })

      // Encrypt the password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // Save the user
      await user.save()

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
