/*
Finalni revize - 100%
 */

import React, {useState} from 'react'
import {Alert, Button, Fade, TextField} from '@mui/material'
import {useAppStore} from '../store/appStore'

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuthenticated = useAppStore((s) => s.setAuthenticated)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (password === import.meta.env.VITE_DEMO_PASSWORD) setAuthenticated(true)
      else {
        setError('Nesprávné heslo. Zkuste znovu.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative text-white">
      <div
        className="fixed inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#10a4ff 1px, transparent 1px), linear-gradient(90deg, #10a4ff 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <Fade in timeout={1000}>
        <div
          className="w-[90%] sm:w-100 p-10 rounded-3xl bg-slate/70 backdrop-blur-xl border border-[#10a4ff]/20 relative z-10 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-1 text-black">Správa MHD Plzeň</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <span
                className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2 block">Heslo dispečera</span>
              <TextField
                type="password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                fullWidth autoFocus error={!!error}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '& .MuiOutlinedInput-root': {borderRadius: 2}
                }}
              />
              {error && <Alert severity="error" className="mt-2 py-0 text-xs font-bold">{error}</Alert>}
            </div>

            <Button
              type="submit" disabled={loading || !password} variant="contained" sx={{color: 'white'}}
              className="py-3 rounded-xl font-black text-xs bg-[#10a4ff] hover:bg-blue-500 shadow-[0_8px_16px_rgba(16,164,255,0.2)]"
            >
              {loading ? 'Ověřování...' : 'Přihlásit se'}
            </Button>
          </form>

          <p className="text-center text-[10px] text-slate-400 mt-6 opacity-60">Tomáš Elexa | A24B0101P</p>
        </div>
      </Fade>

      <p className="text-[10px] text-slate-600 mt-8 z-10">Výchozí heslo: uur2026</p>
    </div>
  )
}