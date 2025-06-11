
import OpenAI from 'openai';

const GROQ_API_KEY = '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';

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
        console.log('Groq-Antwort:', response.choices[0].message.content.trim());

        return response.choices[0].message.content.trim();
    } catch (err) {
        console.error('Groq-Fehler:', err.response?.data || err.message);
        return 'Fehler bei KI-Anfrage.';
    }
}
