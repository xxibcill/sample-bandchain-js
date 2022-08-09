import React from 'react'
import {
    Toolbar,
    Button,
    IconButton,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConnectWalletButton from '../components/ConnectWalletButton'

function Header() {
  return (
    <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          Band Protocol
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <ConnectWalletButton/>
    </Toolbar>
  )
}

export default Header