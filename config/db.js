const mongoose = require('mongoose')
const config = require('config')

// Get the mongoURI value from the config file
const db = config.get('mongoURI')

// Create a function to call within our server.js file
const connectDB = async () => {
  // Connect to the database
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('MongoDB connected...'.cyan.bold)
  } catch (err) {
    console.log(err.message)
    // Exit procces with failure
    process.exit(1)
  }
}

module.exports = connectDB
