import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import ScienceIcon from '@mui/icons-material/Science';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import GavelIcon from '@mui/icons-material/Gavel';
import { useAppStore } from '../../store/appStore';

const NAV_ITEMS = [
  { to: '/', icon: <MapIcon />, label: 'Network Map', key: 'network' },
  { to: '/analytics', icon: <AnalyticsIcon />, label: 'Route Analytics', key: 'analytics' },
  { to: '/editor', icon: <EditRoadIcon />, label: 'Route Editor', key: 'editor' },
  { to: '/dispatch', icon: <GavelIcon />, label: 'Dispatch Command', key: 'dispatch' },
  { to: '/simulation', icon: <ScienceIcon />, label: 'Simulation', key: 'simulation' },
  { to: '/fleet', icon: <DirectionsBusIcon />, label: 'Fleet Status', key: 'fleet' },
  { to: '/settings', icon: <SettingsIcon />, label: 'Settings', key: 'settings' },
];

export const SideNav: React.FC = () => {
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        height: '100%',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <Box sx={{ p: '24px 24px 16px' }}>
        <Typography variant="h6" sx={{ fontSize: 20, fontWeight: 700, color: 'text.primary', letterSpacing: -0.5 }}>
          Pilsen Pulse
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary', mt: 0.5, display: 'block' }}>
          Transit Command
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 1, py: 1 }}>
        <List sx={{ p: 0 }}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.25 }}>
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
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: { sx: { fontSize: 14, fontWeight: 'inherit' } }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Report Disruption + Logout */}
      <Box sx={{ p: 2, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          color="warning"
          startIcon={<WarningIcon />}
          sx={{
            mb: 1.5,
            py: 1.25,
            borderRadius: 3,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            boxShadow: '0 4px 14px 0 rgba(251, 138, 0, 0.39)',
          }}
        >
          Report Disruption
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon sx={{ fontSize: 14 }} />}
          sx={{
            fontSize: 11,
            color: 'text.secondary',
            borderColor: 'divider',
            '&:hover': {
              color: 'error.main',
              borderColor: 'error.main',
            }
          }}
        >
          Odhlásit se
        </Button>
      </Box>
    </Box>
  );
};
