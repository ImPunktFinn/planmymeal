import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Calendar from './components/calendar';
import NavBar from './components/navBar';
import Login from './components/login';

function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Willkommen auf der Startseite</h1>
            <p>Nutze die Navigation oben, um zum Kalender zu gelangen.</p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;