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

export default function Login() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const { sendAuthEmail, status, user } = useAuth();

    const router = useRouter();

    if (status === 'authenticated') {
        if (user && user.role === 'admin') {
            router.replace("/admin");
        } else {
            router.replace("/");
        }
    }

    const signIn = async (e: any) => {
        e.preventDefault()
        await sendAuthEmail(email.trim())
        setEmailSent(true)
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
            <Box component="form" onSubmit={signIn} noValidate style={{ marginTop: 24, padding: 24, backgroundColor: '#eee', borderRadius: 6, width: 380 }}>
                {!emailSent && (
                    <>
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                        Sign In
                        </Button>
                    </>
                )}

                {(emailSent && (
                    <>
                        A sign-in link has been sent to your email.
                    </>
                ))}
            </Box>
        </Box>
      </Container>
  );
}