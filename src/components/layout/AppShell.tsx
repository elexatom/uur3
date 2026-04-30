/*
Finalni revize - 100%
 */

import React, {useState} from 'react'
import {Outlet} from 'react-router-dom'
import {Box, Drawer} from '@mui/material'
import {SideNav} from './SideNav'
import {TopBar} from './TopBar'

export const AppShell: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  return (
    <Box
      className="flex h-screen overflow-hidden"
      sx={{bgcolor: 'background.default', color: 'text.primary'}}>
      <Drawer
        className="lg:hidden block w-60"
        open={mobileOpen}
        onClose={handleToggle}
      >
        <SideNav/>
      </Drawer>

      <Box className={`hidden lg:block shrink-0 transition-all duration-300 ${collapsed ? 'w-0' : 'w-60'}`}>
        <SideNav collapsed={collapsed}/>
      </Box>

      <Box className="flex flex-1 flex-col">
        <TopBar onToggleNav={handleToggle}/>

        <Box className="flex-1 overflow-auto">
          <Outlet/>
        </Box>
      </Box>
    </Box>
  )
}
