const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
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

module.exports = router
