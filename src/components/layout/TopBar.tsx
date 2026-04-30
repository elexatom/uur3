/*
Finalni revize - 100%
 */

import React from 'react'
import {useLocation} from 'react-router-dom'
import {AppBar, Box, IconButton, Toolbar, Typography,} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const PAGE_TITLES: Record<string, { title: string }> = {
  '/': {title: 'Mapa Sítě'},
  '/editor': {title: 'Editor'},
  '/dispatch': {title: 'Krizové Situace'},
  '/simulation': {title: 'Simulace'},
  '/settings': {title: 'Nastavení'},
}

export const TopBar: React.FC<{ onToggleNav: () => void }> = ({onToggleNav}) => {
  const location = useLocation()
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/']

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        backdropFilter: 'blur(20px)',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: 40,
      }}
    >
      <Toolbar className="justify-between h-16">
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <IconButton onClick={onToggleNav} edge="start" color="inherit">
            <MenuIcon/>
          </IconButton>

          <Typography className="font-bold uppercase text-md" variant="h6">
            {page.title}
          </Typography>
        </Box>

        <Box className="flex">
          <span className="font-mono text-xs text-slate-500">Tomáš Elexa | A24B0101P</span>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
