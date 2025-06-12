import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

const pages = ['Calendar'];

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'green', color: 'white' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        planmymeal
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        {pages.map((page) => {
                            const isActive = location.pathname === `/${page.toLowerCase()}`;
                            return (
                                <Button
                                    key={page}
                                    component={Link}
                                    to={`/${page.toLowerCase()}`}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        backgroundColor: isActive ? 'darkgreen' : 'transparent',
                                        display: 'block',
                                    }}
                                >
                                    {page}
                                </Button>
                            );
                        })}
                    </Box>
                    <IconButton
                        onClick={handleLoginClick}
                        sx={{ color: 'white' }}
                        aria-label="Login"
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;