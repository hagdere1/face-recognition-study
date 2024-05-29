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

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signin, status, user } = useAuth();

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
        await signin(email.trim().toLowerCase(), password)
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
                Sign in
            </Typography>
            <Box component="form" onSubmit={submit} noValidate style={{ marginTop: 24, padding: 24, backgroundColor: '#eee', borderRadius: 6, width: 380 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
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
                    autoFocus
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    style={{ backgroundColor: '#fff' }}
                    type='password'
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Sign In
                </Button>
            </Box>
            <Box><Link href='/signup'>Sign up</Link></Box>
        </Box>
      </Container>
  );
}