const mongoose = require('mongoose')
const dotenv = require('dotenv')
// Get the mongoURI value from the config file
// const db = process.env.mongoURI

// Create a function to call within our server.js file
const connectDB = async () => {
  // Connect to the database
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false, // Fixed deprecation warning
    })
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.bold)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    // Exit procces with failure
    process.exit(1)
  }
}

module.exports = connectDB
