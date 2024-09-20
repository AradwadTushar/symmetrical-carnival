const mongoose = require('mongoose');

// Define the schema for the session
const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // Store the user or session ID
  messages: [
    {
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  sentimentScore: { type: Number, default: 0 },  // Optional field for sentiment analysis
});

// Create the session model
const Session = mongoose.model('Session', sessionSchema);

// Export the model
module.exports = Session;
