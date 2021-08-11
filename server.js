import express from 'express'
import connectDB from './config/db.js'
import colors from 'colors'

// Initialize express app
const app = express()

// Connect to database
connectDB()

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => res.send('API Running'))

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.magenta.bold)
})
