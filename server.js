const express = require('express')
const connectDB = require('./config/db')
const colors = require('colors')

// Initialize express app
const app = express()

// Connect to database
connectDB()

// Initialize middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API Running'))

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.magenta.bold)
})
