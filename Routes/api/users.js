const express = require('express')
const router = express.Router()
// Bring in Express Validator (check for documentaion at: https://express-validator.github.io/docs/)
const { body, validationResult } = require('express-validator')

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
  (req, res) => {
    // Check for errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    res.send('User Route')
  }
)

module.exports = router
