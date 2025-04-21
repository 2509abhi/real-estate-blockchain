const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const GEN_API_KEY = process.env.GEN_API_KEY;

const staticContext = `
You are an AI assistant for PropVR, a smart real estate platform in India.

Platform Features:
- Users can explore premium properties across India
- Virtual reality tours are available for each property
- All transactions are secured with blockchain
- Users can book virtual visits and interact with 3D property models
- There's a connected NFT marketplace for tokenized real estate

Your job:
- Help users understand the features
- Assist with booking virtual tours
- Explain how blockchain and NFTs are used
- Guide them through property discovery
- Be friendly, concise, and context-aware

NEVER make up features. Always say "I'm not sure" if uncertain.
`;

async function generateGeminiResponse(prompt) {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          params: { key: GEN_API_KEY }
        }
      );
  
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } catch (err) {
      console.error('Gemini error:', err.message);
      return 'Error generating Gemini response.';
    }
}
  
router.post('/gemini-chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message is required' });
  
    const prompt = `
  You are an AI assistant trained specifically for PropVR – a smart Indian real estate platform.
  
  Context:
  ${staticContext}
  
  User Message:
  ${message}
  
  Respond as a helpful assistant.
    `;
  
    try {
      const reply = await generateGeminiResponse(prompt);
      res.json({ reply });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ reply: 'Internal server error' });
    }
});

router.post('/predict-price', async (req, res) => {
  const { bedrooms, bathrooms, sqft, location, yearBuilt } = req.body;

  const prompt = `
You are a real estate pricing assistant. Based on the following details, estimate the fair market price for the house in USD:

- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Square Footage: ${sqft}
- Location: ${location}
- Year Built: ${yearBuilt}

Return only a single number (price) as your response in indian rupees, without explanation.
`;

  try {
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + GEN_API_KEY,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const prediction = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ predictedPrice: prediction });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Prediction failed' });
  }
});  

module.exports = router;
