import React, {useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import {Box} from '@mui/material';
import {SideNav} from './SideNav';
import {TopBar} from './TopBar';
import {useAppStore} from '../../store/appStore';

export const AppShell: React.FC = () => {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  return (
    <Box
      sx={{display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary'}}>
      <SideNav/>{/*TODO: consolidace sidebar*/}
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <TopBar/> {/*TODO: konsolidace topbar*/}
        <Box component="main" sx={{flex: 1, overflow: 'hidden', position: 'relative'}}>
          <Outlet/>
        </Box>
      </Box>
    </Box>
  );
};
