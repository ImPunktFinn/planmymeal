
import OpenAI from 'openai';

const GROQ_API_KEY = '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';
const ENGINE_ID = 'mistral-7b-instruct'; // Beispiel-Engine

export async function generateRecipe(day) {
    try {
        const client = new OpenAI({
            apiKey: GROQ_API_KEY,
            dangerouslyAllowBrowser: true, // Nur für Browser-Umgebungen
            baseURL: "https://api.groq.com/openai/v1"
        });

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Beispielmodell
            messages: [
                {
                    role: 'user',
                    content: `Erstelle ein Rezept für den ${day} mit folgender Struktur: 1. Titel des Rezepts, 2. Zutaten (mit Mengenangaben), 3. Zubereitungsschritte (nummeriert), 4. (Optional) Nährwertangaben.`,
                },
            ],
        });
        console.log('Groq-Antwort:', response.choices[0].message.content.trim());

        return response.choices[0].message.content.trim();
    } catch (err) {
        console.error('Groq-Fehler:', err.response?.data || err.message);
        return 'Fehler bei KI-Anfrage.';
    }
}
