// server.js
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');


const app = express();
app.use(cors()); // oder spezifische Origin
app.use(express.json());

const GROQ_API_KEY = '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';
const client = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

app.post('/api/generate-recipe', async (req, res) => {
    const { day } = req.body;

    try {
        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: 'user',
                    content: `Erstelle ein Rezept für den ${day} mit folgender Struktur:
                    **Titel:** [Rezeptname]
                    **Zutaten:**
                    - [Zutat 1]
                    - [Zutat 2]
                    - [Zutat ...]
                    **Zubereitungsschritte:**
                    1. [Schritt 1]
                    2. [Schritt 2]
                    3. [Schritt ...]
                    **Nährwertangaben:** [Kalorien, Proteine, Fette, Kohlenhydrate]`,
                },
            ],
        });

        res.json({ recipe: response.choices[0].message.content.trim() });
    } catch (err) {
        console.error('Fehler bei Groq:', err.response?.data || err.message);
        res.status(500).json({ error: 'Fehler bei der Rezeptgenerierung.' });
    }
});

app.listen(4567, () => console.log('Server läuft auf Port 4567'));
