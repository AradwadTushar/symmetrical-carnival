require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SessionsClient } = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid'); // to generate session ID

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection


// Replace 'yourActualPassword' with your actual MongoDB password
mongoose.connect('mongodb+srv://aradwadtushar72:29-05-2004@cluster0.3kp5z.mongodb.net/ai-counseling-web-app?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Atlas connected successfully');
}).catch(err => {
  console.error('MongoDB Atlas connection error:', err);
});


// Example route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.listen(3002, () => console.log('Server running on port 3001'));


// chat route
/* const { SessionsClient } = require('@google-cloud/dialogflow');
const sessionClient = new SessionsClient();

app.post('/chat', async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath('your-project-id', 'session-id');
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode: 'en-US',
      },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  res.json({ reply: response.queryResult.fulfillmentText });
});
 */

app.use(bodyParser.json()); // To parse JSON data

const sessionClient = new SessionsClient();
const projectId = 'ai-counsel-web-app';  // Replace with your Dialogflow project ID

// Define the /chat route to handle messages
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;  // Receive message and userId from frontend
  console.log("Message received from frontend:", message);

  // Generate a session ID (unique for each user or conversation)
  const sessionId = userId || uuidv4();  // Use userId if available, otherwise generate one

  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // Dialogflow request
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,  // The message sent from the frontend
        languageCode: 'en-US',
      },
    },
  };

  // Call Dialogflow to detect the intent
  const [response] = await sessionClient.detectIntent(request);

  // Send the response from Dialogflow back to the frontend
  res.json({ reply: response.queryResult.fulfillmentText });
});

app.listen(3001, () => console.log('Server running on port 3001'));

const Session = require('./models/Session');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

app.post('/chat', async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath('ai-counsel-web-app', 'session-id');
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode: 'en-US',
      },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  
  const sentimentResult = sentiment.analyze(req.body.message);
  
  await Session.create({
    userId: req.body.userId,  // Assuming you have user management in place
    message: req.body.message,
    sentiment: sentimentResult.score >= 0 ? 'positive' : 'negative',
  });

  res.json({ reply: response.queryResult.fulfillmentText });
});

