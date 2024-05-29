'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const { status, signup, user } = useAuth();

    const router = useRouter();

    if (status === 'authenticated') {
        if (user && user.role === 'admin') {
            router.replace("/admin");
        } else {
            router.replace("/");
        }
    }

    const submit = async (e: any) => {
        e.preventDefault()
        if (password.length === 0) {
            alert('Must enter a password to login')
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters')
        }
        if (password !== passwordConfirmation) {
            alert('Password must match confirmation')
        }
        await signup(email.trim().toLowerCase(), password)
    }

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <h1 style={{ marginBottom: 36 }}>Face Recognition Study</h1>
            <Typography component="h2" variant="h5">
                Sign up
            </Typography>
            <Box component="form" onSubmit={submit} noValidate style={{ marginTop: 24, padding: 24, backgroundColor: '#eee', borderRadius: 6, width: 380 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    style={{ backgroundColor: '#fff' }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    style={{ backgroundColor: '#fff' }}
                    type='password'
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="passwordConfirmation"
                    label="Password Confirmation"
                    name="passwordConfirmation"
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    value={passwordConfirmation}
                    style={{ backgroundColor: '#fff' }}
                    type='password'
                />
                <Button
                    type='submit'
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Sign Up
                </Button>
            </Box>
            <Box>Already signed up? <Link href='/signin'>Sign in</Link></Box>
        </Box>
      </Container>
  );
}