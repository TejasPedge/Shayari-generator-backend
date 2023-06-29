require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 8080; // Use any port number you prefer
app.use(cors());
// Set up OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const generateShayari = async (messages,res) => {
  try {
     const response = await openai.createChatCompletion({
        model :  "gpt-3.5-turbo",
        messages : messages,
        max_tokens : 100
    });
    return response;
  } catch (error) {
    res.send({error : "unable to generate shayari"});
    console.error('Error:', error);
  }
};


const messeges = [
       {role : 'system', content : 'you are a shayari generator, you generates a shayari on word provided by user'},
    ];


app.get('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:word', async (req, res) => {
  try {

    const { word } = req.params;
    // Logic to generate the Shayari using OpenAI API
    messeges.push({role: 'user', content : word});
    
    const response = await generateShayari(messeges,res);

    // Send the generated Shayari as the response

    messeges.push(response.data.choices[0].message);

    let shayari = response.data.choices[0].message.content;

    res.json({ shayari });

  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



app.listen(port, () => {
  console.log('listening on port', port);
});

