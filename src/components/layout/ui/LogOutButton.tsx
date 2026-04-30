/*
Finalni revize - 100%
 */

import {Box, Button} from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import React from "react"

export const LogOutButton: React.FC<{ handleLogout: () => void }> = ({handleLogout}) =>
  <Box sx={{p: 2, pb: 3}}>
    <Button
      fullWidth
      variant="outlined"
      color="inherit"
      onClick={handleLogout}
      startIcon={<LogoutIcon sx={{fontSize: 14}}/>}
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