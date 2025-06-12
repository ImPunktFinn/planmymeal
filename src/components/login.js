import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxduvwmaglnxgtthdpph.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ZHV2d21hZ2xueGd0dGhkcHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTg5MTUsImV4cCI6MjA2NTI5NDkxNX0.J4pvTKeFxe9pOm9ixJ2bQQefmtFDCpN3qo7hGURFaWw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Login() {
    const [openSignUp, setOpenSignUp] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [personalData, setPersonalData] = useState({
        name: '',
        age: '',
        gender: '',
        intolerances: [],
        dislikes: [],
        password: '',
        confirmPassword: '',
        email: ''
    });
    const [inputValue, setInputValue] = useState({ intolerances: '', dislikes: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const steps = ['E-Mail eingeben', 'Passwort eingeben', 'persönliche Daten eingeben'];

    const handleSignUpClick = () => {
        setOpenSignUp(true);
    };
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = personalData.email;
        const password = personalData.password;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            console.log('Login erfolgreich!', data);
            // z.B. weiterleiten oder Zustand setzen
        }
    };


    const handleCloseSignUp = async () => {

        if (activeStep < steps.length - 1) return;

        const {name, age, gender, intolerances, dislikes, password} = personalData;
        const email = personalData.email;
        console.log(name, age, gender, intolerances, dislikes, password, email);
        const {data: signUpData, error: signUpError} = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setErrorMessage(signUpError.message);
            return;
        }

        const user = signUpData?.user;
        if (user) {
            const {error: profileError} = await supabase
                .from('profiles')
                .insert([{
                    id: user.id,
                    name,
                    age: parseInt(age),
                    gender,
                    intolerances,
                    dislikes
                }]);

            if (profileError) {
                setErrorMessage(profileError.message);
                return;
            }

            console.log("Benutzer erfolgreich registriert!");
            setOpenSignUp(false);
            setActiveStep(0);
        }
    };

    const handleNext = () => {
        const { password, confirmPassword } = personalData;

        if (activeStep === 1) {
            if (!password || !confirmPassword) {
                setErrorMessage('Passwörter dürfen nicht leer sein!');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMessage('Die Passwörter stimmen nicht überein!');
                return;
            }
        }

        setErrorMessage('');
        setActiveStep((prevStep) => prevStep + 1);
    };

    const isNextDisabled = activeStep === 1 && (!personalData.password || !personalData.confirmPassword || personalData.password !== personalData.confirmPassword);

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleChange = (field, value) => {
        setPersonalData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (field, value) => {
        setInputValue((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddChip = (field) => {
        if (inputValue[field].trim()) {
            setPersonalData((prev) => ({
                ...prev,
                [field]: [...prev[field], inputValue[field].trim()]
            }));
            setInputValue((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const handleDeleteChip = (field, chipToDelete) => {
        setPersonalData((prev) => ({
            ...prev,
            [field]: prev[field].filter((chip) => chip !== chipToDelete)
        }));
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-Mail-Adresse"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Passwort"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        onClick={handleLogin}
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: 'green',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            mt: 3,
                        }}
                    >
                        Login
                    </Button>
                </Box>
                <Button
                    onClick={handleSignUpClick}
                    fullWidth
                    variant="outlined"
                    sx={{
                        color: 'green',
                        textTransform: 'none',
                        borderRadius: '8px',
                        borderColor: 'green',
                        padding: '8px 16px',
                        mt: 2,
                    }}
                >
                    SignUp
                </Button>
            </Box>

            <Dialog open={openSignUp} onClose={handleCloseSignUp}>
                <DialogTitle>
                    Registrierung
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseSignUp}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                        {steps.map((label, index) => (
                            <Step key={index} completed={activeStep > index}>
                                <StepLabel
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            color: activeStep === index ? 'lightgreen' : activeStep > index ? 'green' : 'inherit',
                                        },
                                        '& .MuiStepIcon-root': {
                                            color: activeStep === index ? 'lightgreen' : activeStep > index ? 'green' : 'inherit',
                                        },
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === 0 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="signup-email"
                            label="E-Mail-Adresse"
                            name="email"
                            autoComplete="email"
                            value={personalData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            autoFocus
                        />
                    )}
                    {activeStep === 1 && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Passwort"
                                type="password"
                                id="signup-password"
                                autoComplete="new-password"
                                value={personalData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirm-password"
                                label="Passwort bestätigen"
                                type="password"
                                id="signup-confirm-password"
                                autoComplete="new-password"
                                value={personalData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            />
                            {errorMessage && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                        </>
                    )}
                    {activeStep === 2 && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="signup-name"
                                label="Name"
                                value={personalData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="signup-age"
                                label="Alter"
                                type="number"
                                value={personalData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="gender-label">Geschlecht</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="signup-gender"
                                    value={personalData.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                >
                                    <MenuItem value="male">Männlich</MenuItem>
                                    <MenuItem value="female">Weiblich</MenuItem>
                                    <MenuItem value="other">Andere</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{ mt: 2 }}>
                                <Typography>Intoleranzen:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {personalData.intolerances.map((chip, index) => (
                                        <Chip
                                            key={index}
                                            label={chip}
                                            onDelete={() => handleDeleteChip('intolerances', chip)}
                                        />
                                    ))}
                                </Box>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Intoleranzen hinzufügen (mit Komma getrennt)"
                                    value={inputValue.intolerances}
                                    onChange={(e) => handleInputChange('intolerances', e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === ',' || e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddChip('intolerances');
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography>Abneigungen:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {personalData.dislikes.map((chip, index) => (
                                        <Chip
                                            key={index}
                                            label={chip}
                                            onDelete={() => handleDeleteChip('dislikes', chip)}
                                        />
                                    ))}
                                </Box>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Abneigungen hinzufügen (mit Komma getrennt)"
                                    value={inputValue.dislikes}
                                    onChange={(e) => handleInputChange('dislikes', e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === ',' || e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddChip('dislikes');
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {activeStep > 0 && (
                        <Button
                            onClick={handleBack}
                            sx={{
                                color: 'green',
                                textTransform: 'none',
                            }}
                        >
                            Zurück
                        </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            disabled={isNextDisabled}
                            sx={{
                                backgroundColor: isNextDisabled ? 'grey' : 'green',
                                color: 'white',
                                textTransform: 'none',
                            }}
                        >
                            Weiter
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCloseSignUp}
                            sx={{
                                backgroundColor: 'green',
                                color: 'white',
                                textTransform: 'none',
                            }}
                        >
                            Registrieren
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Login;