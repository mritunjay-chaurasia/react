import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Paper from '@mui/material/Paper';
import PaymentForm from './SubComponents/PaymentForm.js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://google.com/">
                AsterAi
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

function Billing({ user, setUser, handleClose, selectedPlan }) {
    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, width: "500px" }}>
                <Typography component="h1" variant="h4" align="center">
                    Add Card
                </Typography>
                <Container sx={{ pt: 3, pb: 5 }}>
                    <Elements stripe={stripePromise} ><PaymentForm user={user} setUser={setUser} handleClose={handleClose} selectedPlan={selectedPlan} /></Elements>
                </Container>
            </Paper>
            <Copyright />
        </Container>
    );
}

export default Billing;
