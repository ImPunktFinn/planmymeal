import "./calendar.css";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";
import { generateRecipe } from '../services/recipeService';

export default function Calendar() {
    const [recipes, setRecipes] = React.useState({});

    const getWeekDays = () => {
        const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        return Array.from({ length: 7 }).map((_, index) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + index);
            return {
                name: days[day.getDay()],
                date: day.toLocaleDateString('de-DE') // Format: TT.MM.JJJJ
            };
        });
    };

    const handleCreateRecipe = async (day, index) => {
        const recipe = await generateRecipe(day.name);
        setRecipes((prev) => ({ ...prev, [index]: recipe }));
    };

    const formatRecipe = (response) => {
        if (!response) return null;

        const sections = {
            title: '',
            ingredients: [],
            steps: [],
            nutrition: ''
        };

        const lines = response.split('\n').map(line => line.trim()).filter(Boolean);

        let currentSection = '';

        for (const line of lines) {
            if (/^\*\*Zutaten:\*\*/i.test(line)) {
                currentSection = 'ingredients';
            } else if (/^\*\*Zubereitungsschritte:\*\*/i.test(line)) {
                currentSection = 'steps';
            } else if (/^\*\*Nährwertangaben:\*\*/i.test(line)) {
                currentSection = 'nutrition';
            } else if (/^\*\*(.+)\*\*/.test(line) && currentSection === '') {
                // Nur den ersten Abschnitt als Titel interpretieren
                currentSection = 'title';
                sections.title = line.replace(/^\*\*(.+)\*\*/, '$1').trim();
            } else {
                if (currentSection === 'ingredients' && line.startsWith('-')) {
                    sections.ingredients.push(line.replace(/^-/, '').trim());
                } else if (currentSection === 'steps' && /^\d+\./.test(line)) {
                    sections.steps.push(line.replace(/^\d+\.\s*/, '').trim());
                } else if (currentSection === 'nutrition') {
                    sections.nutrition += line + ' ';
                }
            }
        }

        return sections;
    };

    const renderCards = () => {
        const weekDays = getWeekDays();
        return weekDays.map((day, index) => {
            const recipe = recipes[index] ? formatRecipe(recipes[index]) : null;

            const handleOpenInNewTab = () => {
                if (recipe) {
                    const newTab = window.open();
                    newTab.document.write(`
                        <html>
    <head>
        <title>${recipe.title}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f9f9f9;
                color: #333;
            }
            h1 {
                color: #2e7d32; /* Grüner Farbton passend zum Projekt */
                text-align: center;
                margin-bottom: 20px;
            }
            strong {
                display: block;
                margin-top: 20px;
                font-size: 1.2em;
                color: #2e7d32;
            }
            ul, ol {
                margin: 10px 0;
                padding-left: 20px;
            }
            ul li, ol li {
                margin-bottom: 5px;
            }
            p {
                margin-top: 10px;
                font-size: 1em;
                line-height: 1.5;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>${recipe.title}</h1>
            <strong>Zutaten:</strong>
            <ul>
                ${recipe.ingredients.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <strong>Zubereitungsschritte:</strong>
            <ol>
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <strong>Nährwertangaben:</strong>
            <p>${recipe.nutrition.trim()}</p>
        </div>
    </body>
</html>
                    `);
                    newTab.document.close();
                }
            };

            return (
                <Card key={index} className="calendarCard">
                    <CardContent>
                        <Typography variant="h6">
                            {day.name} - {day.date}
                        </Typography>
                        <Typography component="div">
                            {recipe ? <h3>{recipe.title}</h3> : <Typography>Für diesen Tag wurde kein Rezept geplant</Typography>}
                        </Typography>
                    </CardContent>
                    <CardActions className="cardActions">
                        <Button
                            id={`create-recipe-button-${index}`}
                            sx={{
                                backgroundColor: 'green',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px'
                            }}
                            onClick={() => handleCreateRecipe(day, index)}
                        >
                            Rezept erstellen
                        </Button>
                        {recipe && (
                            <Button
                                id={`open-recipe-button-${index}`}
                                sx={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px'
                                }}
                                onClick={handleOpenInNewTab}
                            >
                                Öffnen
                            </Button>
                        )}
                    </CardActions>
                </Card>
            );
        });
    };

    return (
        <div id="calendarCardCompenent">
            {renderCards()}
        </div>
    );
}