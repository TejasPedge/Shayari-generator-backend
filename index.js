require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 8080; // Use any port number you prefer
app.use(cors());

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Maximum 5 requests per hour
  message: { error: 'Rate limit exceeded. Please try again after 1 hour.' },
});

// Apply rate limiter middleware
app.use(limiter);

// Set up OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const generateShayari = async (word, res) => {
  try {
    const messages = [
      { role: 'system', content: `you are a shayari generator, you generate shayari on the word "${word}" provided by the user` },
      { role: 'user', content: word }
    ];

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 100,
    });

    if (response && response.data && response.data.choices && response.data.choices.length > 0) {
      const shayari = response.data.choices[0].message.content;
      res.json({ shayari });
    } else {
      res.status(500).json({ error: 'Unable to generate shayari' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to generate shayari' });
    console.error('Error:', error);
  }
};

app.get('/generate-shayari/:word', async (req, res) => {
  try {
    const { word } = req.params;
    await generateShayari(word, res);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log('listening on port', port);
});
