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
            } else if (/^\*\*Nährwertangaben/i.test(line)) {
                currentSection = 'nutrition';
            } else if (/^\*\*(.+)\*\*/.test(line)) {
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

        return (
            <div>
                {sections.title && <h3>{sections.title}</h3>}

                {sections.ingredients.length > 0 && (
                    <>
                        <strong>Zutaten:</strong>
                        <ul>
                            {sections.ingredients.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}

                {sections.steps.length > 0 && (
                    <>
                        <strong>Zubereitungsschritte:</strong>
                        <ol>
                            {sections.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </>
                )}

                {sections.nutrition && (
                    <>
                        <strong>Nährwertangaben:</strong>
                        <p>{sections.nutrition.trim()}</p>
                    </>
                )}
            </div>
        );
    };


    const renderCards = () => {
        const weekDays = getWeekDays();
        return weekDays.map((day, index) => (
            <Card key={index} className="calendarCard">
                <CardContent>
                    <Typography variant="h6">
                        {day.name} - {day.date}
                    </Typography>
                    <Typography component="div">
                        {recipes[index]
                            ? formatRecipe(recipes[index])
                            : <Typography>Calendar component is under construction. Please check back later!</Typography>}

                    </Typography>
                </CardContent>
                <CardActions className="cardActions">
                    <Button
                        id={`create-recipe-button-${index}`}
                        variant="contained"
                        onClick={() => handleCreateRecipe(day, index)}
                    >
                        Create Recipe
                    </Button>
                </CardActions>
            </Card>
        ));
    };

    return (
        <div id="calendarCardCompenent">
            {renderCards()}
        </div>
    );
}