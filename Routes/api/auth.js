const express = require('express')
const router = express.Router()

// @route:      GET /api/auth
// Description: Test Route
// Access:      Public
router.get('/', (req, res) => res.send('Auth Route'))

module.exports = router
