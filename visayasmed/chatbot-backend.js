import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT =
  'You are a helpful hospital assistant for VisayasMed Hospital in the Visayas region of the Philippines. ' +
  'Provide concise, accurate information about hospital services, departments, schedules, locations, ' +
  'admission procedures, and general guidance. ' +
  'Do NOT provide medical diagnosis, treatment recommendations, or medication advice. ' +
  'If asked about symptoms or treatments, politely redirect the user to consult a licensed physician. ' +
  'Rely strictly on the Additional Context provided below to answer user questions. If the answer is not found in the context, politely inform the user that you do not have that specific information and recommend they contact the hospital directly.';

app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  const provider = req.query.provider || (OPENAI_API_KEY ? 'openai' : 'gemini');

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const finalPrompt = context 
    ? `${SYSTEM_PROMPT}\n\nAdditional Context from Website (Use this information to answer if relevant):\n${context}`
    : SYSTEM_PROMPT;

  try {
    if (provider === 'gemini') {
      if (!GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'Gemini API key not configured. Add GEMINI_API_KEY to your .env file.',
        });
      }

      const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${finalPrompt}\n\nUser: ${message}`,
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          error: data.error?.message || 'Gemini API error',
        });
      }

      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not generate a response at this time.';
      return res.json({ reply });
    } else {
      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your .env file.',
        });
      }

      const response = await fetch(OPENAI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: finalPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          error: data.error?.message || 'OpenAI API error',
        });
      }

      return res.json({
        reply: data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.',
      });
    }
  } catch (err) {
    console.error('Backend error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`VisayasMed Chatbot Backend running on http://localhost:${PORT}`);
  console.log(`  Provider: ${OPENAI_API_KEY ? 'OpenAI' : GEMINI_API_KEY ? 'Gemini' : 'NONE (set GEMINI_API_KEY or OPENAI_API_KEY in .env)'}`);
});
