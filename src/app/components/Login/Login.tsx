'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';

const whitelistedUsers = [
    'hgagdere@gmail.com',
    'michael@yahoo.com'
]

type LoginProps = {
    setUser: (value: any) => void
}

export default function Login({ setUser }: LoginProps) {
    const [email, setEmail] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        // const res = await fetch('/api/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email }),
        // })

        if (whitelistedUsers.includes(email)) {
            setUser({
                email,
                role: 'user',
                group: 'orphan',
                step: 2
            })
        }
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
            <Box component="form" onSubmit={handleSubmit} noValidate style={{ marginTop: 24, padding: 24, backgroundColor: '#eee', borderRadius: 6, width: 360 }}>
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
            </Box>
        </Box>
      </Container>
  );
}