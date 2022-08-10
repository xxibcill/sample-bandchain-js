import React from 'react'
import Link from 'next/link'
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
        <Link href="/cosmos">
          <a>Cosmos Ver.</a>
        </Link>
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