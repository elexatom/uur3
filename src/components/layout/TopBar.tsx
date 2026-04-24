import React from 'react';
import {useLocation} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Button,
  Avatar,
  Tooltip,
} from '@mui/material';

import SensorsIcon from '@mui/icons-material/Sensors';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {useAppStore} from '../../store/appStore';

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  '/': {title: 'Mapa Sítě', subtitle: 'LIVE'},
  '/analytics': {title: 'Analytics'},
  '/editor': {title: 'Editor', subtitle: 'LIVE'},
  '/simulation': {title: 'Simulation', subtitle: 'ACTIVE SIMULATION MODE'},
  '/fleet': {title: 'Fleet', subtitle: 'LIVE'},
  '/settings': {title: 'Nastavení', subtitle: 'System Configuration'},
};

export const TopBar: React.FC = () => {
  const location = useLocation();
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];

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
      <Toolbar sx={{justifyContent: 'space-between', px: {xs: 2, sm: 4}, height: 64}}>
        {/* Left: Title + status */}
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
          <Typography
            className={"font-bold uppercase text-md text-primary"}
            variant="h6"
          >
            {page.title}
          </Typography>
          {page.subtitle && (
            <>
              <Box className={"flex items-center gap-2"}>
                <Box sx={{position: 'relative', display: 'flex', width: 8, height: 8}}>
                  <Box
                    className="animate-ping"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      bgcolor: 'info.main',
                      opacity: 0.75,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'info.main',
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 10}}
                >
                  {page.subtitle}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Right: Search + icons */}
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2.5}}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary'}}>
            <Tooltip title="Sensors">
              <IconButton size="small" color="inherit">
                <SensorsIcon sx={{fontSize: 20}}/>
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton size="small" color="inherit">
                <Badge
                  overlap="circular"
                  anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                  variant="dot"
                  sx={{'& .MuiBadge-badge': {bgcolor: 'info.main', border: '2px solid #000e23'}}}
                >
                  <NotificationsIcon sx={{fontSize: 20}}/>
                </Badge>
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              variant="outlined"
              onClick={toggleDarkMode}
              startIcon={isDarkMode ? <LightModeIcon sx={{fontSize: 16}}/> : <DarkModeIcon sx={{fontSize: 16}}/>}
              sx={{
                borderRadius: 2,
                px: 1,
                minWidth: 'auto',
                fontSize: 11,
                fontWeight: 600,
                color: 'text.secondary',
                borderColor: 'divider',
              }}
            >
              {isDarkMode ? 'LIGHT' : 'DARK'}
            </Button>

            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'background.paper',
                border: '2px solid rgba(16, 164, 255, 0.2)',
              }}
            >
              <AdminPanelSettingsIcon sx={{fontSize: 20, color: 'primary.main'}}/>
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
