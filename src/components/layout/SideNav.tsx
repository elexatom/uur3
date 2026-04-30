/*
Finalni revize - 100%
 */

import React from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography,} from '@mui/material'
import MapIcon from '@mui/icons-material/Map'
import EditRoadIcon from '@mui/icons-material/EditRoad'
import ScienceIcon from '@mui/icons-material/Science'
import SettingsIcon from '@mui/icons-material/Settings'
import GavelIcon from '@mui/icons-material/Gavel'
import {useAppStore} from '../../store/appStore'
import {LogOutButton} from "./ui/LogOutButton.tsx"

const NAV_ITEMS = [
  {to: '/', icon: <MapIcon/>, label: 'Mapa MHD', key: 'network'},
  {to: '/editor', icon: <EditRoadIcon/>, label: 'Editor', key: 'editor'},
  {to: '/dispatch', icon: <GavelIcon/>, label: 'Krizové situace', key: 'dispatch'},
  {to: '/simulation', icon: <ScienceIcon/>, label: 'Simulace', key: 'simulation'},
  {to: '/settings', icon: <SettingsIcon/>, label: 'Nastavení', key: 'settings'},
]

export const SideNav: React.FC<{ collapsed?: boolean }> = ({collapsed = false}) => {
  const setAuthenticated = useAppStore((s) => s.setAuthenticated)
  const navigate = useNavigate()

  const handleLogout = () => {
    setAuthenticated(false)
    navigate('/')
  }

  return (
    <Box
      component="aside"
      className={`flex z-50 flex-col h-full bg-white transition-all duration-300 overflow-hidden whitespace-nowrap ${
        collapsed ? 'w-0 border-none opacity-0' : 'w-60 border-r border-r-slate-200 opacity-100'
      }`}
    >
      <Box sx={{p: '24px 24px 16px'}}>
        <Typography variant="h6" sx={{fontSize: 20, fontWeight: 700, color: 'text.primary', letterSpacing: -0.5}}>
          MHD Plzeň
        </Typography>
        <Typography
          variant="caption"
          sx={{color: 'text.secondary', fontSize: 10}}
          className="mt-0.5 block uppercase font-bold text-gray-500 tracking-widest"
        >
          Správa dopravy
        </Typography>
      </Box>

      <Box sx={{flex: 1, px: 1, py: 1}}>
        <List sx={{p: 0}}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.key} disablePadding sx={{mb: 0.25}}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                end={item.to === '/'}
                sx={{
                  borderRadius: '0 20px 20px 0',
                  mr: 1,
                  color: 'text.secondary',
                  '&.active': {
                    bgcolor: 'rgba(16, 164, 255, 0.1)',
                    color: 'primary.main',
                    borderLeft: 3,
                    borderColor: 'primary.main',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': {color: 'primary.main'},
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{color: 'inherit', minWidth: 40, justifyContent: 'center'}}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {sx: {fontSize: 14, fontWeight: 'inherit'}}
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <LogOutButton handleLogout={handleLogout}/>
    </Box>
  )
}