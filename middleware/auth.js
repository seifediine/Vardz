const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token') // x-auth-token is the header key that we send along

  // Check if there's no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' })
  }
}
