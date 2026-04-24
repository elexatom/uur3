import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Fade,
  Alert,
} from '@mui/material';
import { useAppStore } from '../store/appStore';

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (password === import.meta.env.VITE_DEMO_PASSWORD) {
        setAuthenticated(true);
      } else {
        setError('Nesprávné heslo. Zkuste znovu.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Background grid lines */}
      <Box sx={{
        position: 'fixed', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(16, 164, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 164, 255, 1) 1px, transparent 1px)',
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      <Fade in timeout={1000}>
        <Paper
          elevation={24}
          className="glass-panel"
          sx={{
            width: { xs: '90%', sm: 400 },
            padding: 6,
            borderRadius: 4,
            bgcolor: 'rgba(0, 26, 55, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 164, 255, 0.15)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="overline"
              sx={{ fontWeight: 900, color: 'primary.main', mb: 1, display: 'block' }}
            >
              THE KINETIC PULSE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -1, mb: 0.5 }}>
              Pilsen Pulse
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Transit Command
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                Heslo dispečera
              </Typography>
              <TextField
                id="dispatcher-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                fullWidth
                autoFocus
                error={!!error}
                variant="outlined"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2, py: 0, fontSize: 11, fontWeight: 600 }}>
                  {error}
                </Alert>
              )}
            </Box>

            <Button
              id="login-submit"
              type="submit"
              disabled={loading || !password}
              variant="contained"
              fullWidth
              color="primary"
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                fontWeight: 900,
                fontSize: 11,
                letterSpacing: '0.15em',
                boxShadow: '0 8px 16px rgba(16, 164, 255, 0.2)',
              }}
            >
              {loading ? 'Ověřování...' : 'Přihlásit se'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', fontSize: 10, color: 'text.secondary', mt: 3, opacity: 0.6 }}>
            Systém je monitorován. Přihlašujte se pouze s oprávněním.
          </Typography>
        </Paper>
      </Fade>

      {/* Version */}
      <Typography sx={{ fontSize: 10, color: 'text.secondary', mt: 3, opacity: 0.4, zIndex: 1 }}>
        Pilsen Pulse v1.0 · Demonstrační režim
      </Typography>
    </Box>
  );
};
